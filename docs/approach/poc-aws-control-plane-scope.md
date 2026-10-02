# PoC scope — AWS control plane + Lambda microVM cage

**Audience:** Edel · **Kind:** PoC **scope only** (no builds) · **Date:** 2026-09-30 (America/New_York)  
**Status:** decide-ready  
**Locked answers:** Edel 2026-09-30 (demo success, Tempo CRM, AWS Lambda microVM cage, dual SDK harness, bot-experiments reuse, always-on / computer / proactive / Teams, Vapi mock + Tempo MCP real, agentPlugin, synthetic/staging default)  
**Lens SoT:** [control-surface-map.md][map] · [claw-identity-vs-pluginversion.md][claw] · [oss-frameworks-vs-owned-gate.md][oss] · [openai-dots-vs-owned-gate.md][dots] · prior [Agents API hosted computer scope][hosted-scope] · [bot-experiments][bot-exp] (enterprise tree noted as `digital_assistant/docs/`)

---

## Thesis held (do not rewrite)

Own **agentPlugin** identity + grants + fail-closed tool/skill + approve/deny audit. Vendors/harnesses supply runtimes; we own badge+keys. Do **not** absorb Agents SDK / Dots / Claw as product spine.

For this PoC, **AWS Lambda microVM** (Firecracker-class / Lambda microVM layer) is the **enterprise sandbox plane** — a BYO cage path we operate, complementary to (not replacing) the Agents API hosted-computer and bot-experiments evidence. bot-experiments + dual Agents SDK PoCs remain complementary evidence of the same gate contract under different cages. [Held contract][map]; [identity rename][bot-glossary].

`agentPlugin` means badge+keys / portable associate grants (rename from PluginVersion). Cross-harness installation remains unproven; this dual-SDK PoC can demonstrate **same control plane, two harness adapters**, not marketplace portability. Conversation continuity, always-on, proactive messaging, and computer/browser use remain additional requirements, not consequences of attaching a badge. [Identity distinction][claw]; [deployment limits][oss]; [continuity and bypass lens][dots].

---

## Goal / non-goals

**Goal:** scope a decide-ready PoC where a **sales-rep** digital associate, bound to an **agentPlugin**, runs under a **shared owned control plane** (patterns from bot-experiments / governance gate) with:

1. **Cage:** AWS Lambda microVM as the enterprise sandbox VM plane.
2. **Harness:** configurable — some agents on **OpenAI Agents SDK**, others on **Claude Agents SDK**; same gate/ledger.
3. **CRM:** **Tempo** MCP **real** (operator CRM; not Relaticle).
4. **Voice:** **Vapi mocked** (agent “calls venue to book” without live telephony).
5. **Channel:** **MS Teams mocked** (channel surface for proactive / meeting updates).
6. **Demo acceptance spine:** follow-up reminders → create meeting → agent calls venue to book reservation → update meeting location — with always-on, browser/computer use, proactive message, and Teams channel proven in the same story.

Prove owned badge+keys still bind tool grants, fail-closed deny, approve/deny audit across dual SDKs while the BYO cage supplies isolation. Do this without rebuilding Dot/Claw or absorbing either Agents SDK as product spine.

**Proof boundary:** govern tool/MCP invocations and operator decisions at the owned gate. Observe computer/browser activity inside the microVM (or attached browser runtime) as watch evidence. A function/MCP denial is meaningful only if the constrained browser cannot perform the same consequential CRM/meeting mutation around it. This paper proposes integration slices; nothing here is a completed build.

**Non-goals:** production swarm-orchestrator `src/` changes; live Main BOT builds; Muse Connect UI; Relaticle; live Vapi telephony; live Teams tenant as a hard dependency; absorbing OpenAI/Claude Agents SDK or Dots as spine; claiming Lambda microVM alone equals full desktop computer-use without an explicit browser/computer layer; data/blast-radius hardening beyond “synthetic/staging recommended”; marketplace agentPlugin install; or reopening Edel’s 2026-09-30 locks. This task delivers the paper only.

---

## Primary architecture pick

**Choose BYO enterprise control plane + AWS Lambda microVM cage + dual SDK agents as PRIMARY for this PoC.**

