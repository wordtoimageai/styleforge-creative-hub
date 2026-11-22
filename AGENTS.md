# Architecture Rules

- Public storefront analytics must use a narrowly allowlisted Worker relay that keeps tenant API keys server-side, because browser code is visible to visitors.
- Paid image generation must verify a real signed-in user in code, and try-on instructions must come from server-owned category templates, because both use privileged AI capabilities.