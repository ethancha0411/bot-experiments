# Gateway pattern map

The staging gateway reference demonstrated a much larger application. This
scaffold rewrites four reusable seams:

```text
browser UI → local HTTP API → governance service → registry
                               │
                               ├→ approval state
                               └→ append-only ledger
```

- **Projection:** the admin API exposes published plugins and grants, not
  credential material or broad internal state.
- **Fail-closed evaluation:** lookup or persistence failure never becomes an
  allow response.
- **Human decision:** approval has an explicit pending/final state and actor.
- **Audit-before-state-change:** an approval is updated only after its ledger
  append succeeds.

The OSS version deliberately uses memory for approval state and JSONL for the
ledger. That keeps the teaching surface readable while making durability gaps
obvious.
