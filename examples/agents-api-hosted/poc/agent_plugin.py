"""Immutable agentPlugin stand-in. Authority comes from application state, not model input."""

from __future__ import annotations
from dataclasses import dataclass
from types import MappingProxyType
from typing import Mapping

GRANT_MODES = frozenset({"disabled", "automatic", "approval_required"})


@dataclass(frozen=True)
class AgentPlugin:
    id: str
    version: str
    grants: Mapping[str, str]
    badge: str

    def __post_init__(self) -> None:
        if not self.id or not self.version or not self.badge:
            raise ValueError("agentPlugin identity fields must be non-empty")
        grants = dict(self.grants)
        if any(not tool or mode not in GRANT_MODES for tool, mode in grants.items()):
            raise ValueError("invalid agentPlugin grant")
        object.__setattr__(self, "grants", MappingProxyType(grants))


def build_demo_agent_plugin() -> AgentPlugin:
    return AgentPlugin(
        id="hosted-demo",
        version="1.0.0",
        badge="agentPlugin:hosted-demo@1.0.0",
        grants={
            "read_status": "automatic",
            "send_message": "approval_required",
            "delete_record": "disabled",
        },
    )
