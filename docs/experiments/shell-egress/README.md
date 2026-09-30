# Shell egress: docs only

No shell tool or egress proxy is implemented in this repository. The source
brainstorm investigated selective outbound access and found that loopback and
private-address restrictions made the intended allow-and-deny proof dependent
on environment-specific behavior.

Decision: keep shell off on the governed path. Inherit the harness network
boundary. Consider an outer cage only when a concrete deployment has a proven
need and a testable policy; do not present documentation as enforcement.
