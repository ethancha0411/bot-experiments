# bot-experiments

A small, local-first monorepo for experimenting with harness-agnostic agent
governance. It owns the badge and grants, fails closed at the tool boundary,
pauses selected calls for a human, and records every decision in an append-only
ledger. It does not provide a sandbox, credential vault, cloud deployment, or
production identity system.

## Start here

Prerequisites: Node.js 22+, pnpm 10+, and Docker Desktop (or Docker Engine with
Compose).

```bash
git clone git@github.com:ethancha0411/bot-experiments.git
# or: gh repo clone ethancha0411/bot-experiments
cd bot-experiments
pnpm install
# If pnpm asks to approve build scripts for esbuild: `pnpm approve-builds --all`
docker compose up --build
```

Open the operator UI at <http://localhost:5173>. One demo approval is waiting;
approve or deny it and watch it disappear. The read-only admin UI is at
<http://localhost:5174>, and the API is at <http://localhost:8787>.

The JSONL ledger persists in the Compose volume `governance-data`. Tear down
containers with `docker compose down`; add `-v` only when you intentionally want
to delete that local ledger volume.

## Run without Docker

```bash
pnpm install
pnpm --filter governance-server dev
```

Then serve the UIs in two other terminals:

```bash
pnpm --filter operator-ui dev
pnpm --filter admin-ui dev
```

The server defaults to port 8787 and writes `data/decisions.jsonl` relative to
its working directory. Copy `.env.example` to a local `.env` only if your shell
workflow loads it; `.env` is ignored. The application itself reads environment
variables directly and never needs a secret for deterministic operation.

## Try the gate

```bash
curl -s http://localhost:8787/health
curl -s http://localhost:8787/plugins
curl -s -X POST http://localhost:8787/evaluate \
  -H 'content-type: application/json' \
  -d '{"requestId":"read-1","pluginId":"demo-agent","tool":"read_status"}'
curl -s -X POST http://localhost:8787/evaluate \
  -H 'content-type: application/json' \
  -d '{"requestId":"review-1","pluginId":"demo-agent","tool":"send_message"}'
```

The first decision is `automatic`. The second is denied pending human approval
and appears in the operator UI. Missing plugins, missing grants, disabled
grants, and approval-required calls without prior approval all deny and append
to the ledger.

## Verify and explore

```bash
pnpm typecheck
pnpm test
pnpm example:hosted
pnpm example:simon
pnpm example:thin
pnpm example:skill
```

The hosted example always runs its offline gate proof. If `OPENAI_API_KEY` is
absent it skips the optional network call and exits successfully. See
[`docs/README.md`](docs/README.md) for the papers and experiment map.

## Repository map

- `apps/governance-server`: local HTTP gate, approval state, registry, ledger API
- `apps/operator-ui`: polling approve/deny page
- `apps/admin-ui`: read-only agentPlugin and grant page
- `packages/agent-plugin`: immutable identity and grant types/builder
- `packages/ledger`: append-only JSONL decision records
- `examples`: sanitized, deterministic PoC extracts
- `docs`: thesis → concept → approach → experiments → results

## Security boundary

This is an OSS experiment, not a production authorization service. Approval
state is in memory and resets on server restart; decision records are durable.
There is no authentication on the local HTTP API. CORS is deliberately open so
the two localhost static UIs can call it. Run it only on a trusted local machine
and do not expose these ports to an untrusted network.

## Gaps

- Approval state is not durable; only the decision ledger is.
- The JSONL writer serializes appends within one process, not across processes.
- No authentication, multi-user roles, rate limiting, or production hardening.
- Hosted computer/browser behavior is documented evidence, not reproduced by
  this scaffold. Shell egress is intentionally docs-only.
- The optional Agents SDK call needs a user-supplied key and installed Python
  dependency; neither is required for the runnable local product.

MIT licensed. The repository remains private unless its owner changes that
setting outside this scaffold.
