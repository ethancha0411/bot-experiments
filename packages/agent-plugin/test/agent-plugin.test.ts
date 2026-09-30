import assert from "node:assert/strict";
import test from "node:test";
import { buildAgentPlugin, grantFor } from "../src/index.js";

test("builds an immutable agentPlugin and finds its grants", () => {
  const agentPlugin = buildAgentPlugin({
    id: "demo",
    version: "1.0.0",
    badge: "badge:demo@1.0.0",
    grants: [{ tool: "read", mode: "automatic" }],
  });
  assert.equal(grantFor(agentPlugin, "read")?.mode, "automatic");
  assert.ok(Object.isFrozen(agentPlugin));
  assert.ok(Object.isFrozen(agentPlugin.grants));
});

test("rejects duplicate tools", () => {
  assert.throws(() => buildAgentPlugin({
    id: "demo",
    version: "1",
    badge: "badge",
    grants: [
      { tool: "read", mode: "automatic" },
      { tool: "read", mode: "disabled" },
    ],
  }), /duplicate grant/);
});
