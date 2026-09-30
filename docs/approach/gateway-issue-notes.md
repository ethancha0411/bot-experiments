# Gateway issue notes

The seven source issue notes reduce to the following implementation sequence:

1. Keep the integration registry behind one interface; model input cannot
   register or replace capabilities.
2. Publish one small capability contract: immutable badge plus per-tool mode.
3. Put policy evaluation in a separate process boundary with an HTTP contract.
4. Prove gateway-only access using missing and invented-tool denial.
5. Store references to credentials rather than secrets; credential handling is
   out of scope here.
6. Introduce a real upstream only after the deterministic gate is proven. The
   optional hosted example follows this ordering.
7. Capture operator-journey evidence: pending → approve/deny → ledger row.

Future deepening should make approvals durable and authenticated before adding
more integrations. More connectors do not compensate for a weak decision seam.
