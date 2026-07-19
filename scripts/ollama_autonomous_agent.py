#!/usr/bin/env python3
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
RESUME_FILE = ROOT / "resumefromhere.txt"
LOG_DIR = Path.home() / ".ollama" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
AGENT_LOG = LOG_DIR / "ollama_autonomous_agent.log"
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
MODEL_NAME = os.environ.get("OLLAMA_MODEL", "qwen2.5-coder:3b")
ENSURE_SCRIPT = ROOT / ".devcontainer" / "ensure-ollama.sh"
START_TIMEOUT = 120
OLLAMA_FALLBACK_BIN = Path.home() / ".ollama" / "bin" / "ollama"
DEFAULT_TIMEOUT = 600
DEFAULT_HEARTBEAT = 20


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def format_log_message(level: str, message: str) -> str:
    return f"{utc_timestamp()} [{level}] {message}"


def write_log(message: str, level: str = "INFO") -> None:
    formatted = format_log_message(level, message)
    with AGENT_LOG.open("a", encoding="utf-8") as fh:
        fh.write(f"{formatted}\n")


def log_context_snapshot(label: str, context: dict[str, object]) -> None:
    log(f"==> {label} snapshot", "DEBUG")
    for key, value in context.items():
        log(f"  {key}: {value}", "DEBUG")


def log(message: str, level: str = "INFO", print_to_stdout: bool = True) -> None:
    formatted = format_log_message(level, message)
    write_log(message, level)
    if print_to_stdout:
        print(formatted)
        sys.stdout.flush()


def backup_resume_file() -> None:
    if not RESUME_FILE.exists():
        return
    backup_dir = ROOT / '.backup' / 'resumefromhere'
    backup_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup_path = backup_dir / f'resumefromhere.{ts}.bak'
    shutil.copy2(RESUME_FILE, backup_path)
    write_log(f"Backed up resumefromhere.txt to {backup_path}")


def append_resume_update(lines: list[str]) -> str:
    if not RESUME_FILE.exists():
        RESUME_FILE.write_text('', encoding='utf-8')
    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    block_lines = [f"=== OLLAMA AUTONOMOUS AGENT UPDATE ({ts}Z) ==="]
    block_lines.extend([f"- {line}" for line in lines])
    block_lines.append('')
    block = '\n'.join(block_lines)

    original = RESUME_FILE.read_text(encoding='utf-8', errors='ignore')
    with tempfile.NamedTemporaryFile('w', delete=False, encoding='utf-8', dir=str(ROOT), prefix='resumefromhere-', suffix='.tmp') as tmp:
        tmp.write(original)
        tmp.write('\n')
        tmp.write(block)
        temp_path = Path(tmp.name)

    temp_path.replace(RESUME_FILE)
    write_log(f"Appended resumefromhere update: {lines}")
    return block


def update_resume_last_updated() -> None:
    if not RESUME_FILE.exists():
        return
    content = RESUME_FILE.read_text(encoding='utf-8', errors='ignore')
    updated = re.sub(
        r'^Last updated: .*$',
        'Last updated: ' + datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        content,
        count=1,
        flags=re.MULTILINE,
    )
    if updated != content:
        RESUME_FILE.write_text(updated, encoding='utf-8')


def shell_run(command, **kwargs):
    rendered = " ".join(command)
    log(f"$ {rendered}", "DEBUG")
    try:
        result = subprocess.run(command, cwd=str(ROOT), check=True, text=True, **kwargs)
        return result
    except subprocess.CalledProcessError as exc:
        log(f"COMMAND FAILED: {rendered} -> {exc}", "ERROR")
        return None


def run_command(command: list[str], description: str) -> bool:
    log(f"==> {description}: {' '.join(command)}", "INFO")
    result = shell_run(command)
    if result is None:
        log(f"ERROR: {description} failed.", "ERROR")
        return False
    return True


def ensure_ollama_environment() -> None:
    log("==> Ensuring local Ollama runtime and model environment", "INFO")
    if ENSURE_SCRIPT.exists():
        shell_run(["bash", str(ENSURE_SCRIPT)])
    else:
        log("WARNING: .devcontainer/ensure-ollama.sh is missing; continuing with best effort", "WARNING")


