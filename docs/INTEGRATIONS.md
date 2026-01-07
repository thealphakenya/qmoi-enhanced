# Integration & Production Setup

This document describes how to provision real provider credentials and enable production operations for payments and notifications.

## WhatsApp

- Provider selection: `QMOI_WHATSAPP_PROVIDER` can be:
  - `local` (default) — Uses `whatsapp-web.js` local session automation
  - `twilio` — Uses Twilio Messages API (WhatsApp requires Twilio configuration)
  - `whatsapp_cloud` — Uses Meta/WhatsApp Cloud API

### Env variables

- For Twilio (WhatsApp): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`
- For WhatsApp Cloud: `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`

## M-Pesa (Safaricom)

- Required env vars: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, `MPESA_BUSINESS_SHORTCODE`
- Optional: `MPESA_ENVIRONMENT` (`sandbox` or `production`), `MPESA_OAUTH_URL`, `MPESA_STK_URL`, `MPESA_CALLBACK_URL`

## Pesapal (CashOn)

- Required env vars: `PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET`
- Optional: `PESAPAL_ENVIRONMENT` (`sandbox` or `production`), `PESAPAL_API_URL`, `PESAPAL_CALLBACK_URL`
- Notes: The Pesapal adapter sends a `PostPesapalDirectOrderV4` request; in non-production the adapter simulates and returns a safe `sim-pesapal-...` transaction id.

## Airtel Money

- Required env vars: `AIRTEL_CLIENT_ID` (and `AIRTEL_CLIENT_SECRET` for some gateways)
- Optional: `AIRTEL_API_URL` (defaults to `https://openapiuat.airtel.africa`)
- Notes: The Airtel adapter uses the Airtel merchant payments endpoint when `PRODUCTION_CONFIRMED` is set; in non-production the adapter simulates and returns a safe `sim-airtel-...` reference.

## VPN Controller (optional)

- Env vars: `VPN_CONTROLLER_URL` (URL to the controller's API). Optionally `VPN_CLIENT_CMD` if you run local client commands for connections.
- Validation: The integrations validation endpoint supports `provider=vpn` which performs a non-destructive `/health` GET against the controller URL to verify reachability.
- Runbook: See `docs/RUNBOOKS/VPN.md` for steps to provision the `VPN_CONTROLLER_URL` secret and run the guarded GitHub Actions workflow.
- Notes: No provisioning or destructive actions are performed by the validation endpoint. Live provisioning and client command execution require `PRODUCTION_CONFIRMED=1` and careful operational controls.

## Production safety

- To perform any live side-effectful action, set `PRODUCTION_CONFIRMED=1` in your production environment.
- Credentials must be stored in your CI/CD provider or a secret manager (do NOT commit real secrets to the repo).

## Testing

- A set of unit tests mocks non-production behavior. For end-to-end tests with real providers, set env vars and `PRODUCTION_CONFIRMED=1` in an isolated test environment.

## Notes

- The project uses guarded adapters that simulate behavior in non-production to avoid accidental charges or messages.
