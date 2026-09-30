# Slice 0: feasibility

The feasibility spike found a viable thin-integration route: use the hosted
runner as supplied, keep the mutation tool behind application code, and avoid
both an SDK fork and an owned VM. The required interface is small enough to test
offline: trusted binding in, tool request in, decision and ledger record out.

Proceed condition: the later slices must continue to fail closed and must label
the identity as a stand-in rather than claiming native installation.
