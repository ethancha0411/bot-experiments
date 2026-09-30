# Agents SDK and computer-use PoC scope

## Question

Can a hosted agent inherit its provider VM while consequential function calls
remain behind an application-owned identity, approval, and ledger boundary?

## Bounded slices

| Slice | Question | Exit condition |
| --- | --- | --- |
| 0 | Is thin hosted integration feasible? | no SDK fork or second cage |
| 1 | Can badge/grant deny be deterministic? | deny and ledger before dispatch |
| 2 | Can approval survive pause/resume? | exact request resumes at most once |
| 3 | Can hosted computer use coexist? | origin mediation; browser watch-only |
| 4 | Does one combined flow reconcile? | gate, effects, and ledger agree |

Non-goals were production integration, shell access, skill loading, per-click
authorization, credential management, and cloud deployment. The local OSS
runner preserves a deterministic subset and makes the network call optional.

## Trust boundary

The gate controls function dispatch and records origin decisions. It does not
claim to control every pixel or click inside hosted computer use. Browser
observation is evidence only. A write remains safe only when the consequential
effect is exclusively available through the gated function path.
