from __future__ import annotations

#!/usr/bin/env python3
"""Run the offline gate proof, then optionally make one minimal Agents SDK call."""

import os
import tempfile
from pathlib import Path

from poc.agent_plugin import build_demo_agent_plugin
from poc.approval_store import ApprovalStore
from poc.gate import OwnedGate
from poc.ledger import JsonlLedger


def deterministic_demo() -> None:
    with tempfile.TemporaryDirectory(prefix="bot-experiments-hosted-") as directory:
        agent_plugin = build_demo_agent_plugin()
        approvals = ApprovalStore()
        ledger = JsonlLedger(Path(directory) / "decisions.jsonl")
        gate = OwnedGate({agent_plugin.id: agent_plugin}, approvals, ledger)

        automatic = gate.evaluate("offline-auto", agent_plugin.id, "read_status")
        pending = gate.evaluate("offline-review", agent_plugin.id, "send_message")
        missing = gate.evaluate("offline-missing", agent_plugin.id, "invented_tool")
        approvals.decide("offline-review", "approved", "offline-operator")
        approved = gate.evaluate("offline-review", agent_plugin.id, "send_message")

        assert automatic.decision == "automatic"
        assert pending.decision == "deny" and pending.reason == "approval_required"
        assert missing.decision == "deny" and missing.reason == "missing_grant"
        assert approved.decision == "approve"
        assert len(ledger.records()) == 4
        print("deterministic gate demo: PASS (automatic, pending, deny, approved resume)")


def optional_hosted_call() -> None:
    if not os.getenv("OPENAI_API_KEY"):
        print("OPENAI_API_KEY is not set; skipping optional hosted Agents SDK call.")
        return

    try:
        from agents import Agent, Runner
    except ImportError as error:
        print(f"OPENAI_API_KEY is set, but openai-agents is not installed: {error}")
        return

    agent = Agent(
        name="Governance fixture",
        instructions="Reply with exactly: hosted slice reachable",
    )
    result = Runner.run_sync(agent, "Run the connectivity fixture.")
    print(f"hosted Agents SDK result: {result.final_output}")


if __name__ == "__main__":
    deterministic_demo()
    optional_hosted_call()