| Layer | Pick | Scope decision |
| --- | --- | --- |
| **Control plane** | bot-experiments patterns: local HTTP gate → evaluate → registry → approval state → append-only ledger; operator approve/deny UI; admin projection of agentPlugin + grants. [Gateway patterns][gw]; [bot-exp README][bot-exp] | **Primary.** Reuse seams; do not invent Muse Connect. Prefer enterprise tree `digital_assistant/docs/` when present; otherwise public `ethancha0411/bot-experiments` docs/apps. |
| **Cage** | AWS Lambda microVM (Firecracker-class serverless sandbox: image → run → suspend/resume → terminate; per-session isolation). [MicroVM concepts][microvm]; [announce][microvm-blog] | **Enterprise sandbox plane for this PoC.** We own/operate the cage path; AWS owns compute/isolation/lifecycle primitives. |
| **Harness A** | OpenAI Agents SDK (some agents) | Adapter into same gate; computer/browser via SDK tools **or** runtime inside microVM — pin in slice 0. |
| **Harness B** | Claude Agents SDK (other agents) | Same control plane; parity of grants/HITL/audit required; computer-use parity is an honest unknown. |
| **CRM** | Tempo MCP **real** | Sales-rep tools for contacts/meetings/locations go through Tempo; gated by agentPlugin grants. |
| **Voice** | Vapi **mocked** | Venue-booking call is a mock that returns a reservation confirmation payload; still gate-mediated and audited. |
| **Channel** | MS Teams **mocked** | Proactive reminders + meeting-location updates surface on a Teams-shaped channel fixture. |
| **Identity** | **agentPlugin** (not PluginVersion) | Immutable id + version + badge + grants (`disabled` / `automatic` / `approval_required`). [Identity][agentplugin] |
| **Operator** | Sales rep + Tempo CRM | Human approve/deny for consequential tools (send, call, mutate meeting location, etc.). |

**Proposed boundary:**

```text
Teams mock / proactive scheduler
        ↓
 dual SDK agents (OpenAI | Claude)  — harness loop only
        ↓
 owned control plane (bot-experiments seams)
   agentPlugin bind → fail-closed evaluate → approve/deny → ledger
        ↓
 Tempo MCP (real) | Vapi mock | calendar/meeting tools | browser/computer adapter
        ↓
 AWS Lambda microVM session (sandbox plane)
```

Policy authority stays on the gate. Model text, page content, remembered conversation, and mock channel payloads cannot supply the authoritative badge or grants. [SoT][map]; [bypass lens][dots].

**Cage limit (honest):** Lambda microVM gives Firecracker isolation, snapshot launch, suspend/resume, and up to ~8h stateful runtime — it is **not automatically** a full interactive desktop with browser/computer-use. Slice 0 must decide whether browser/computer runs (a) as an image-baked Playwright/browser agent inside the microVM, (b) via OpenAI/Claude hosted computer-use with the microVM used only for gated tool side-effects, or (c) a hybrid. Do not claim “microVM = desktop” without that pick. [MicroVM docs][microvm]; prior hosted path remains complementary evidence [hosted-scope].

**Complementary, not replacement:** Agents API hosted-computer PoC (slices 0–4) proved inherit-provider-VM + stand-in badge under OpenAI. bot-experiments proved local gate + operator UI + agentPlugin rename. This PoC proves **we can own the cage path in AWS** while the same gate binds dual SDKs and a sales-rep Tempo journey. Do not discard prior evidence; do not merge spines.

### Central orchestrator + per-harness hosted VM (Edel 2026-09-30)

Yes — a **central control-plane service** can orchestrate agents whose **cages are the LLM provider’s hosted VMs**, without us running AWS for every session.

```text
                 ┌──────────────────────────────────────┐
                 │  Owned central service (gate)         │
                 │  agentPlugin → evaluate → approve/deny│
                 │  → ledger · Tempo MCP · Vapi mock     │
                 └────────────┬─────────────┬────────────┘
                              │             │
              ┌───────────────▼──┐     ┌────▼────────────────┐
              │ OpenAI harness   │     │ Claude Managed Agents│
              │ Agents SDK/API   │     │ harness              │
              └────────┬─────────┘     └────┬────────────────┘
                       │                    │
         ┌─────────────▼──────────┐  ┌──────▼─────────────────┐
         │ OpenAI hosted VM       │  │ Anthropic hosted VM    │
         │ openai_hosted + desktop│  │ + computer-use toolset │
         │ + computer_use         │  │ (Managed Agents cage)  │
         └────────────────────────┘  └────────────────────────┘
```

