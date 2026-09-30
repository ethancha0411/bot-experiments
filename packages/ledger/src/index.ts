import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export type LedgerDecision = "approve" | "deny" | "automatic";

export interface DecisionRecord {
  requestId: string;
  pluginId: string;
  tool: string;
  decision: LedgerDecision;
  actor: string;
  timestamp: string;
  reason: string;
}

export class JsonlLedger {
  readonly path: string;
  #writeQueue: Promise<void> = Promise.resolve();

  constructor(path = process.env.LEDGER_PATH ?? resolve("data/decisions.jsonl")) {
    this.path = resolve(path);
  }

  append(record: DecisionRecord): Promise<DecisionRecord> {
    const stored = Object.freeze({ ...record });
    const write = async () => {
      await mkdir(dirname(this.path), { recursive: true });
      await appendFile(this.path, `${JSON.stringify(stored)}\n`, { encoding: "utf8", mode: 0o600 });
    };
    const result = this.#writeQueue.then(write);
    this.#writeQueue = result.catch(() => undefined);
    return result.then(() => stored);
  }

  async records(): Promise<DecisionRecord[]> {
    await this.#writeQueue;
    try {
      const body = await readFile(this.path, "utf8");
      return body.split("\n").filter(Boolean).map((line) => JSON.parse(line) as DecisionRecord);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }
}
