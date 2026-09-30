# Slice 1: badge, deny, ledger

Slice 1 proved deterministic evaluation of a trusted capability badge. A valid
automatic grant can proceed; an unknown badge, invalid binding, unsupported
tool, malformed arguments, explicit disable, or absent grant cannot dispatch.
Every outcome is appended to the owned ledger.

The essential ordering is evaluate → append decision → return authority. A
ledger failure is an authorization failure, not an excuse to continue.
