import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { JsonlLedger } from "../src/index.js";

test("appends and reads decision records", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "bot-experiments-ledger-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const ledger = new JsonlLedger(join(directory, "ledger.jsonl"));
  await ledger.append({
    requestId: "req-1",
    pluginId: "demo",
    tool: "read",
    decision: "automatic",
    actor: "gate",
    timestamp: "2026-01-01T00:00:00.000Z",
    reason: "grant_automatic",
  });
  assert.deepEqual(await ledger.records(), [{
    requestId: "req-1",
    pluginId: "demo",
    tool: "read",
    decision: "automatic",
    actor: "gate",
    timestamp: "2026-01-01T00:00:00.000Z",
    reason: "grant_automatic",
  }]);
});
