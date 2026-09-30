# Slice 4: combined evidence and PoC decision

## Result

The bounded hosted workflow passed its intended proof: provider-hosted computer
and session continuity composed with an owned function gate, request-bound HITL,
origin decisions, restart recovery, and effect reconciliation. The identity was
explicitly a stand-in. No production promotion followed.

| Criterion | Result | Limit |
| --- | --- | --- |
| agentPlugin-bound function grants | pass | native VM installation unproven |
| Fail-closed function and origin decisions | pass | local OSS scope is smaller |
| Function HITL and origin decisions | pass | production auth absent here |
| Conversation continuity | pass | hosted evidence only |
| Provider VM/browser | pass | per-click remains watch-only |
| Audit/effect reconciliation | pass | local approval state is in-memory |

The combined sequence was browser/origin observation, process recovery,
function approval and one mutation, continuity turn, rejected second mutation,
then reconciliation of the ledger and fixture effect. Denied paths produced no
additional mutation.

## Recommendation: watch

The evidence supports a later adapter that ingests real trusted agentPlugin
records into this gate. It does not prove installing or enforcing that identity
inside a hosted desktop. Skill integrity was a separate deterministic proof,
not part of the hosted combined slice. Fine-grained browser action mediation is
also unresolved.

The seam is worth preserving; broad production integration is not yet justified.
