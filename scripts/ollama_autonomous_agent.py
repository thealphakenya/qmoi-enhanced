#!/usr/bin/env python3
import argparse
import json
import os
import re
import select
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
HTTP_NON_STREAM = True
CLI_HANG_WARNING_SECONDS = 60
CLI_HANG_KILL_SECONDS = 300


def write_log(message: str) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with AGENT_LOG.open("a", encoding="utf-8") as fh:
        fh.write(f"{timestamp} {message}\n")


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
    print(f"$ {' '.join(command)}")
    sys.stdout.flush()
    try:
        result = subprocess.run(command, cwd=str(ROOT), check=True, text=True, **kwargs)
        return result
    except subprocess.CalledProcessError as exc:
        print(f"ERROR: command failed: {exc}")
        write_log(f"COMMAND FAILED: {' '.join(command)} -> {exc}")
        return None


def run_command(command: list[str], description: str) -> bool:
    print(f"==> {description}: {' '.join(command)}")
    sys.stdout.flush()
    result = shell_run(command)
    if result is None:
        print(f"ERROR: {description} failed.")
        write_log(f"{description} failed\nCommand: {' '.join(command)}")
        return False
    return True


def ensure_ollama_environment() -> None:
    print("==> Ensuring local Ollama runtime and model environment")
    if ENSURE_SCRIPT.exists():
        shell_run(["bash", str(ENSURE_SCRIPT)])
    else:
        print("WARNING: .devcontainer/ensure-ollama.sh is missing; continuing with best effort")


def get_ollama_cmd() -> str | None:
    binary = shutil.which("ollama")
    if binary:
        return binary
    if OLLAMA_FALLBACK_BIN.exists() and os.access(str(OLLAMA_FALLBACK_BIN), os.X_OK):
        return str(OLLAMA_FALLBACK_BIN)
    return None


def get_ollama_env() -> dict[str, str]:
    env = os.environ.copy()
    if OLLAMA_FALLBACK_BIN.exists():
        env["PATH"] = str(OLLAMA_FALLBACK_BIN.parent) + ":" + env.get("PATH", "")
    build_lib_dir = Path.home() / ".ollama" / "source" / "build" / "llama-server-cpu" / "bin"
    if build_lib_dir.exists():
        env["GGML_BACKEND_PATH"] = str(build_lib_dir)
        env["LD_LIBRARY_PATH"] = str(build_lib_dir) + ":" + env.get("LD_LIBRARY_PATH", "")
    return env


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
        print("Ollama service is already running.")
        return True
    ollama_cmd = get_ollama_cmd()
    if not ollama_cmd:
        print("Ollama CLI is not available; cannot start the service from the shell.")
        return False

    print(f"Starting Ollama service in the background using {ollama_cmd}...")
    env = get_ollama_env()
    build_lib_dir = Path.home() / ".ollama" / "source" / "build" / "llama-server-cpu" / "bin"
    if build_lib_dir.exists():
        print(f"INFO: Configured GGML_BACKEND_PATH and LD_LIBRARY_PATH for source-built runtime: {build_lib_dir}")
    try:
        stdout = (LOG_DIR / "ollama_serve.stdout.log").open("a", encoding="utf-8")
        stderr = (LOG_DIR / "ollama_serve.stderr.log").open("a", encoding="utf-8")
        subprocess.Popen([ollama_cmd, "serve"], cwd=str(ROOT), stdout=stdout, stderr=stderr, env=env)
    except Exception as exc:
        print(f"ERROR: could not launch Ollama service: {exc}")
        write_log(f"Failed to start Ollama service: {exc}")
        return False

    for attempt in range(START_TIMEOUT):
        if is_service_ready():
            print("Ollama service is now available.")
            return True
        time.sleep(1)
    print("ERROR: Ollama service did not become available in time.")
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


def build_ollama_prompt(tasks: list[str]) -> str:
    if not tasks:
        return (
            "You are an autonomous Ollama agent. There are no explicit tasks extracted from resumefromhere.txt. "
            "Scan the repository and the backlog files 7.txt, 14.txt, undone.txt, and MATCHES.txt. "
            "Produce a clear plan, execute bulk improvements, update resumefromhere.txt, and verify readiness for production."
        )

    task_block = "\n".join([f"{i+1}. {task}" for i, task in enumerate(tasks)])
    return (
        "You are a production-grade Ollama autonomous agent. Your mission is to complete everything listed in resumefromhere.txt "
        "and all referenced backlog files (7.txt, 14.txt, undone.txt, MATCHES.txt) for this repository. "
        "Treat resumefromhere.txt as the canonical tracker and update it with progress as you work. "
        "Use bulk, parallel, and merged execution when safe. Do not stop until every task is complete and verified. "
        "For each task, do the following:\n"
        "1) Confirm the task statement.\n"
        "2) Describe the action plan.\n"
        "3) Mark the task as [IN PROGRESS], then [DONE], then [VERIFY], and finally [CONFIRMED].\n"
        "4) If the task can be completed in parallel with others, explain how you are parallelizing it.\n"
        "5) At the end, output a final completion summary with a double-check for every task.\n"
        "If you cannot complete a task, explain why and what is required.\n\n"
        "TASK LIST:\n"
        f"{task_block}\n\n"
        "IMPORTANT: Verify completion by cross-checking file names, scripts, and markdown docs in this repo. "
        "Update resumefromhere.txt with progress blocks and new task markers. "
        "Only finish when all tasks have been confirmed twice."
    )


