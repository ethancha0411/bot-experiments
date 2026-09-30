# OSS frameworks vs an owned gate

The source comparison examined personal-agent apps, company-style multi-agent
control planes, and multi-harness launchers. They supply useful implementation
patterns but do not remove the need for a portable, application-owned badge and
grant boundary.

| Framework shape | Useful patterns | Why it is not the identity spine |
| --- | --- | --- |
| Personal agent app | action review, receipts, constrained computer | identity is usually the local user |
| Company control plane | durable runs, gateways, policy projections | much broader product and data model |
| Multi-harness launcher | runner abstraction, local process topology | orchestration is not authorization |

Patterns worth retaining are explicit pending states, decisions bound to exact
requests, no dispatch before durable authorization, schema/digest validation,
and honest uncertain outcomes. This repo intentionally omits company org charts,
partner/CRM fixtures, OAuth, credential storage, deployment management, and a
second sandbox.

Adoption rule: borrow narrow patterns only when they deepen the gate seam. Do
not adopt a larger framework merely to obtain pending approvals or a ledger.
