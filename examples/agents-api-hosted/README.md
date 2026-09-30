# Agents API hosted slices

This is a sanitized, bounded port of the staging slices 0–4. It keeps the core
ideas: an application-owned identity binding, fail-closed grant evaluation,
approval continuity by request ID, and an append-only decision ledger. Hosted
computer interaction and shell egress are not executed here.

Run the deterministic path from the repository root:

```bash
python3 examples/agents-api-hosted/run.py
```

With no `OPENAI_API_KEY`, the script prints a skip message and exits zero. To
try the optional hosted call, create a virtual environment, install
`requirements.txt`, and export a key in your shell. Never add it to the repo.