def get_ollama_cmd() -> str | None:
    binary = shutil.which("ollama")
    if binary:
        return binary
    if OLLAMA_FALLBACK_BIN.exists() and os.access(str(OLLAMA_FALLBACK_BIN), os.X_OK):
        return str(OLLAMA_FALLBACK_BIN)
    return None


def is_ollama_cli_available() -> bool:
    return get_ollama_cmd() is not None


def is_service_ready() -> bool:
    try:
        req = Request(f"{OLLAMA_HOST}/api/tags")
        with urlopen(req, timeout=10) as response:
            return response.status == 200
    except Exception:
        return False


def start_ollama_service() -> bool:
    if is_service_ready():
        log("Ollama service is already running.", "INFO")
        return True
    ollama_cmd = get_ollama_cmd()
    if not ollama_cmd:
        log("Ollama CLI is not available; cannot start the service from the shell.", "ERROR")
        return False

    log(f"Starting Ollama service in the background using {ollama_cmd}...", "INFO")
    env = os.environ.copy()
    if OLLAMA_FALLBACK_BIN.exists():
        env["PATH"] = str(OLLAMA_FALLBACK_BIN.parent) + ":" + env.get("PATH", "")
    build_lib_dir = Path.home() / ".ollama" / "source" / "build" / "llama-server-cpu" / "bin"
    if build_lib_dir.exists():
        env["GGML_BACKEND_PATH"] = str(build_lib_dir)
        env["LD_LIBRARY_PATH"] = str(build_lib_dir) + ":" + env.get("LD_LIBRARY_PATH", "")
        log(f"Configured GGML_BACKEND_PATH and LD_LIBRARY_PATH for source-built runtime: {build_lib_dir}", "DEBUG")
    try:
        stdout = (LOG_DIR / "ollama_serve.stdout.log").open("a", encoding="utf-8")
        stderr = (LOG_DIR / "ollama_serve.stderr.log").open("a", encoding="utf-8")
        subprocess.Popen([ollama_cmd, "serve"], cwd=str(ROOT), stdout=stdout, stderr=stderr, env=env)
    except Exception as exc:
        log(f"Failed to start Ollama service: {exc}", "ERROR")
        return False

    for attempt in range(START_TIMEOUT):
        if is_service_ready():
            log("Ollama service is now available.", "INFO")
            return True
        time.sleep(1)
    log("ERROR: Ollama service did not become available in time.", "ERROR")
    return False


BACKLOG_FILES = [ROOT / '7.txt', ROOT / '14.txt', ROOT / 'undone.txt', ROOT / 'MATCHES.txt']


def read_resumefromhere() -> str:
    if not RESUME_FILE.exists():
        print(f"ERROR: resumefromhere.txt not found at {RESUME_FILE}")
        sys.exit(1)
    return RESUME_FILE.read_text(encoding="utf-8", errors="ignore")


def extract_tasks_from_backlog_files() -> list[str]:
    backlog_tasks: list[str] = []
    for backlog_file in BACKLOG_FILES:
        if not backlog_file.exists():
            continue
        for line in backlog_file.read_text(encoding='utf-8', errors='ignore').splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith('#'):
                continue
            if re.match(r'^(?:[-*•]|\d+\.)\s+', stripped):
                task = re.sub(r'^(?:[-*•]|\d+\.)\s+', '', stripped).strip()
            elif re.match(r'^\[[ xX]\]\s+', stripped):
                task = re.sub(r'^\[[ xX]\]\s+', '', stripped).strip()
            else:
                task = stripped
            if task and task not in backlog_tasks:
                backlog_tasks.append(task)
    return backlog_tasks


def extract_tasks_from_resume(content: str) -> list[str]:
    task_lines: list[str] = []
    for line in content.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            continue
        if re.match(r'^(?:[-*•]|\d+\.)\s+', stripped):
            task = re.sub(r'^(?:[-*•]|\d+\.)\s+', '', stripped).strip()
        elif re.match(r'^\[[ xX]\]\s+', stripped):
            task = re.sub(r'^\[[ xX]\]\s+', '', stripped).strip()
        else:
            continue
        if task and task not in task_lines:
            task_lines.append(task)
    if task_lines:
        return task_lines
    return extract_tasks_from_backlog_files()


