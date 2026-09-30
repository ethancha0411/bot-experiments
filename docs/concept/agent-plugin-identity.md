# agentPlugin identity

An agentPlugin is the immutable, trusted capability package for an associate.
It answers two questions at the boundary: which published identity is running,
and which tools may that identity invoke?

```text
agentPlugin = id + version + badge + grants[]
grant        = tool + mode
mode         = disabled | automatic | approval_required
```

The model must not author or override these fields in tool arguments. The host
application resolves the badge from trusted context and passes it to the gate.
Unknown identities, mismatched tools, and absent grants deny.

The three modes are intentionally small:

- `disabled`: always deny.
- `automatic`: record an automatic decision, then allow the caller to proceed.
- `approval_required`: deny dispatch until a matching request has a prior human
  approval; a retry with that same request identity can then proceed.

Immutability makes the audit statement meaningful: the badge seen in a ledger
row refers to one fixed version and grant set. Production systems would add a
signed digest, registry persistence, revocation, and authenticated actors. The
stand-in here demonstrates only the contract seam.
