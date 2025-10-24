# Den Environment (Lion Runtime)

Den is the minimal runtime environment for executing Lion plans in production or development.

Features:
- Node.js 18+ runtime
- A controlled shell environment
- Optional adapters (aws-cli, cloud DNS CLIs, payment SDKs)
- Secure secrets handling and integration with KMS/Vault

Quick start (dev):

1. Create den directory and copy runner:

```
mkdir -p den && cp scripts/lion-runner.cjs den/lion-runner
```

2. Run example:

```
node den/lion-runner examples/hello.li
```

Production Den should be containerized and run with least privilege. See `docs/lion/coursebooks/full_course.md` for detailed setup.
# den — Lion runtime environment

`den` is the recommended runtime environment for the Lion language. It is a minimal, portable environment designed to run Lion plans and to provide the native tools Lion adapters rely on (shell, node, cli tooling).

Features:
- Node.js 18+ and npm
- Bash / POSIX shell
- Optional tools depending on adapters (aws-cli, pg, openssl)
- Minimal footprint suitable for IoT devices, VMs, containers, and servers

Recommended quick-start (Linux/macOS):

```sh
# create a den in ./den
mkdir -p den && cd den
curl -L https://nodejs.org/dist/latest-v18.x/node-v18.x.tar.gz | tar xz -C .
# place lion runner under den/bin
mkdir -p bin && cp ../scripts/lion-runner.cjs bin/lion-runner.cjs
chmod +x bin/lion-runner.cjs
```

For production use, run Lion plans inside containers built from the QMOI Den base image (TODO: add Dockerfile in repo root). The den should be provisioned with secure secrets handling.