def append_resume_block(title: str, lines: list[str]) -> None:
    if not RESUME_FILE.exists():
        RESUME_FILE.write_text('', encoding='utf-8')
    ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    block_lines = [f"=== {title} ({ts}) ==="]
    block_lines.extend(lines)
    block_lines.append('')
    original = RESUME_FILE.read_text(encoding='utf-8', errors='ignore')
    with tempfile.NamedTemporaryFile('w', delete=False, encoding='utf-8', dir=str(ROOT), prefix='resumefromhere-', suffix='.tmp') as tmp:
        tmp.write(original)
        tmp.write('\n')
        tmp.write('\n'.join(block_lines))
        temp_path = Path(tmp.name)
    temp_path.replace(RESUME_FILE)
    write_log(f"Appended {title} block to resumefromhere.txt")


def append_ollama_output_summary(output: str) -> None:
    if not output:
        return
    summary_lines: list[str] = []
    for line in output.splitlines():
        if any(marker in line for marker in ['[IN PROGRESS]', '[DONE]', '[VERIFY]', '[CONFIRMED]', '[PENDING]', 'FINAL COMPLETION']):
            summary_lines.append(line)
    if not summary_lines:
        summary_lines = output.splitlines()[:40]
        if len(output.splitlines()) > 40:
            summary_lines.append('... (output truncated)')
    append_resume_block('OLLAMA AUTONOMOUS RESPONSE SUMMARY', summary_lines)


def build_execution_plan(tasks: list[str]) -> str:
    plan_lines = [
        "PRODUCTION EXECUTION PLAN:",
        "1. Inventory the repository using TREE_FULL_STRUCTURE.md, resumefromhere.txt, and the backlog files 7.txt, 14.txt, undone.txt, and MATCHES.txt.",
        "2. Reconcile and update the canonical documentation set: API.md, ENDPOINTS.md, ROUTES.md, TREE.md, MERGE.md, and TREE_FULL_STRUCTURE.md.",
        "3. Implement or wire real production modules rather than stubs, including finance/trading routes, auth/theme flows, and any referenced app entry points.",
        "4. Run the canonical consolidation scripts: scripts/consolidate_api_endpoints.py and scripts/merge_executor.py, then incorporate their results into docs and code.",
        "5. Verify the repo state with real checks, then update resumefromhere.txt with progress blocks, completion markers, and follow-up tasks.",
        "6. Never stop at a shallow implementation; confirm the real implementation path, edge cases, and dependencies before marking a task as [CONFIRMED].",
    ]
    if tasks:
        plan_lines.append("TASKS TO EXECUTE:")
        for index, task in enumerate(tasks, start=1):
            plan_lines.append(f"{index}. {task}")
    return "\n".join(plan_lines)


