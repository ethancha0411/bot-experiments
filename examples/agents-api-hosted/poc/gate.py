"""Deterministic, fail-closed gate distilled from hosted slices 0–4."""

from __future__ import annotations
from dataclasses import dataclass

from .agent_plugin import AgentPlugin
from .approval_store import ApprovalStore
from .ledger import JsonlLedger


@dataclass(frozen=True)
class Decision:
    decision: str
    reason: str
    request_id: str


class OwnedGate:
    def __init__(self, registry: dict[str, AgentPlugin], approvals: ApprovalStore, ledger: JsonlLedger) -> None:
        self.registry = registry
        self.approvals = approvals
        self.ledger = ledger

    def evaluate(self, request_id: str, plugin_id: str, tool: str) -> Decision:
        agent_plugin = self.registry.get(plugin_id)
        mode = agent_plugin.grants.get(tool) if agent_plugin else None
        decision, reason = "deny", "missing_agent_plugin"

        if agent_plugin and mode is None:
            reason = "missing_grant"
        elif mode == "disabled":
            reason = "grant_disabled"
        elif mode == "automatic":
            decision, reason = "automatic", "grant_automatic"
        elif mode == "approval_required":
            approval = self.approvals.get_or_create(request_id, plugin_id, tool)
            if approval.status == "approved":
                decision, reason = "approve", "prior_approval"
            elif approval.status == "denied":
                reason = "approval_denied"
            else:
                reason = "approval_required"

        result = Decision(decision, reason, request_id)
        self.ledger.append({
            "requestId": request_id,
            "pluginId": plugin_id,
            "tool": tool,
            "decision": decision,
            "actor": "owned-gate",
            "reason": reason,
        })
        return result
