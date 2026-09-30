# Skill-integrity experiment note

The skill offer contains an identifier and SHA-256 digest, not the governed
body. The body is returned only after approval and only when the digest still
matches. Missing approval and content change both fail closed.

This is an unsigned integrity stand-in, not a complete software supply-chain
system. See `examples/skill-integrity`.
