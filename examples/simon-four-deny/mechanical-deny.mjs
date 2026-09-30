import assert from "node:assert/strict";

const grants = new Map([
  ["ping", "automatic"],
  ["write_note", "approval_required"],
  ["delete_record", "disabled"],
]);

function decide({ pluginKnown = true, tool, approval = "none" }) {
  if (!pluginKnown) return { decision: "deny", reason: "missing_agent_plugin" };
  const mode = grants.get(tool);
  if (!mode) return { decision: "deny", reason: "missing_grant" };
  if (mode === "disabled") return { decision: "deny", reason: "grant_disabled" };
  if (mode === "approval_required" && approval !== "approved") {
    return { decision: "deny", reason: approval === "denied" ? "approval_denied" : "approval_required" };
  }
  return { decision: mode === "automatic" ? "automatic" : "approve", reason: "grant_satisfied" };
}

const evidence = {
  unknownPlugin: decide({ pluginKnown: false, tool: "ping" }),
  inventedTool: decide({ tool: "get_secret" }),
  disabledTool: decide({ tool: "delete_record" }),
  unapprovedTool: decide({ tool: "write_note" }),
};

for (const result of Object.values(evidence)) assert.equal(result.decision, "deny");
assert.deepEqual(new Set(Object.values(evidence).map(value => value.reason)), new Set([
  "missing_agent_plugin", "missing_grant", "grant_disabled", "approval_required",
]));
console.log(JSON.stringify({ proof: "PASS", ...evidence }, null, 2));
