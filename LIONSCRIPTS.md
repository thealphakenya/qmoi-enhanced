# Lion Scripts Examples & How-To

This document contains practical Lion script examples, expected outcomes, and deployment notes.

## Example 1 — hello.li

```
print: Hello, Lion!
run: shell("echo running")
```

Outcome: prints greeting and runs the echo command.

## Example 2 — backup.li

```
print: Starting backup
run: shell("tar -czf backup.tgz /data")
run: shell("aws s3 cp backup.tgz s3://bucket/backups/")
```

Outcome: creates an archive and uploads to S3. Requires AWS CLI adapter and credentials.

## Example 3 — dns-provision.li

```
print: Provisioning DNS
run: shell("cli-dns create --domain example.com --target 1.2.3.4")
```

Outcome: provision DNS via a CLI adapter (adapter must be installed and configured in Den).

Notes:
- Use small, testable steps. For production, use typed adapters rather than arbitrary shell commands.
- Store sensitive operations behind adapters and avoid embedding secrets in plans.
# Lion Scripts & Examples

This page contains example Lion plans (scripts) and explains expected outcomes and how to run them using `scripts/lion-runner.cjs`.

Example 1 — hello.li

```
print: Hello, Lion!
calc: 2 + 2
run: shell("echo done")
```

Outcome:
- prints "Hello, Lion!"
- prints result of calc (`4`)
- runs the echo command and prints `done`

Example 2 — encrypt.li (uses built-in Lion encrypt helper — available in extended runner)

```
print: Encrypting sample
run: shell("node -e \"console.log(require('./scripts/lion-crypto').encrypt('hello','pass'))\"")
```

Note: The current minimal runner uses `run: shell(...)` to execute arbitrary commands; a production runner should expose safe RPC-style adapters instead.

Examples for domain automation and link management

```
# register a domain (adapter example)
print: Registering domain
run: shell("echo 'register domain example.com --mock'")

# update DNS record (illustrative)
run: shell("echo 'dns update example.com A 1.2.3.4 --mock'")
```

Use the `lion` installer (scripts/install-lion.cjs) to copy the runner into a `den` and wire helpers.
