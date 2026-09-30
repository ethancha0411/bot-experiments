# Simon four-deny experiment note

The cleaned proof invokes four mechanically distinct denial branches: unknown
identity, invented tool, disabled tool, and approval-required tool without an
approval. All return `deny`; none has an upstream effect. This is the minimum
useful negative matrix for a fail-closed gate.

See `examples/simon-four-deny` for the runnable proof.
