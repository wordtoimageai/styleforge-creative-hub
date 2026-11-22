# Tracking Relay

- [x] Confirm the public storefront does not have a safe source for brand API keys.
- [x] Add a server-side Worker relay limited to approved event types.
- [x] Record Buy-button and successful Studio generation events through the relay.
- [x] Test the relay and generation-event mapping; run the requested security scan.
- [ ] Deploy the Worker after its KV identifiers and public API DNS are configured.

## Selected Security Findings

- [x] Require a signed-in, non-anonymous user before paid image generation; deploy and verify the protected function.
- [x] Select try-on instructions only from server-owned category templates; verify caller-supplied instructions are ignored.
- [x] Test the fixes and update only the selected finding statuses.