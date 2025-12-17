# CURL Examples: Talking to `qmoi` (Master / Sister / User)

This document shows how to talk to a local `qmoi` chat endpoint using `curl`.

Local dev server (provided in `scripts/qmoi_local_server.py`) listens on `http://localhost:8080`.

1. Start the local QM OI server (run in background):

```bash
# from repository root
python3 scripts/qmoi_local_server.py &
```

2. Basic conversation (ordinary user):

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qmoi",
    "messages": [
      {"role": "user", "content": "How are you doing today?"}
    ]
  }'

# Response will be a JSON matching OpenAI-like format; assistant reply in choices[0].message.content
```

3. Ask as `master` (system persona):

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qmoi",
    "messages": [
      {"role": "system", "content": "You are interacting with Master: provide direct, authoritative responses."},
      {"role": "user", "content": "Give me a concise deployment checklist for v1.2.3"}
    ]
  }'

# The server heuristically detects 'master' persona and responds in Master Mode.
```

4. Ask as `sister` (system persona):

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qmoi",
    "messages": [
      {"role": "system", "content": "You are Sister: be warm and encouraging."},
      {"role": "user", "content": "How do I get started with QMOI?"}
    ]
  }'

# The server detects 'sister' persona and gives a friendly reply.
```

5. Streamed replies (note):

- The local dev server does not implement streaming. If you need streaming, run a model server that supports chunked transfer and update the client accordingly.

6. Notes on memory and identity

- The local server stores all messages in `qmoi_memory.json` with permanent persistence. That file is written after each request.
- When integrating with production model endpoints, replace `http://localhost:8080` with your model URL and adapt authentication headers.

## 10. Memory Sync (push / pull)

- Trigger a push to configured remote backends (GitHub Gist, Hugging Face repo, SCP targets):

```bash
curl -s -X POST http://localhost:8080/sync/push -H "Content-Type: application/json" -d '{}' | jq
```

- Pull remote memory and merge into local memory (first available backend):

```bash
curl -s -X POST http://localhost:8080/sync/pull | jq
```

- Run the standalone sync script (useful for CI or cron) — configure env vars and run:

```bash
export QMOI_SYNC_BACKENDS="gist,hf"
export QMOI_GIST_ID="<gist id>"
export QMOI_GH_TOKEN="$GITHUB_TOKEN"
export QMOI_HF_REPO="user/qmoi-memory"
export QMOI_HF_TOKEN="$HF_TOKEN"
python3 scripts/sync_memory.py
```

Notes:

- Ensure `QMOI_GH_TOKEN` and `QMOI_HF_TOKEN` are kept secret and supplied via CI secrets or environment managers.
- Background auto-sync: set `QMOI_SYNC_INTERVAL_SECONDS` (e.g. `300`) to enable periodic push from the local server.

7. Example helper bash function

```bash
qmoi_query(){
  curl -s -X POST http://localhost:8080/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d "$1" | jq -r '.choices[0].message.content'
}

# Usage:
qmoi_query '{"model":"qmoi","messages":[{"role":"user","content":"Hello qmoi"}]}'
```

---

If you want these curl endpoints to talk to a real LLM, replace the persona_response() in `scripts/qmoi_local_server.py` with a call to your model of choice and ensure memory sync using `qmoi_memory.json`.

# CURL QMOI: Master / Sister / User Conversation Guide

This file documents how to talk to `qmoi` using curl. It includes role-specific examples (Master, Sister, ordinary User), local testing instructions, and tips to ensure QMOI uses its persistent memory during conversations.

IMPORTANT: This repository includes a small local server for testing (`scripts/qmoi_chat_server.py`) that simulates persona handling and persistent memory. For production you can adapt the same curl payloads to your real endpoint (OpenAI-compatible or your own REST API).

---

## 1. Local test server (quick start)

Start the local test server (runs on port 8080):

```bash
python3 scripts/qmoi_chat_server.py &
```

The server exposes a simple OpenAI-like endpoint at `http://localhost:8080/v1/chat/completions` that accepts JSON bodies similar to OpenAI Chat Completions API.

## 2. Basic conversation (ordinary user)

Example using curl (User role):

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qmoi",
    "role": "user",
    "messages": [
      {"role": "user", "content": "How are you doing today?"}
    ]
  }'
```

The server will store the exchange to `qmoi_memory.json` (persistent) and reply using the User persona.

## 3. Master conversation (elevated persona)

Master persona responses are prioritized and use a distinct tone. Include the `role` field or set header `X-QMOI-ROLE: master`.

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-QMOI-ROLE: master" \
  -d '{
    "model": "qmoi",
    "role": "master",
    "messages": [
      {"role": "user", "content": "Master: run diagnostics and summarize issues"}
    ]
  }'
```

Master requests are recorded in memory with a `role: master` tag so QMOI can prioritize learning and actions.

