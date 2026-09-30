import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Governance, type EvaluationInput } from "./governance.js";

const governance = new Governance();
const port = Number(process.env.GOVERNANCE_PORT ?? 8787);
const maxBodyBytes = 64_000;

function send(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  response.end(payload);
}

async function body(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > maxBodyBytes) throw Object.assign(new Error("request body too large"), { status: 413 });
    chunks.push(buffer);
  }
  if (!chunks.length) return {};
  try {
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || Array.isArray(value) || typeof value !== "object") throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw Object.assign(new Error("request body must be a JSON object"), { status: 400 });
  }
}

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw Object.assign(new Error(`${field} must be a non-empty string`), { status: 400 });
  }
  return value;
}

export async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method === "OPTIONS") return send(response, 204, {});
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  try {
    if (request.method === "GET" && url.pathname === "/health") return send(response, 200, { ok: true });
    if (request.method === "GET" && url.pathname === "/approvals/pending") return send(response, 200, governance.pending());
    if (request.method === "GET" && url.pathname === "/plugins") return send(response, 200, [...governance.plugins.values()]);
    if (request.method === "GET" && url.pathname === "/ledger") return send(response, 200, await governance.ledger.records());

    const decisionMatch = url.pathname.match(/^\/approvals\/([^/]+)\/(approve|deny)$/);
    if (request.method === "POST" && decisionMatch) {
      const input = await body(request);
      const approval = await governance.decide(
        decodeURIComponent(decisionMatch[1]!),
        decisionMatch[2] as "approve" | "deny",
        typeof input.actor === "string" && input.actor.trim() ? input.actor : "local-operator",
        typeof input.reason === "string" && input.reason.trim() ? input.reason : `operator_${decisionMatch[2]}`,
      );
      return send(response, 200, approval);
    }

    if (request.method === "POST" && url.pathname === "/evaluate") {
      const input = await body(request);
      const evaluation: EvaluationInput = {
        requestId: text(input.requestId, "requestId"),
        pluginId: text(input.pluginId, "pluginId"),
        tool: text(input.tool, "tool"),
      };
      return send(response, 200, await governance.evaluate(evaluation));
    }

    return send(response, 404, { error: "not found" });
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 503;
    const message = error instanceof Error ? error.message : "request failed";
    return send(response, status, { error: message });
  }
}

if (process.env.NODE_ENV !== "test") {
  createServer((request, response) => void handle(request, response)).listen(port, "0.0.0.0", () => {
    console.log(`governance-server listening on http://localhost:${port}`);
  });
}