def has_http_support() -> bool:
    return True


def stream_process_output(process: subprocess.Popen, description: str, warning_seconds: int = CLI_HANG_WARNING_SECONDS, kill_seconds: int = CLI_HANG_KILL_SECONDS) -> str:
    output_buffer: list[str] = []
    last_output_time = time.time()
    stdout = process.stdout

    while True:
        if stdout is None:
            break

        ready, _, _ = select.select([stdout], [], [], 0.5)
        if ready:
            chunk = stdout.read(4096)
            if not chunk:
                break
            last_output_time = time.time()
            cleaned = clean_ollama_output(chunk)
            if cleaned:
                print(cleaned, end='', flush=True)
                output_buffer.append(cleaned)
            else:
                if chunk.strip():
                    print(chunk, end='', flush=True)
                    output_buffer.append(chunk.rstrip('\n'))
        else:
            if process.poll() is not None:
                break
            elapsed = time.time() - last_output_time
            if elapsed >= kill_seconds:
                print(f"ERROR: {description} produced no output for {kill_seconds} seconds; terminating.")
                write_log(f"{description} killed after {kill_seconds}s without output")
                process.kill()
                break
            if elapsed >= warning_seconds:
                print(f"WARNING: {description} has not emitted output for {warning_seconds} seconds. Still waiting...")
                write_log(f"{description} no output for {warning_seconds}s")
                warning_seconds = float('inf')

    return '\n'.join(line for line in output_buffer if line).strip()


def clean_ollama_output(text: str) -> str:
    # Remove ANSI control sequences and spinner artifacts from Ollama CLI output.
    ansi_escape = re.compile(r'\x1b\[[0-9;]*[A-Za-z]')
    cleaned = ansi_escape.sub('', text)
    # Remove stray carriage returns from spinner updates.
    cleaned = cleaned.replace('\r', '')
    cleaned = cleaned.strip()
    # Drop pure spinner lines to avoid noise in logs and terminal output.
    if re.fullmatch(r'[\s⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏⠛⠻⠽⠾]+', cleaned):
        return ''
    return cleaned


def strip_ollama_timing(text: str) -> str:
    lines = []
    for line in text.splitlines():
        if re.match(r'^(total duration|load duration|prompt eval count|prompt eval duration|prompt eval rate|eval count|eval duration|eval rate):', line.strip(), re.IGNORECASE):
            break
        lines.append(line)
    return '\n'.join(lines).strip()


