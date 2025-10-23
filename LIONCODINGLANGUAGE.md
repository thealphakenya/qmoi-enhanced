
# LION Coding Language (v0.1)

Lion is a small domain-specific language for expressing automation plans, healing rules, and cross-language orchestration. This file contains a concrete, minimal spec plus examples and an interpreter (scripts/lion-runner.cjs) that implements a safe subset for demonstration and testing.

File extension: `.li`

Design goals:
- Human-readable and concise.
- Composable steps: print, run (shell), calc (arithmetic), http (future), adapter calls (future).
- Safe by default: the provided runner executes only simple commands and requires explicit use for destructive operations.

Syntax summary (v0.1):

- A plan is an ordered list of steps. Each step is a line starting with a keyword and a colon.
- Supported step keywords in v0.1:
  - `print:` — emit a line to stdout.
  - `run:` — execute a shell command using `shell("...")` wrapper. Runner will execute the command and capture output.
  - `calc:` — evaluate a simple arithmetic expression (uses JS operators, limited to trusted examples).

Example 1 — hello.li

```
print: Hello, Lion!
calc: 2 + 3 * 4
run: shell("echo done")
```

Example 2 — backup.li (illustrative)

```
print: Starting backup
run: shell("pg_dump -Fc -f backup.dump mydb")
print: Uploading to archive
run: shell("aws s3 cp backup.dump s3://my-bucket/backups/")
```

Running Lion plans

- For small examples and tests use the included runner:

  node scripts/lion-runner.cjs examples/hello.li

Den environment (Lion runtime environment)

The `den` environment is the recommended runtime environment for Lion. It is a minimal container with:

- Node.js 18+ (for the provided runner)
- Bash shell
- Optional tools for adapters (aws-cli, pg tools) when needed for production plans

You can create a simple development `den` using the included Dockerfile or by using the devcontainer configuration (TODO: add dockerfile). For now, run the runner directly on a host with Node.js.

Spec details (formalized)

- plan: an ordered list of step-lines
- step-line: <keyword> ':' <args>
- args are raw text and may include simple wrappers like shell("...")

Security note

This v0.1 runner is intentionally minimal and can evaluate `calc:` using JavaScript eval for demo purposes. Do not run untrusted plans with this runner. A production Lion runtime should sandbox command execution and use typed adapters for external services.

Next steps planned (not placeholders):
- Implement an adapter interface to call platform services (M-Pesa, S3, database) safely.
- Add a typed compiler/AST and a sandboxed runtime to safely run untrusted plans.
- Add structured logs and error handling for healing rules.

