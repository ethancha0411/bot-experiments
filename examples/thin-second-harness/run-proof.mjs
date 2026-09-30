import assert from "node:assert/strict";

// A deliberately separate caller shape: it knows only the gate contract.
function makeHarness(evaluate, decide) {
  return {
    async run(request) {
      const first = await evaluate(request);
      if (first.reason !== "approval_required") return [first];
      await decide(first.approvalId, request.operatorDecision);
      return [first, await evaluate(request)];
    },
  };
}

const approvals = new Map();
async function evaluate(request) {
  if (request.tool !== "write_note") return { decision: "deny", reason: "missing_grant" };
  const status = approvals.get(request.requestId);
  if (status === "approved") return { decision: "approve", reason: "prior_approval" };
  if (status === "denied") return { decision: "deny", reason: "approval_denied" };
  return { decision: "deny", reason: "approval_required", approvalId: request.requestId };
}
async function decide(id, decision) { approvals.set(id, decision); }

const harness = makeHarness(evaluate, decide);
const approved = await harness.run({ requestId: "thin-approve", tool: "write_note", operatorDecision: "approved" });
const denied = await harness.run({ requestId: "thin-deny", tool: "write_note", operatorDecision: "denied" });
assert.equal(approved.at(-1).decision, "approve");
assert.equal(denied.at(-1).decision, "deny");
assert.equal(denied.at(-1).reason, "approval_denied");
console.log(JSON.stringify({ proof: "PASS", approved, denied }, null, 2));