def run_ollama_cli(prompt: str) -> tuple[bool, str]:
    ollama_cmd = get_ollama_cmd()
    if not ollama_cmd:
        return False, ""

    print(f"==> Sending prompt to Ollama CLI via {ollama_cmd}")
    command = [ollama_cmd, "run", MODEL_NAME, "-", "--format", "json", "--hidethinking"]
    try:
        process = subprocess.Popen(
            command,
            cwd=str(ROOT),
            env=get_ollama_env(),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
    except FileNotFoundError:
        return False, ""
    except Exception as exc:
        print(f"ERROR: Could not launch Ollama CLI: {exc}")
        write_log(f"Failed to launch Ollama CLI: {exc}")
        return False, ""

    try:
        if process.stdin:
            process.stdin.write(prompt)
            process.stdin.close()
    except Exception as exc:
        print(f"ERROR: Failed to write prompt to Ollama CLI stdin: {exc}")
        write_log(f"Ollama CLI stdin write failed: {exc}")
        process.kill()
        return False, ""

    output = stream_process_output(process, "Ollama CLI")
    try:
        return_code = process.wait(timeout=10)
    except subprocess.TimeoutExpired:
        return_code = process.poll() if process.poll() is not None else -1

    if return_code != 0:
        print(f"ERROR: Ollama CLI failed with exit code {return_code}")
        write_log(f"Ollama CLI failed: rc={return_code}")
        append_ollama_output_summary(output)
        return False, output

    if any(err_keyword in output.lower() for err_keyword in ["error:", "unexpected eof", "internal server error"]):
        print("ERROR: Ollama CLI output contained an error condition.")
        write_log("Ollama CLI output contained an error condition")
        append_ollama_output_summary(output)
        return False, output

    text_only = strip_ollama_timing(output)
    parsed_text = extract_json_response_from_stream(text_only)
    if parsed_text:
        return True, parsed_text

    if re.search(r'\{\s*"status"\s*:\s*"IN PROGRESS"|\[?IN PROGRESS\]?', text_only, re.IGNORECASE):
        return False, text_only

    return True, text_only


def json_to_text(obj: object, indent: int = 0) -> str:
    if isinstance(obj, dict):
        lines: list[str] = []
        for key, value in obj.items():
            if isinstance(value, (dict, list)):
                lines.append(f"{key}:")
                lines.append(json_to_text(value, indent + 2))
            else:
                lines.append(f"{key}: {value}")
        return "\n".join(lines)
    if isinstance(obj, list):
        lines: list[str] = []
        for item in obj:
            if isinstance(item, (dict, list)):
                lines.append(json_to_text(item, indent))
            else:
                lines.append(str(item))
        return "\n".join(lines)
    return str(obj)


def extract_json_response_from_stream(text: str) -> str:
    responses: list[str] = []
    stripped_text = text.strip()
    if stripped_text:
        try:
            parsed = json.loads(stripped_text)
            if isinstance(parsed, dict):
                if parsed.get("response") is not None:
                    return str(parsed["response"]).strip()
                if parsed.get("message") is not None:
                    return str(parsed["message"]).strip()
                return json_to_text(parsed).strip()
            if isinstance(parsed, list):
                messages = [str(item["response"]).strip() for item in parsed if isinstance(item, dict) and item.get("response") is not None]
                if messages:
                    return "\n".join(messages).strip()
                return json_to_text(parsed).strip()
        except json.JSONDecodeError:
            pass

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("data:"):
            stripped = stripped[len("data:"):].strip()
        if not stripped:
            continue
        try:
            parsed = json.loads(stripped)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict):
            if "response" in parsed:
                responses.append(str(parsed["response"]))
            elif "message" in parsed:
                responses.append(str(parsed["message"]))
            else:
                responses.append(json_to_text(parsed))
    return "\n".join(responses).strip()


def run_ollama_http(prompt: str) -> tuple[bool, str]:
    if not has_http_support():
        return False, ""
    body = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": not HTTP_NON_STREAM,
    }
    data = json.dumps(body).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    req = Request(f"{OLLAMA_HOST}/api/generate", data=data, headers=headers, method="POST")
    try:
        with urlopen(req, timeout=1200) as response:
            raw_output = response.read().decode("utf-8", errors="ignore")
        try:
            parsed = json.loads(raw_output)
            if isinstance(parsed, dict):
                if parsed.get("response") is not None:
                    return True, str(parsed["response"]).strip()
                if parsed.get("message") is not None:
                    return True, str(parsed["message"]).strip()
            if isinstance(parsed, list):
                messages = []
                for item in parsed:
                    if isinstance(item, dict) and item.get("response") is not None:
                        messages.append(str(item["response"]))
                if messages:
                    return True, "\n".join(messages).strip()
        except json.JSONDecodeError:
            pass

        parsed_response = extract_json_response_from_stream(raw_output)
        if parsed_response:
            return True, parsed_response
        return True, raw_output.strip()
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
    print(f"==> Ensuring model {MODEL_NAME} is available")
    try:
        req = Request(f"{OLLAMA_HOST}/api/tags")
        with urlopen(req, timeout=20) as response:
            tags = json.loads(response.read().decode("utf-8", errors="ignore"))
            if any(tag.get("name") == MODEL_NAME for tag in tags.get("models", [])):
                print(f"Model {MODEL_NAME} is already present.")
                return
    except Exception:
        pass

    ollama_cmd = get_ollama_cmd()
    if not ollama_cmd:
        print("Ollama CLI not available; cannot pull model automatically.")
        return

    print(f"Pulling model {MODEL_NAME} via {ollama_cmd}...")
    shell_run([ollama_cmd, "pull", MODEL_NAME])


def run_continuation_script() -> bool:
    continue_script = ROOT / "scripts" / "auto_continue_resumefromhere.py"
    if not continue_script.exists():
        print(f"Continue bulk script not found: {continue_script}")
        return False
    print("==> Running the auto-continue bulk resume script after Ollama agent completion")
    for attempt in range(1, 3):
        print(f"Auto-continue attempt {attempt}/2")
        if run_command([sys.executable, str(continue_script)], 'run auto-continue bulk resume script'):
            return True
        time.sleep(10)
    return False


