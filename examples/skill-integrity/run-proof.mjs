import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const body = "Only approved callers may read this governed skill body.\n";
const digest = value => `sha256:${createHash("sha256").update(value).digest("hex")}`;
const published = Object.freeze({ id: "governed-demo", digest: digest(body), mode: "approval_required" });

function loadSkill({ offeredDigest, approved }) {
  if (!approved) return { decision: "deny", reason: "approval_required", body: undefined };
  if (offeredDigest !== published.digest || digest(body) !== published.digest) {
    return { decision: "deny", reason: "skill_digest_mismatch", body: undefined };
  }
  return { decision: "approve", reason: "digest_and_approval_valid", body };
}

const withheld = loadSkill({ offeredDigest: published.digest, approved: false });
const loaded = loadSkill({ offeredDigest: published.digest, approved: true });
const tampered = loadSkill({ offeredDigest: digest(`${body}tampered`), approved: true });
assert.equal(withheld.body, undefined);
assert.equal(loaded.body, body);
assert.equal(tampered.decision, "deny");
console.log(JSON.stringify({ proof: "PASS", published, withheld, loaded, tampered }, null, 2));
