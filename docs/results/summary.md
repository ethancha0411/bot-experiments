# Results summary

The experiments support a narrow architecture:

- Keep the agentPlugin identity and grant lookup outside model-authored input.
- Deny unknown, missing, disabled, and unapproved capabilities.
- Append an owned decision record before returning authority.
- Bind human decisions to a stable request identity.
- Treat hosted computer observation as evidence, not authorization.
- Inherit the harness cage and keep shell off unless separately proven.

This repository makes the first three claims runnable as a local product and
keeps the remaining hosted findings as bounded documentation. The highest-value
next engineering step is durable, authenticated approval state—not more tools.
