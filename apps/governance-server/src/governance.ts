import { buildAgentPlugin, grantFor, type AgentPlugin } from "@bot-experiments/agent-plugin";
import { JsonlLedger, type LedgerDecision } from "@bot-experiments/ledger";

export type ApprovalStatus = "pending" | "approved" | "denied";

export interface Approval {
  id: string;
  requestId: string;
  pluginId: string;
  tool: string;
  status: ApprovalStatus;
  createdAt: string;
  decidedAt?: string;
  actor?: string;
  reason?: string;
}

export interface EvaluationInput {
  requestId: string;
  pluginId: string;
  tool: string;
}

export interface EvaluationResult {
  decision: LedgerDecision;
  reason: string;
  requestId: string;
  approvalId?: string;
}

export interface DecisionLedger {
  append(record: {
    requestId: string;
    pluginId: string;
    tool: string;
    decision: LedgerDecision;
    actor: string;
    timestamp: string;
    reason: string;
  }): Promise<unknown>;
  records(): Promise<unknown[]>;
}

export const demoAgentPlugin = buildAgentPlugin({
  id: "demo-agent",
  version: "1.0.0",
  badge: "agentPlugin:demo-agent@1.0.0",
  grants: [
    { tool: "read_status", mode: "automatic" },
    { tool: "send_message", mode: "approval_required" },
    { tool: "delete_record", mode: "disabled" },
  ],
});

export class Governance {
  readonly plugins = new Map<string, Readonly<AgentPlugin>>();
  readonly approvals = new Map<string, Approval>();

  constructor(readonly ledger: DecisionLedger = new JsonlLedger()) {
    this.plugins.set(demoAgentPlugin.id, demoAgentPlugin);
    this.approvals.set("demo-approval-001", {
      id: "demo-approval-001",
      requestId: "demo-request-001",
      pluginId: demoAgentPlugin.id,
      tool: "send_message",
      status: "pending",
      createdAt: new Date().toISOString(),
      reason: "seeded_demo",
    });
  }

  pending(): Approval[] {
    return [...this.approvals.values()].filter((approval) => approval.status === "pending");
  }

  async decide(id: string, decision: "approve" | "deny", actor: string, reason: string): Promise<Approval> {
    const approval = this.approvals.get(id);
    if (!approval) throw Object.assign(new Error("approval not found"), { status: 404 });
    if (approval.status !== "pending") throw Object.assign(new Error("approval already decided"), { status: 409 });

    const updated: Approval = {
      ...approval,
      status: decision === "approve" ? "approved" : "denied",
      decidedAt: new Date().toISOString(),
      actor,
      reason,
    };
    await this.ledger.append({
      requestId: approval.requestId,
      pluginId: approval.pluginId,
      tool: approval.tool,
      decision,
      actor,
      timestamp: updated.decidedAt!,
      reason,
    });
    this.approvals.set(id, updated);
    return updated;
  }

  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const plugin = this.plugins.get(input.pluginId);
    const grant = plugin ? grantFor(plugin, input.tool) : undefined;
    const matchingApproval = [...this.approvals.values()].find((approval) =>
      approval.requestId === input.requestId &&
      approval.pluginId === input.pluginId &&
      approval.tool === input.tool,
    );

    let decision: LedgerDecision = "deny";
    let reason = "missing_agent_plugin";
    let approvalId: string | undefined;

    if (plugin && !grant) {
      reason = "missing_grant";
    } else if (grant?.mode === "disabled") {
      reason = "grant_disabled";
    } else if (grant?.mode === "automatic") {
      decision = "automatic";
      reason = "grant_automatic";
    } else if (grant?.mode === "approval_required") {
      if (matchingApproval?.status === "approved") {
        decision = "approve";
        reason = "prior_approval";
        approvalId = matchingApproval.id;
      } else {
        reason = matchingApproval?.status === "denied" ? "approval_denied" : "approval_required";
        const approval = matchingApproval ?? this.createPending(input);
        approvalId = approval.id;
      }
    }

    await this.ledger.append({
      ...input,
      decision,
      actor: "owned-gate",
      timestamp: new Date().toISOString(),
      reason,
    });
    return { decision, reason, requestId: input.requestId, ...(approvalId ? { approvalId } : {}) };
  }

  private createPending(input: EvaluationInput): Approval {
    const approval: Approval = {
      id: `approval-${input.requestId}`,
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
      reason: "approval_required",
    };
    this.approvals.set(approval.id, approval);
    return approval;
  }
}
