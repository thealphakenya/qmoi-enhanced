---
title: "QMOI CURL Commands"
qmoi_validation_frontmatter: true
---

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI CURL Commands

This file contains curl commands and instructions to test all QMOI endpoints, health, autotests, error fixing, workflow, and financial features.

## Health Check

```
curl http://localhost:4000/health
```

## Real-Time Events

```
curl http://localhost:4000/api/realtime-events
```

## Trigger Error Fix

```
curl -X POST http://localhost:4000/api/trigger-fix
```

## Get Error Fix Log

```
curl http://localhost:4000/api/error-fix-log
```

## Get Logs

```
curl http://localhost:4000/api/logs
```

## Login (example)

```
curl -X POST -d "user=Victor&pass=Victor9798!" http://localhost:4000/login
```

## Add more as new endpoints are created.

---

## API Coverage & Automation (2025-10-08)

All API endpoints, including previously unused ones, are now exercised by the automated test suite (`qmoi_test.sh`).

- See `UNUSED_API_ENDPOINTS.md` for a list of endpoints that were previously untested.
- See `qmoi_autogen_unused_api_tests.sh` for the script that generated and tested these endpoints.
- Test results are logged in `qmoi_test_results.log`.

If you add new endpoints, update this file and the test suite to ensure full coverage.

---

## QMOI Multimodal API Feature Tests

### 1. Basic Text Chat

```
curl $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"messages": [
			{"role": "system", "content": "You are a friendly AI that replies casually to text messages."},
			{"role": "user", "content": "Hey, what’s up?"}
		]
	}'
```

### 2. Multi-turn Conversation

```
curl $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"messages": [
			{"role": "system", "content": "You are a friendly, context-aware assistant."},
			{"role": "user", "content": "What’s your favorite color?"},
			{"role": "assistant", "content": "I think blue looks great — calm and clear."},
			{"role": "user", "content": "Cool, what about matching foods?"}
		]
	}'
```

### 3. Multimodal Input (image + text)

```
curl $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"messages": [
			{
				"role": "user",
				"content": [
					{"type": "text", "text": "What do you see in this image?"},
					{"type": "image_url", "image_url": "https://example.com/dog.jpg"}
				]
			}
		]
	}'
```

### 4. Multimodal Reasoning (image + question)

```
curl $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"messages": [
			{
				"role": "user",
				"content": [
					{"type": "text", "text": "How many people are wearing hats in this picture?"},
					{"type": "image_url", "image_url": "https://example.com/group_photo.jpg"}
				]
			}
		]
	}'
```

### 5. Structured Output (JSON Mode)

```
curl $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"response_format": {"type": "json_object"},
		"messages": [
			{"role": "user", "content": "Extract the name, age, and city from: Sarah, 28, from Berlin."}
		]
	}'
```

### 6. Streaming Responses

```
curl -N $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"stream": true,
		"messages": [
			{"role": "user", "content": "Tell me a short poem about the ocean."}
		]
	}'
```

### 7. Function Calling / Tool Use

```
curl $QMOI_API_BASE/chat/completions \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi",
		"tools": [
			{
				"type": "function",
				"function": {
					"name": "get_weather",
					"description": "Get current weather info",
					"parameters": {
						"type": "object",
						"properties": {
							"location": {"type": "string"}
						},
						"required": ["location"]
					}
				}
			}
		],
		"messages": [
			{"role": "user", "content": "What’s the weather like in Tokyo right now?"}
		]
	}'
```

### 8. Embeddings

```
curl $QMOI_API_BASE/embeddings \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer $QMOI_API_KEY" \
	-d '{
		"model": "qmoi-embed",
		"input": "Artificial intelligence is amazing."
	}'
```

---

## Response Quality, Speed, and Reasoning Tests

For each test above, measure:

- Response time (add `-w '\nTime: %{time_total}s\n'` to curl)
- Output quality (check for coherence, structure, and accuracy)
- Reasoning (logical, context-aware answers)
- Multimodal and function/tool use (if supported)

---

See also: [qmoi_test.sh](qmoi_test.sh) for a script to run all tests and log results.

<!-- QMOI_VALIDATION_START -->

{
"file": "CURLCOMMANDS.md",
"validated_at": "2025-10-26T20:51:22.291023Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": true,
"detail": "QMOI CURL Commands"
},
{
"name": "links",
"ok": true,
"detail": [
{
"label": "qmoi_test.sh",
"target": "./qmoi_test.sh",
"ok": true
}
]
}
],
"passed": true,
"summary": {
"total_checks": 2,
"passed": true
}
}

<!-- QMOI_VALIDATION_END -->

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
