"""In-memory approval stand-in keyed by the provider request ID."""

from __future__ import annotations
from dataclasses import dataclass


@dataclass
class Approval:
    request_id: str
    plugin_id: str
    tool: str
    status: str = "pending"
    actor: str | None = None


class ApprovalStore:
    def __init__(self) -> None:
        self._values: dict[str, Approval] = {}

    def get_or_create(self, request_id: str, plugin_id: str, tool: str) -> Approval:
        approval = self._values.get(request_id)
        if approval is None:
            approval = Approval(request_id, plugin_id, tool)
            self._values[request_id] = approval
        return approval

    def decide(self, request_id: str, decision: str, actor: str) -> Approval:
        approval = self._values[request_id]
        if approval.status != "pending" or decision not in {"approved", "denied"}:
            raise ValueError("approval cannot be decided")
        approval.status = decision
        approval.actor = actor
        return approval