def build_ollama_prompt(tasks: list[str]) -> str:
    structure_inventory = ROOT / "TREE_FULL_STRUCTURE.md"
    structure_note = (
        "Use TREE_FULL_STRUCTURE.md as the canonical full repository structure inventory. "
        "Treat it as the authoritative map for top-level directories, app directories, docs clusters, config/data directories, and automation/test directories."
    )
    execution_plan = build_execution_plan(tasks)

    if not tasks:
        return (
            "You are an autonomous Ollama agent. There are no explicit tasks extracted from resumefromhere.txt. "
            "Scan the repository and the backlog files 7.txt, 14.txt, undone.txt, and MATCHES.txt. "
            f"{structure_note} "
            "Produce a clear plan, execute bulk improvements, update resumefromhere.txt, and verify readiness for production."
        )

    return (
        "You are a production-grade Ollama autonomous agent. Your mission is to complete everything listed in resumefromhere.txt "
        "and all referenced backlog files (7.txt, 14.txt, undone.txt, MATCHES.txt) for this repository. "
        f"{structure_note} "
        "Treat resumefromhere.txt as the canonical tracker and update it with progress as you work. "
        "Use bulk, parallel, and merged execution when safe. Do not stop until every task is complete and verified. "
        "For each task, do the following:\n"
        "1) Confirm the task statement.\n"
        "2) Describe the action plan.\n"
        "3) Mark the task as [IN PROGRESS], then [DONE], then [VERIFY], and finally [CONFIRMED].\n"
        "4) If the task can be completed in parallel with others, explain how you are parallelizing it.\n"
        "5) At the end, output a final completion summary with a double-check for every task.\n"
        "If you cannot complete a task, explain why and what is required.\n\n"
        f"{execution_plan}\n\n"
        "IMPORTANT: Verify completion by cross-checking file names, scripts, markdown docs, and the full repository structure inventory in this repo. "
        "Update resumefromhere.txt with progress blocks and new task markers. "
        "Only finish when all tasks have been confirmed twice."
    )


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def collect_preflight_checks() -> tuple[list[str], list[str]]:
    required_files = [
        RESUME_FILE,
        ROOT / "7.txt",
        ROOT / "14.txt",
        ROOT / "undone.txt",
        ROOT / "MATCHES.txt",
        ROOT / "TREE_FULL_STRUCTURE.md",
        ROOT / "TREE.md",
        ROOT / "MERGE.md",
        ROOT / "API.md",
        ROOT / "ENDPOINTS.md",
        ROOT / "ROUTES.md",
        ROOT / "ollama.md",
        ENSURE_SCRIPT,
        ROOT / "scripts" / "auto_continue_resumefromhere.py",
    ]
    present: list[str] = []
    missing: list[str] = []
    for path in required_files:
        if path.exists():
            present.append(display_path(path))
        else:
            missing.append(display_path(path))
    return present, missing


def report_preflight_checks() -> list[str]:
    present, missing = collect_preflight_checks()
    log("==> Preflight checks", "INFO")
    if present:
        log("  Present files:", "INFO")
        for path in present:
            log(f"    - {path}", "INFO")
    if missing:
        log("  Missing files:", "WARNING")
        for path in missing:
            log(f"    - {path}", "WARNING")
    else:
        log("  All required repo files for the Ollama workflow are present.", "INFO")
    return missing


def build_merge_plan_summary() -> str:
    summary_lines = [
        "REPO-WIDE MERGE PLAN SUMMARY",
        "Canonical docs: TREE.md, MERGE.md, API.md, ENDPOINTS.md, ROUTES.md, TREE_FULL_STRUCTURE.md",
        "Priority merge areas: duplicate app entry points, route duplicates, markdown documentation clusters, finance/trading routes, and universal auth/theme docs.",
        "Structure inventory: app/, api/, components/, lib/, docs/, data/, deploy/, tests/, and automation scripts.",
        "Next actions: sync docs to canonical files, verify route coverage, preserve backlog tasks, and keep resumefromhere.txt updated.",
    ]
    return "\n".join(summary_lines)


def append_merge_plan_summary() -> None:
    summary = build_merge_plan_summary()
    log(summary, "INFO")
    append_resume_block("REPO-WIDE MERGE PLAN SUMMARY", summary.splitlines())


def append_execution_plan(tasks: list[str]) -> None:
    plan = build_execution_plan(tasks)
    log("==> Execution plan", "INFO")
    log(plan, "INFO")
    append_resume_block("PRODUCTION EXECUTION PLAN", plan.splitlines())


def log_runtime_environment(tasks: list[str], dry_run: bool) -> None:
    context = {
        "repo_root": str(ROOT),
        "resume_file": str(RESUME_FILE),
        "ollama_host": OLLAMA_HOST,
        "model": MODEL_NAME,
        "ollama_cli": get_ollama_cmd() or "unavailable",
        "dry_run": dry_run,
        "task_count": len(tasks),
        "task_preview": tasks[:8],
        "python_executable": sys.executable,
        "python_version": sys.version.split()[0],
    }
    log_context_snapshot("runtime environment", context)


