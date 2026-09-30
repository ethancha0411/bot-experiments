import assert from "node:assert/strict";
import test from "node:test";
import { Governance } from "../src/governance.js";

class MemoryLedger {
  values: unknown[] = [];
  async append(record: unknown) { this.values.push(record); return record; }
  async records() { return this.values; }
}

test("fails closed for missing and disabled grants", async () => {
  const gate = new Governance(new MemoryLedger());
  assert.equal((await gate.evaluate({ requestId: "1", pluginId: "demo-agent", tool: "unknown" })).decision, "deny");
  assert.equal((await gate.evaluate({ requestId: "2", pluginId: "demo-agent", tool: "delete_record" })).decision, "deny");
  assert.equal((await gate.evaluate({ requestId: "3", pluginId: "unknown", tool: "read_status" })).decision, "deny");
});

test("allows automatic grants and requires a prior approval", async () => {
  const gate = new Governance(new MemoryLedger());
  assert.equal((await gate.evaluate({ requestId: "auto", pluginId: "demo-agent", tool: "read_status" })).decision, "automatic");
  const first = await gate.evaluate({ requestId: "needs-review", pluginId: "demo-agent", tool: "send_message" });
  assert.equal(first.decision, "deny");
  assert.equal(first.reason, "approval_required");
  await gate.decide(first.approvalId!, "approve", "tester", "safe fixture");
  assert.equal((await gate.evaluate({ requestId: "needs-review", pluginId: "demo-agent", tool: "send_message" })).decision, "approve");
});

test("does not update approval state when ledger append fails", async () => {
  const ledger = new MemoryLedger();
  const gate = new Governance(ledger);
  const approval = gate.pending()[0]!;
  ledger.append = async () => { throw new Error("ledger unavailable"); };
  await assert.rejects(gate.decide(approval.id, "approve", "tester", "test"), /ledger unavailable/);
  assert.equal(gate.pending()[0]?.status, "pending");
});