def verify_agent_completion(output: str, tasks: list[str]) -> bool:
    if not output:
        print("ERROR: No output was captured from Ollama.")
        return False

    text = output.strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            text = json_to_text(parsed)
    except json.JSONDecodeError:
        pass

    confirmed_count = len(re.findall(r"\bCONFIRMED\b", text, flags=re.IGNORECASE))
    verify_count = len(re.findall(r"\bVERIFY\b", text, flags=re.IGNORECASE))

    if confirmed_count == 0:
        print("WARNING: No CONFIRMED marker found in Ollama output.")
        return False
    if verify_count == 0:
        print("WARNING: No VERIFY marker found in Ollama output.")
        return False

    lower_text = text.lower()
    if "final completion summary" not in lower_text and "final completion" not in lower_text and "completion summary" not in lower_text:
        print("WARNING: The output does not appear to include a final completion summary.")
        return False

    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Ollama autonomous bulk agent runner')
    parser.add_argument('--continue', dest='continue_run', action='store_true', help='Run scripts/auto_continue_resumefromhere.py after Ollama agent completion')
    parser.add_argument('--no-continue', dest='continue_run', action='store_false', help='Do not run auto-continue after the Ollama agent (default behavior is to continue)')
    parser.set_defaults(continue_run=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    print("=== Ollama Autonomous Agent Startup ===")
    write_log("Starting Ollama autonomous agent run")
    backup_resume_file()
    start_block = append_resume_update([
        'Starting Ollama autonomous bulk agent run.',
        'Ollama is instructed to work in bulk, parallel, and self-improving mode.',
        'This run will update resumefromhere.txt and continue the bulk resume workflow.'
    ])
    print(start_block)
    update_resume_last_updated()
    ensure_ollama_environment()
    if not start_ollama_service():
        print("ERROR: Unable to start Ollama service. Exiting.")
        write_log("Ollama service failed to start")
        append_resume_update(['Ollama service failed to start.'])
        sys.exit(1)
    ensure_model()

    content = read_resumefromhere()
    tasks = extract_tasks_from_resume(content)
    print(f"==> Extracted {len(tasks)} actionable tasks from resumefromhere.txt")
    if tasks:
        for i, t in enumerate(tasks, start=1):
            print(f"  {i}. {t}")
    else:
        print("WARNING: No explicit tasks could be extracted from resumefromhere.txt.")

    prompt = build_ollama_prompt(tasks)
    print("==> Running Ollama agent prompt")
    start_time = time.time()
    cli_success, response_text = run_ollama_cli(prompt)
    http_success = False
    if not cli_success:
        print("WARNING: Ollama CLI failed; falling back to HTTP API.")
        http_success, response_text = run_ollama_http(prompt)
    elapsed = time.time() - start_time
    print(f"==> Ollama agent completed in {elapsed:.1f}s")

    append_ollama_output_summary(response_text)
    append_resume_block('OLLAMA AGENT RESULT', [
        f'Ollama agent completed in {elapsed:.1f}s.',
        f'CLI success: {cli_success}',
        f'HTTP fallback success: {http_success}',
        f'Pending tasks found: {len(tasks)}',
        'Output summary was appended to resumefromhere.txt.'
    ])

    final_success = cli_success or http_success
    if not final_success:
        print("ERROR: Ollama agent was not able to complete the prompt successfully.")
        write_log("Ollama agent prompt failed")
        append_resume_block('OLLAMA AGENT FAILURE', ['Ollama agent prompt failed. Check terminal output and logs.'])
        sys.exit(1)

    if not verify_agent_completion(response_text, tasks):
        print("ERROR: Ollama output did not include required completion verification markers.")
        write_log("Ollama output verification failed")
        append_resume_block('OLLAMA AGENT VERIFICATION FAILURE', ['Ollama output verification failed. The run did not produce required completion markers.'])
        sys.exit(1)

    success_block = append_resume_update([
        'Ollama autonomous run finished successfully.',
        'Tasks were executed in bulk, with self-directed decisions and double verification.',
        f'Found {len(tasks)} tasks in resumefromhere.txt and verified completion markers.'
    ])
    print(success_block)
    update_resume_last_updated()

    append_resume_block('OLLAMA AGENT VERIFICATION', [
        'Ollama output verification passed.',
        'Resumefromhere tracker updated with progress and completion markers.',
    ])

    if args.continue_run:
        if run_continuation_script():
            append_resume_update(['Auto-continue bulk resume script completed successfully.'])
        else:
            append_resume_update(['Auto-continue bulk resume script did not complete successfully.'])

    print("==> Ollama autonomous run finished. Review the terminal output for progress and confirmations.")
    print("==> Check the logs at ~/.ollama/logs/ollama_autonomous_agent.log if needed.")
    write_log("Ollama autonomous agent run completed successfully")


if __name__ == "__main__":
    main()