def append_execution_summary(tasks: list[str], prompt: str, dry_run: bool, elapsed: float | None = None) -> None:
    summary_lines = [
        f"Task count: {len(tasks)}",
        f"Dry run: {dry_run}",
        f"Prompt length: {len(prompt)}",
        f"Prompt preview: {prompt[:400].replace(chr(10), ' ')}",
    ]
    if elapsed is not None:
        summary_lines.append(f"Elapsed seconds: {elapsed:.2f}")
    append_resume_block("OLLAMA EXECUTION SUMMARY", summary_lines)


def has_http_support() -> bool:
    return True


def stream_process_output(process, description: str, timeout_seconds: int, heartbeat_interval: int) -> tuple[int, str]:
    output_lines: list[str] = []
    start_time = time.time()
    last_output_time = time.time()
    stop_event = threading.Event()

    def heartbeat() -> None:
        while not stop_event.is_set() and process.poll() is None:
            elapsed = int(time.time() - last_output_time)
            if elapsed >= heartbeat_interval:
                log(f"{description} heartbeat: still running with no new output for {elapsed}s", "DEBUG")
            time.sleep(1)

    heartbeat_thread = threading.Thread(target=heartbeat, daemon=True)
    heartbeat_thread.start()

    while True:
        if process.stdout is None:
            break
        line = process.stdout.readline()
        if line:
            last_output_time = time.time()
            output_lines.append(line)
            print(line.rstrip())
            sys.stdout.flush()
            continue
        if process.poll() is not None:
            break
        if time.time() - start_time > timeout_seconds:
            log(f"{description} exceeded timeout of {timeout_seconds}s; terminating", "ERROR")
            process.terminate()
            time.sleep(5)
            if process.poll() is None:
                process.kill()
            raise TimeoutError(description)
        time.sleep(0.25)

    stop_event.set()
    heartbeat_thread.join(timeout=2)
    return process.returncode, "".join(output_lines)


def run_ollama_cli(prompt: str, timeout_seconds: int, heartbeat_interval: int) -> tuple[bool, str]:
    ollama_cmd = get_ollama_cmd()
    if not ollama_cmd:
        return False, ""
    log(f"==> Sending prompt to Ollama CLI via {ollama_cmd}", "INFO")
    command = [ollama_cmd, "run", MODEL_NAME, "--prompt", prompt, "--stream", "--verbose"]
    try:
        process = subprocess.Popen(command, cwd=str(ROOT), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1, encoding="utf-8", errors="replace")
    except FileNotFoundError:
        return False, ""

    try:
        returncode, output_text = stream_process_output(process, f"Ollama CLI ({MODEL_NAME})", timeout_seconds, heartbeat_interval)
    except TimeoutError as exc:
        log(f"Ollama CLI execution timed out: {exc}", "ERROR")
        return False, ""
    return returncode == 0, output_text


def run_ollama_http(prompt: str) -> tuple[bool, str]:
    if not has_http_support():
        return False, ""
    body = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": True,
    }
    data = json.dumps(body).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    req = Request(f"{OLLAMA_HOST}/api/generate", data=data, headers=headers, method="POST")
    try:
        output_chunks = []
        with urlopen(req, timeout=600) as response:
            while True:
                chunk = response.read(4096)
                if not chunk:
                    break
                decoded = chunk.decode("utf-8", errors="ignore")
                output_chunks.append(decoded)
                sys.stdout.write(decoded)
                sys.stdout.flush()
        return True, "".join(output_chunks)
    except HTTPError as exc:
        print(f"ERROR: Ollama HTTP generation failed: {exc.code} {exc.reason}")
        return False, ""
    except URLError as exc:
        print(f"ERROR: Ollama HTTP generation connection failed: {exc}")
        return False, ""
    except Exception as exc:
        print(f"ERROR: Ollama HTTP generation unexpected error: {exc}")
        return False, ""


