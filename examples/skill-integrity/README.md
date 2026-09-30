# Skill integrity proof

The proof offers only a skill identifier and SHA-256 digest, withholds the body
until approval, and fails closed when the offered digest changes. It preserves
the security claim of the staging extract without its product-specific store.

Run `node examples/skill-integrity/run-proof.mjs`.
