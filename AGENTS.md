# Architecture Rules

- Public storefront analytics must use a narrowly allowlisted Worker relay that keeps tenant API keys server-side, because browser code is visible to visitors.