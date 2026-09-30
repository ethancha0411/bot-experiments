# Slice 2: approval continuity

Approval-required calls are stored under the provider request identity. The
first evaluation withholds dispatch and creates a pending record. A human can
approve or deny that exact request. On resume, the gate rechecks current policy
and the request binding before any effect.

The source evidence covered restart recovery, changed arguments, expiry,
duplicate submission, rejection, and uncertain outcomes. The local scaffold is
thinner: request-matched approve/deny is implemented, while durable pending
state and at-most-once effect receipts remain documented gaps.
