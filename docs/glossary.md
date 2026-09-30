# Glossary

- **agentPlugin** — an immutable capability package identity: a badge, version,
  and set of tool grants. Prior internal papers called this `PluginVersion`;
  this repository uses `agentPlugin` in types, filenames, APIs, and prose.
- **Owned gate** — application-owned mediation that fails closed unless a valid
  grant and, where required, a prior approval exist.
- **Ledger** — durable append-only records of automatic, approve, and deny
  decisions, including actor, reason, and timestamp.
- **Harness** — the environment that runs an agent and supplies its sandbox,
  filesystem, network, and model/tool loop.
- **Watch-only** — observation that produces evidence but grants no authority.