| Rule | Meaning |
| --- | --- |
| **Gate owns policy** | Badge, grants, fail-closed tool/MCP decisions, audit. Same service for every associate. |
| **Harness owns the loop** | OpenAI Agents SDK vs Claude Managed Agents — configurable per agent. |
| **Provider owns the cage** | OpenAI associate → OpenAI hosted computer; Claude associate → Claude hosted/managed VM. We do not re-implement those VMs. |
| **AWS Lambda microVM** | Optional **BYO** cage when we need one AWS plane for side-effects or when a provider VM is insufficient — complementary to inherit-provider-VM, not required for every agent. |
| **Still true** | Origin/computer approval ≠ per-click agentPlugin; consequential Tempo writes stay MCP-gated so the hosted browser cannot bypass. |

**Product reading:** Grok-Bot / Dot–shaped always-on + computer use can sit on **vendor hosted VMs** behind one owned orchestrator; AWS is the escape hatch / enterprise BYO path from the alternatives paper, not the only cage.

---

## Demo journey (Q1 acceptance spine)

Operator = **sales rep**. CRM = **Tempo**. One upcoming customer meeting is the fixture.

| Beat | What the associate does | Surfaces exercised |
| --- | --- | --- |
| **1. Always-on reminder** | While “idle,” associate proactively nudges the rep about a follow-up due before the meeting (Teams mock channel). | Always-on · proactive message · Teams mock · agentPlugin session alive |
| **2. Create meeting** | Rep asks (or associate proposes); associate creates/updates the meeting record via **Tempo MCP real** (and/or calendar tool behind the gate). Approval if grant is `approval_required`. | Tempo MCP · operator approve/deny · ledger |
| **3. Book venue by phone** | Associate initiates a **Vapi-mocked** call to the venue to reserve a table/room for the meeting time; mock returns confirmation + address. Call tool is gate-mediated. | Vapi mock · approve/deny · audit |
| **4. Update meeting location** | Associate writes the booked venue address back onto the meeting (Tempo) and posts a Teams mock update with the new location. | Tempo MCP · Teams mock · browser/computer if location verified on a page |
| **5. Computer/browser proof** | Somewhere in 2–4, associate uses browser/computer (microVM- or SDK-attached) on a **synthetic** venue/page/fixture — watch evidence only; consequential mutations stay function/MCP-gated. | Browser/computer · watch ≠ grant |

**Pass narrative (proposed):** one continuous story across beats 1–4 with durable ledger rows for every gated dispatch/deny/approve; Teams mock shows proactive + location update; Vapi mock shows call booking without live PSTN; Tempo shows meeting created and location updated; computer/browser activity correlated as watch evidence; dual-SDK note: at least one beat on OpenAI SDK and one on Claude SDK under the **same** agentPlugin grant set (or two agentPlugin versions with equivalent grants — pin in slice 0).

---

## Surfaces table

| Surface | Required in PoC? | How we treat it |
| --- | --- | --- |
| **Always-on** | Yes | Long-lived control-plane + microVM session (or resumable suspend/resume) that can fire proactive work without a fresh human prompt each time. |
| **Computer / browser use** | Yes | Explicit adapter pick in slice 0 (in-microVM browser vs SDK computer_use vs hybrid). Watch evidence; no per-click grant claims. |
| **Proactive message** | Yes | Follow-up reminder beat; outbound to Teams mock without waiting for a user turn. |
| **MS Teams channel** | Yes (mock OK) | Fixture channel that accepts posts/updates; fidelity may be thin. |
| **Vapi** | Yes (mock) | Venue-call tool returns scripted reservation confirmation; still evaluated by gate. |
| **Tempo MCP** | Yes (**real**) | Live MCP contract against staging/synthetic Tempo tenant; grant-bound tools only. |
| **agentPlugin** | Yes | Identity + grants for the sales-rep associate; rename from PluginVersion throughout. |
| **Operator approve/deny UI** | Yes | bot-experiments-style operator UI (or enterprise twin) for consequential tools. |
| **Dual Agents SDK** | Yes | Same control plane; OpenAI + Claude adapters. |
| **AWS Lambda microVM** | Yes | Cage / sandbox plane; lifecycle owned in our orchestration. |

