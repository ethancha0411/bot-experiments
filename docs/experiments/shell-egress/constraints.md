# Shell-egress constraints

- Tool grants do not replace an OS or provider network policy.
- Blocking one connector does not necessarily block shell HTTP traffic.
- Local fixtures can produce misleading results when a sandbox treats loopback
  specially.
- Secret isolation must be tested independently from destination filtering.
- An executable experiment must define allowed destinations, denied
  destinations, DNS behavior, redirects, private ranges, and failure mode.

Until those cells are proven in a chosen harness, the safe scaffold policy is
no shell capability.
