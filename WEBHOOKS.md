<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# Webhook Receiver and Best Practices

This file describes how QMOI should receive and validate GitHub webhooks.

Best practices:
- Use a verification secret and validate X-Hub-Signature-256 header
- Reject unknown event types early and return 2xx only for accepted events
- Use an event queue (e.g., Redis/RabbitMQ/Kafka) to decouple processing

Example receiver (pseudo):

1. Verify signature
2. Acknowledge 200 OK
3. Push event payload to queue
4. Processor picks up payload and performs idempotent actions