---

## What “success” means

These are **proposed acceptance criteria**, not completed tests. Prefer one synthetic sales-rep associate, one immutable agentPlugin version, staging Tempo data, mocked Vapi/Teams, and a harmless venue/page fixture.

| Criterion | Required evidence / pass condition |
| --- | --- |
| **agentPlugin bind on tool/MCP grants** | Trusted context binds each Tempo / Vapi-mock / meeting tool request to associate/version + grant revision. Missing, unknown, mismatched, or caller-substituted identity ⇒ zero dispatches. Stand-in vs real registry ingestion reported honestly. |
| **Fail-closed deny** | Absent grant, explicit deny, malformed request, gate/ledger failure ⇒ no dispatch; explicit deny overrides allow/approval. |
| **Approve path** | `approval_required` tools (e.g. venue call, location mutate, proactive send) produce no side effect before recorded approval; rejection produces none. Recheck grants before execution; reject stale/changed requests. |
| **Demo journey complete** | Beats 1–4 land on the same story: proactive reminder visible on Teams mock; meeting created; Vapi mock booking confirmation; Tempo meeting location updated; ledger reconciles attempts ↔ outcomes. |
| **Always-on + proactive** | At least one reminder fires without a synchronous user prompt in that moment; associate/session identity preserved across the idle gap (microVM resume or control-plane scheduler — pin in slice 0). |
| **Computer + browser** | Correlated activity (screenshots/events optional) for the synthetic fixture; consequential CRM/meeting mutations **not** available through the browser alone. Per-click mediation = watch/unknown. |
| **Dual SDK same plane** | Equivalent grant evaluation + ledger shape for one OpenAI-backed agent and one Claude-backed agent (or two turns of the journey split across SDKs). Do not claim pixel/computer parity unless proven. |
| **Audit** | Reconcile every gated attempt with allow/deny, approval requested, approved/rejected, execution outcome/unknown. Include agentPlugin id/version, grant revision, session/turn, tool, parameter digest where applicable, reason, reviewer, timestamps. |

**Completion threshold:** all rows above pass on the constrained demo journey, with a negative-case matrix (deny + fail-closed) and reconciled Tempo/mock effects. Report computer adapter choice, Teams/Vapi mock fidelity, Tempo contract gaps, and dual-SDK computer-use parity separately. A pretty Teams screenshot alone is insufficient.

---

## Explicit out of scope

- Any build, git commit, Main BOT seed, Mac Mini / Codex production path, or swarm-orchestrator `src/` change during this paper task.
- Inventing **Muse Connect**; Relaticle CRM; renaming away from agentPlugin/Tempo.
- Live Vapi telephony / real customer venue calls; live Microsoft 365 tenant as a hard dependency (mock is enough).
- Production identity, durable multi-user auth on the gate, vault, OAuth-sans-shim, CapabilityBundle rename — backlog, not this PoC.
- Absorbing OpenAI Agents SDK, Claude Agents SDK, Dots, or Claw as product spine.
- Claiming Lambda microVM provides per-click PluginVersion mediation or full desktop without an explicit browser layer.
- Shell-on egress experiments; reopening Codex `allow_local_binding` proof.
- Real personal profiles, production sends, purchases, destructive CRM ops, or non-synthetic customer data (synthetic/staging remains the recommended default even though blast radius is “don’t worry” for this spec).
- Cross-harness marketplace install of agentPlugin; signed skill digests unless already present in reused material.

---

## Proposed slices — smallest first (early-stop)

