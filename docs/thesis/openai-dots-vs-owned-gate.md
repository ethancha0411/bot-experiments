# OpenAI control points vs an owned gate

OpenAI-hosted runners and sandboxes can supply model execution, computer tools,
network policy, and session continuity. Those controls are valuable within the
provider boundary. They are not, by themselves, a capability identity that can
be carried unchanged to another harness.

The bounded integration therefore composes rather than replaces:

1. The harness creates and runs the model session.
2. The application binds that run to a trusted agentPlugin.
3. Function and origin requests cross an owned gate.
4. Approval-required actions pause until an operator decides.
5. Authorization is recorded before a consequential dispatch.
6. Computer activity is observed as watch-only evidence, never treated as a
   permission grant.

This avoids an SDK fork and does not attempt to install the owned identity into
the provider VM. The local scaffold implements the gate contract; the hosted
computer findings remain evidence, not a local computer-control product.
