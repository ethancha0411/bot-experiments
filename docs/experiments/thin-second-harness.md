# Thin second-harness experiment note

A second, dependency-free caller knows only the evaluation and decision
contract. It pauses on `approval_required`, records the operator outcome, and
resubmits the same request identity. Both approve and deny branches converge on
the expected final result, showing that governance is not tied to one harness.

See `examples/thin-second-harness` for the runnable proof.