def ensure_model() -> None:
    log(f"==> Ensuring model {MODEL_NAME} is available", "INFO")
    try:
        req = Request(f"{OLLAMA_HOST}/api/tags")
        with urlopen(req, timeout=20) as response:
            tags = json.loads(response.read().decode("utf-8", errors="ignore"))
            if any(tag.get("name") == MODEL_NAME for tag in tags.get("models", [])):
                log(f"Model {MODEL_NAME} is already present.", "INFO")
                return
    except Exception:
        pass

    ollama_cmd = get_ollama_cmd()
    if not ollama_cmd:
        log("Ollama CLI not available; cannot pull model automatically.", "WARNING")
        return

    log(f"Pulling model {MODEL_NAME} via {ollama_cmd}...", "INFO")
    shell_run([ollama_cmd, "pull", MODEL_NAME])


def run_continuation_script() -> bool:
    continue_script = ROOT / "scripts" / "auto_continue_resumefromhere.py"
    if not continue_script.exists():
        log(f"Continue bulk script not found: {continue_script}", "WARNING")
        return False
    log("==> Running the auto-continue bulk resume script after Ollama agent completion", "INFO")
    for attempt in range(1, 3):
        log(f"Auto-continue attempt {attempt}/2", "INFO")
        if run_command([sys.executable, str(continue_script)], "run auto-continue bulk resume script"):
            return True
        time.sleep(10)
    return False


