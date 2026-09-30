export type GrantMode = "disabled" | "automatic" | "approval_required";

export interface AgentPluginGrant {
  tool: string;
  mode: GrantMode;
}

export interface AgentPlugin {
  id: string;
  version: string;
  grants: readonly AgentPluginGrant[];
  badge: string;
}

const MODES = new Set<GrantMode>([
  "disabled",
  "automatic",
  "approval_required",
]);

export function buildAgentPlugin(input: AgentPlugin): Readonly<AgentPlugin> {
  if (!input.id.trim() || !input.version.trim() || !input.badge.trim()) {
    throw new Error("agentPlugin id, version, and badge must be non-empty");
  }

  const seen = new Set<string>();
  const grants = input.grants.map((grant) => {
    if (!grant.tool.trim() || !MODES.has(grant.mode)) {
      throw new Error("agentPlugin grants require a tool and valid mode");
    }
    if (seen.has(grant.tool)) {
      throw new Error(`duplicate grant for tool: ${grant.tool}`);
    }
    seen.add(grant.tool);
    return Object.freeze({ ...grant });
  });

  return Object.freeze({
    id: input.id,
    version: input.version,
    badge: input.badge,
    grants: Object.freeze(grants),
  });
}

export function grantFor(
  agentPlugin: AgentPlugin,
  tool: string,
): AgentPluginGrant | undefined {
  return agentPlugin.grants.find((grant) => grant.tool === tool);
}