| Slice | Work proposed | Dependency / exit condition |
| --- | --- | --- |
| **0. Freeze contract + feasibility** | Pin: microVM image/lifecycle API access; browser/computer adapter choice; Tempo MCP tool list + auth; Vapi mock schema; Teams mock schema; dual SDK client pins; agentPlugin grant map for the sales-rep journey; env/.env defaults. Map every consequential tool to gate modes. | Docs + interface review. **Stop** if Tempo MCP cannot be called from the gate path, if microVM cannot host or attach the chosen computer adapter, or if dual SDK forces absorbing a harness as spine. |
| **1. Control plane + agentPlugin on fixtures** | Stand up bot-experiments-shaped gate (or enterprise twin) with sales-rep agentPlugin; Tempo-shaped fixture tools + Vapi/Teams mocks behind evaluate; deny/allow/approval_required matrix; operator UI. | Slice 0. Zero denied dispatches; durable ledger. May use local stubs before AWS. |
| **2. AWS Lambda microVM cage** | Image build → `run-microvm` → health → suspend/resume → terminate; route at least one gated tool side-effect into the microVM workload; prove session identity survives resume for always-on story. | Slice 1 + AWS account. **Stop** if lifecycle or network connectors block Tempo/mock reachability without unsafe public sprawl. |
| **3. Dual SDK adapters** | OpenAI Agents SDK agent + Claude Agents SDK agent on the same gate; split journey beats or twin associates; ledger shape parity. | Slice 2. **Stop** early if one SDK cannot surface needs_approval / tool events into the owned gate without a fork. |
| **4. Computer/browser + proactive + Teams mock** | Land always-on reminder, browser watch evidence, Teams mock posts; keep mutations MCP/function-gated. | Slices 0–3. Correlate activity IDs with ledger; browser bypass of Tempo mutate = fail. |
| **5. Combined demo (Q1 story)** | Full beats 1–4 with Tempo **real**, Vapi mock booking, location update, dual-SDK note, reconcile pack. | All prior exits. Record pass/fail + remaining gaps; no automatic production promotion. |

**Early-stop rule:** any slice that requires absorbing Agents SDK/Dots/Claw as spine, inventing Muse Connect, switching CRM away from Tempo, or pretending microVM is a desktop without an adapter decision → pause and return evidence to Edel; do not quietly change the locked architecture.

---

## Dependencies & assumed defaults

| Dependency | Assumed default (until Edel overrides) |
| --- | --- |
| **AWS account** | TBD — staging account/role with Lambda microVM + S3 image artifacts + IAM least privilege; region `us-east-1` unless enterprise standard differs. |
| **Control plane code** | Reuse `ethancha0411/bot-experiments` (public) and/or enterprise `digital_assistant/docs/` + apps when available on the build machine. **On this box today:** public GitHub reachable; `digital_assistant/` tree **not present** — treat as a fetch/checkout dependency for Main BOT later. |
| **Env** | `.env` / secrets outside model-visible context: `AWS_*`, Tempo MCP URL + token/OAuth, optional `OPENAI_API_KEY`, Anthropic key for Claude Agents SDK, no live Vapi key required (mock). `.env.example` only in repos. |
| **Tempo** | Staging/synthetic tenant; real MCP endpoint; grant-scoped tools for meeting create/update/location. Exact tool names pinned in slice 0. |
| **Vapi** | In-process or sidecar mock implementing the call-booking tool contract. |
| **Teams** | Local mock channel (HTTP webhook or UI fixture); not a production Teams app registration unless already available. |
| **Timeline** | Slice 0 review within days of go; slices 1–2 next; dual SDK + computer; combined demo last. Exact calendar TBD after go/no-go. |
| **Data / blast radius** | Edel: don’t worry for this spec — still **recommend** synthetic/staging defaults and no production CRM writes. |
| **Operator** | Edel or designated sales-rep reviewer for approve/deny during live slices. |

Exact AWS quotas, microVM GA/preview entitlements, Tempo MCP write scopes, and Claude computer-use feature parity are **not verified in this paper pass**.

---

## Risks / honest unknowns