def verify_agent_completion(output: str, tasks: list[str]) -> bool:
    if not output:
        log("ERROR: No output was captured from Ollama.", "ERROR")
        return False

    lower_text = output.lower()
    confirmed_count = output.count("[CONFIRMED]")
    verify_count = output.count("[VERIFY]")
    done_count = output.count("[DONE]")
    progress_count = output.count("[IN PROGRESS]")

    if tasks:
        if progress_count < 1:
            log("WARNING: The output does not include any [IN PROGRESS] markers.", "WARNING")
            return False
        if done_count < 1:
            log("WARNING: The output does not include any [DONE] markers.", "WARNING")
            return False
        if verify_count < 1:
            log("WARNING: The output does not include any [VERIFY] markers.", "WARNING")
            return False
        if confirmed_count < 1:
            log("WARNING: The output does not include any [CONFIRMED] markers.", "WARNING")
            return False
    else:
        if confirmed_count < 1 and done_count < 1:
            log("WARNING: The output does not include completion markers for the empty-task fallback.", "WARNING")
            return False

    if "final completion summary" not in lower_text and "final completion" not in lower_text and "completion summary" not in lower_text:
        log("WARNING: The output does not appear to include a final completion summary.", "WARNING")
        return False

    if "double-check" not in lower_text and "double check" not in lower_text and "verified twice" not in lower_text:
        log("WARNING: The output does not appear to include a double-check or second-verification statement.", "WARNING")
        return False

    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ollama autonomous bulk agent runner")
    parser.add_argument("--continue", dest="continue_run", action="store_true", help="Run scripts/auto_continue_resumefromhere.py after Ollama agent completion")
    parser.add_argument("--no-continue", dest="continue_run", action="store_false", help="Do not run auto-continue after the Ollama agent (default behavior is to continue)")
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT, help="Maximum seconds to wait for Ollama CLI execution before terminating")
    parser.add_argument("--heartbeat-interval", type=int, default=DEFAULT_HEARTBEAT, help="Seconds between heartbeat logs when the Ollama process produces no output")
    parser.add_argument("--dry-run", action="store_true", help="Perform preflight checks and log the plan without sending work to Ollama")
    parser.add_argument("--merge-summary", dest="merge_summary", action="store_true", help="Generate a repo-wide merge planning summary before the Ollama run starts")
    parser.add_argument("--no-merge-summary", dest="merge_summary", action="store_false", help="Skip the repo-wide merge planning summary")
    parser.set_defaults(continue_run=True, merge_summary=False)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    log("=== Ollama Autonomous Agent Startup ===", "INFO")
    log("Starting Ollama autonomous agent run", "INFO")
    backup_resume_file()
    start_block = append_resume_update([
        "Starting Ollama autonomous bulk agent run.",
        "Ollama is instructed to work in bulk, parallel, and self-improving mode.",
        "This run will update resumefromhere.txt and continue the bulk resume workflow.",
        f"Realtime logging is enabled with UTC timestamps and watchdog heartbeats every {args.heartbeat_interval}s.",
    ])
    print(start_block)
    update_resume_last_updated()
    ensure_ollama_environment()
    if not start_ollama_service():
        log("ERROR: Unable to start Ollama service. Exiting.", "ERROR")
        append_resume_update(["Ollama service failed to start."])
        sys.exit(1)
    ensure_model()

    report_preflight_checks()

    content = read_resumefromhere()
    log_runtime_environment(tasks=[] if not content else extract_tasks_from_resume(content), dry_run=args.dry_run)
    tasks = extract_tasks_from_resume(content)
    log(f"==> Extracted {len(tasks)} actionable tasks from resumefromhere.txt", "INFO")
    if tasks:
        for i, task in enumerate(tasks, start=1):
            log(f"  {i}. {task}", "INFO")
    else:
        log("WARNING: No explicit tasks could be extracted from resumefromhere.txt.", "WARNING")

    if args.merge_summary or args.dry_run:
        append_merge_plan_summary()

    append_execution_plan(tasks)
    log_runtime_environment(tasks, dry_run=args.dry_run)

    prompt = build_ollama_prompt(tasks)
    log(f"Prompt prepared with {len(prompt)} characters and {len(tasks)} task entries.", "INFO")
    log_context_snapshot("prompt summary", {
        "prompt_length": len(prompt),
        "task_count": len(tasks),
        "prompt_head": prompt[:600],
    })
    if args.dry_run:
        log("Dry run enabled; skipping Ollama execution and only logging the planned workflow.", "INFO")
        append_resume_block("OLLAMA AGENT DRY RUN", ["Dry run enabled; no Ollama execution was performed.", "Preflight checks and merge planning summary were logged before the dry run exited."])
        return

    log("==> Running Ollama agent prompt", "INFO")
    start_time = time.time()
    success, response_text = run_ollama_cli(prompt, args.timeout, args.heartbeat_interval)
    if not success:
        log("WARNING: Ollama CLI stream failed or unavailable; falling back to HTTP API.", "WARNING")
        success, response_text = run_ollama_http(prompt)
    elapsed = time.time() - start_time
    log(f"==> Ollama agent completed in {elapsed:.1f}s", "INFO")

    append_ollama_output_summary(response_text)
    append_execution_summary(tasks, prompt, dry_run=False, elapsed=elapsed)
    append_resume_block("OLLAMA AGENT RESULT", [
        f"Ollama agent completed in {elapsed:.1f}s.",
        f"CLI success: {success}",
        f"Pending tasks found: {len(tasks)}",
        "Output summary was appended to resumefromhere.txt.",
    ])

    if not success:
        log("ERROR: Ollama agent was not able to complete the prompt successfully.", "ERROR")
        append_resume_block("OLLAMA AGENT FAILURE", ["Ollama agent prompt failed. Check terminal output and logs."])
        sys.exit(1)

    if not verify_agent_completion(response_text, tasks):
        log("ERROR: Ollama output did not include required completion verification markers.", "ERROR")
        append_resume_block("OLLAMA AGENT VERIFICATION FAILURE", ["Ollama output verification failed. The run did not produce required completion markers."])
        sys.exit(1)

    success_block = append_resume_update([
        "Ollama autonomous run finished successfully.",
        "Tasks were executed in bulk, with self-directed decisions and double verification.",
        f"Found {len(tasks)} tasks in resumefromhere.txt and verified completion markers.",
        "Realtime logging remained active throughout the run and captured any stalls or failures.",
    ])
    print(success_block)
    update_resume_last_updated()

    append_resume_block("OLLAMA AGENT VERIFICATION", [
        "Ollama output verification passed.",
        "Resumefromhere tracker updated with progress and completion markers.",
    ])

    if args.continue_run:
        if run_continuation_script():
            append_resume_update(["Auto-continue bulk resume script completed successfully."])
        else:
            append_resume_update(["Auto-continue bulk resume script did not complete successfully."])

    log("==> Ollama autonomous run finished. Review the terminal output for progress and confirmations.", "INFO")
    log("==> Check the logs at ~/.ollama/logs/ollama_autonomous_agent.log if needed.", "INFO")
    log("Ollama autonomous agent run completed successfully", "INFO")


if __name__ == "__main__":
    main()
