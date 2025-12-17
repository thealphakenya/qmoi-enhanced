# QMOI Agent Instructions (Master / Sister / User)

This file provides clear, actionable agent-style instructions and examples for interacting with `qmoi` over curl. Use the `X-QMOI-ROLE` header or include a `system` message to set persona and privileges.

1. Greeting + Agent Action (Master)

Example: master issues a repo write (create file)

```bash
curl -s -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-QMOI-ROLE: master" \
  -d '{
    "model": "qmoi",
    "messages": [
      {"role":"system","content":"You are Master. Execute allowed repo actions and report results clearly."},
      {"role":"user","content":"Hello qmoi — please create a file at /abctesting.txt with the single line: 'Agent: created abctesting.txt' and then reply with the path and first line."}
    ]
  }'
```

2. Verification steps (what to expect in reply)

- A success confirmation message: e.g., "Created `/abctesting.txt` — first line: 'Agent: created abctesting.txt'"
- An entry appended to persistent memory (e.g., `qmoi_memory.json`) describing the performed action.

3. Security and policy

- Only deploy file-write agent handlers behind strong authentication and allow a limited set of master tokens or service accounts.
- Validate and sanitize requested file paths to avoid directory traversal.

4. Troubleshooting

- If the server returns a reply but the file is not present, ensure the server process has filesystem write permissions and that the action handler is implemented.
- Consult server logs under `logs/` for any action errors.

5. Example agent greeting sequence (Master then follow-up)

1) Master: "GREETINGS. Create file X and confirm."
2) QM0I -> creates file and replies with success.
3) Master: "Please run quick verification head -n 1 X"
4) QM0I -> replies with the file preview and stores the action in memory.