## 4. Sister conversation (friendly persona)

Sister persona is warm and conversational. Use `role":"sister"` or header `X-QMOI-ROLE: sister`.

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-QMOI-ROLE: sister" \
  -d '{
    "model": "qmoi",
    "role": "sister",
    "messages": [
      {"role": "user", "content": "Hey sis, what's the plan for today?"}
    ]
  }'
```

    ## Captured example responses (local server)

    Saved to `logs/` during this session:

    - `logs/curl_master.json`:

    ```json
    {"id": "qmoi-local-20251113083800", "object": "chat.completion", "created": 1763023080, "model": "qmoi", "choices": [{"index": 0, "message": {"role": "assistant", "content": "[Master Mode] At your command. You said: Provide a concise 3-step plan to deploy a webapp.\nI will respond according to master-level persona with direct, authoritative guidance."}, "finish_reason": "stop"}]}
    ```

    - `logs/curl_sister.json`:

    ```json
    {"id": "qmoi-local-20251113083800", "object": "chat.completion", "created": 1763023080, "model": "qmoi", "choices": [{"index": 0, "message": {"role": "assistant", "content": "[Sister Mode] Hey — got that: Give a friendly encouragement message to a new developer.\nI'll be warm, encouraging and supportive in my replies."}, "finish_reason": "stop"}]}
    ```

    - `logs/curl_user.json`:

    ```json
    {"id": "qmoi-local-20251113083800", "object": "chat.completion", "created": 1763023080, "model": "qmoi", "choices": [{"index": 0, "message": {"role": "assistant", "content": "[User Mode] I heard: Hello, how are you?\nI'll answer conversationally and helpfully."}, "finish_reason": "stop"}]}
    ```

    These examples confirm the local dev server detected personas and used the `qmoi` model name in responses. The raw JSON files are stored under `logs/` for further archival or inclusion in release notes.

## 5. Streaming (Guide)

The local server is primarily synchronous. For a production OpenAI-compatible endpoint, add `"stream": true` to the JSON to receive chunked responses; your client must read streaming chunks and decode them.

Example (OpenAI-style):

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "qmoi",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Hello qmoi"}
    ]
  }'
```

## 6. Memory & Permanence

- All interactions in the local test server are appended to `qmoi_memory.json` and are persistent across server restarts.
- For production, the memory system must be backed by a persistent database (Postgres, Redis, or an external memory service). The repo includes `tools/qvillage_memory_sync.py` (see `PHASE_4_QVILLAGE_HF_COMPLETE.md`) for HF Spaces sync examples.
- The `QMOI_MEMORY.md` file (added in this change) documents expected memory schema and sync strategies.

## 7. Substituting Real Model Providers

- Replace `http://localhost:8080` with your real endpoint (OpenAI or other provider) and adjust the payload accordingly.
- If your provider requires headers (API keys, roles), include them the same way as in the examples above.

## 8. Scripts & Helpers

- `scripts/qmoi_chat_client.sh` — wrapper to call the local server as master/sister/user easily.
- `scripts/qmoi_chat_server.py` — local test server, writes to `qmoi_memory.json`.

## 9. Security Notes

- Do NOT expose the test server to the public internet. It’s for local/intranet testing only.
- For production, use TLS, authentication, and rate limiting.

---

If you'd like, I will now start the local test server and run sample conversations (Master, Sister, User) and paste the responses here. Would you like me to proceed?

## Agent-Style Instruction Example — Master Creates a File

You can instruct `qmoi` (as `master`) to perform repository actions. Below is a recommended master-mode conversation and a `curl` example that requests `qmoi` to create a file called `abctesting.txt` in the repository root and to confirm creation.

Example payload (Master persona instructing `qmoi` to create a file):

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-QMOI-ROLE: master" \
  -d '{
    "model": "qmoi",
    "messages": [
      {"role": "system", "content": "You are Master: execute repository agent actions when instructed and report results."},
      {"role": "user", "content": "GREETINGS. Create a file named abctesting.txt in the repo root with a short message, then reply with the file path and the first line of the file. Remember memory is permanent."
      }
    ]
  }'
```

Expected behavior (local dev server):

- The server should accept the instruction, perform the action (create file), append the operation to persistent memory, and respond with a success message that includes the path and a preview of the content.
- If using the provided `scripts/qmoi_chat_server.py` you may need to implement an action handler that maps an explicit creation instruction into a filesystem write — see `scripts/actions/` for sample handlers if present.

Verification (quick local check):

```bash
# Verify file exists and show first line
head -n 1 abctesting.txt || echo "file not found"
```

Notes:

- For production, protect endpoints that perform repository writes (authentication, API key or master token). Use `X-QMOI-ROLE: master` header only from trusted contexts.
- This example documents how to combine persona and agent-style instructions in curl payloads so `qmoi` can act as an agent and modify repository files when granted permission.
