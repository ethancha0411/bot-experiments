# Control-surface map: harness vs owned gate

## Thesis

Governance should own the portable identity and capability decision, while each
agent harness owns its execution cage. The same agentPlugin can be evaluated at
a thin gate even when the upstream model runner changes. Sandboxing, filesystem
isolation, and low-level network controls remain responsibilities of the chosen
harness.

| Surface | Default owner | This scaffold |
| --- | --- | --- |
| Identity and tool grants | Owned gate | agentPlugin registry |
| Missing/disabled grant | Owned gate | deterministic deny |
| Human approval | Owned gate | pending list + approve/deny |
| Decision audit | Owned gate | JSONL ledger |
| Sandbox and filesystem | Harness | not implemented |
| Credential vault | Harness/provider | not implemented |
| Network/egress | Harness | shell remains off |
| Skill integrity | Shared seam | deterministic digest example |

The owned layer must remain small: trusted identity lookup, fail-closed grant
evaluation, approval continuity, and audit. Rebuilding vendor sandboxes,
marketplaces, OAuth stores, and model-based review systems would blur the trust
boundary without improving portability.

The practical stance is: vendors own the cage; the owned gate owns the badge,
the allowed keys, and the paper trail.