| Risk / unknown | Consequence for the decision |
| --- | --- |
| **Lambda microVM ≠ full desktop** | Without an explicit browser/computer adapter, we cannot claim the “must prove computer/browser use” surface. Slice 0 must pick adapter or narrow the claim. |
| **OpenAI vs Claude computer-use parity** | Dual SDK same gate ≠ identical desktop/computer APIs. Journey may prove tools+HITL on both and computer-use on only one initially — call that out, don’t paper over. |
| **Tempo MCP contract** | Public web mostly shows Tempo *Timesheets* MCP, not a CRM named Tempo. Edel locked **Tempo CRM**; treat enterprise Tempo MCP as the SoT and pin tools/auth in slice 0. If the real contract is read-only or meeting-weak, early-stop and report. |
| **Teams mock fidelity** | A thin HTTP fixture may underwhelm stakeholders who expect Adaptive Cards / real channel UX. Enough for PoC acceptance if proactive + location update are visible and audited. |
| **Call booking legal/ops** | Even mocked, scripts should avoid implying live calls to real venues without consent. Keep venue fixture synthetic; no surprise PSTN. |
| **Always-on billing / TTL** | MicroVM max duration (~8h) and idle suspend policies may force a scheduler outside the VM for true always-on. Design always-on as control-plane scheduler + resumable cage, not an infinite VM. |
| **Enterprise tree missing on box** | `digital_assistant/docs/` not on this research box; paper references bot-experiments public docs. Build later must resolve which tree is canonical. |
| **Stand-in / portability ceiling** | Success validates adapters + BYO cage under one gate. Marketplace install and signed cross-harness agentPlugin remain unproven. |
| **Bypass via browser** | Same as hosted PoC: function/MCP gate cannot govern a browser route around it. Fixture must keep Tempo mutations off the open web path. [Hosted lesson][hosted-scope] |

**Evidence discipline:** SoT papers hold the product contract. bot-experiments holds the OSS gate seams and agentPlugin rename. AWS microVM facts from public Lambda microVM docs (2026). No account, agent, approval, Tempo call, or microVM run was executed in this paper pass.

---

## Decision ask for Edel

**Go / no-go on slice 0** (freeze contract + feasibility) after review of this paper.

If **go:** Main BOT (or designated builder) starts slice 0 only — pin microVM access, Tempo MCP contract, computer adapter, dual SDK clients, mocks, and agentPlugin grant map; return a feasibility note with early-stop verdict. No combined demo until slices clear.

If **no-go:** say which lock to change (cage provider, CRM, mock vs real, SDK set, or demo beats). Do not silently swap Relaticle, live Vapi, or Muse Connect.

---

## Recommendation: build vs wait

**Yes — after Edel go, run slice 0 feasibility next; do not start combined demo first.**

This PoC is the right next enterprise-shaped proof: owned badge+keys, BYO AWS microVM cage, dual SDK harnesses, Tempo-real sales journey, Vapi/Teams mocks. It complements (does not replace) the hosted-computer and bot-experiments evidence. Stop early on Tempo contract gaps, missing computer adapter, or harness absorption pressure.

---

## Bottom line — AI Research journal

Scope a sales-rep associate on **agentPlugin** + owned gate (bot-experiments patterns) inside an **AWS Lambda microVM** sandbox, with **OpenAI and Claude Agents SDKs** sharing the control plane, **Tempo MCP real**, **Vapi and Teams mocked**. Acceptance spine: proactive follow-up → create meeting → mock venue call → update location, while proving always-on, browser/computer, proactive, and Teams. Spec only; decide-ready for slice 0 go/no-go. [SoT][map]; [bot-exp][bot-exp]; [microvm][microvm].

[map]: control-surface-map.md
[claw]: claw-identity-vs-pluginversion.md
[oss]: oss-frameworks-vs-owned-gate.md
[dots]: openai-dots-vs-owned-gate.md
[hosted-scope]: poc-agents-sdk-computer-use-scope.md
[bot-exp]: https://github.com/ethancha0411/bot-experiments
[bot-glossary]: https://github.com/ethancha0411/bot-experiments/blob/main/docs/glossary.md
[gw]: https://github.com/ethancha0411/bot-experiments/blob/main/docs/approach/gateway-patterns.md
[agentplugin]: https://github.com/ethancha0411/bot-experiments/blob/main/docs/concept/agent-plugin-identity.md
[microvm]: https://docs.aws.amazon.com/lambda/latest/dg/microvms-how-it-works.html
[microvm-blog]: https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/

**SoT freeze (control-surface-map spine) still safe?** **yes** — we own badge+keys; AWS microVM is an enterprise BYO cage path for this PoC; dual SDKs are harness adapters not spine; Tempo/Vapi/Teams choices are demo surfaces under the same gate.
