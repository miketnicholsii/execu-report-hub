import { describe, expect, it } from "vitest";
import { rawSourceRows } from "@/data/cfsRawSources";
import { extractActionItems, normalizeRows, runAudit } from "@/lib/cfs/normalize";

describe("cfs normalization", () => {
  it("preserves every raw row during normalization", () => {
    const normalized = normalizeRows(rawSourceRows);
    expect(normalized).toHaveLength(rawSourceRows.length);
  });

  it("generates action items from explicit and inferred signals", () => {
    const normalized = normalizeRows(rawSourceRows);
    const actions = extractActionItems(normalized);
    expect(actions.length).toBeGreaterThan(0);
    expect(actions.some((item) => item.trigger_reason === "Next Steps populated")).toBe(true);
    expect(actions.some((item) => item.trigger_reason === "Waiting on CFS")).toBe(true);
  });

  it("audit reports zero unmapped rows", () => {
    const normalized = normalizeRows(rawSourceRows);
    const audit = runAudit(rawSourceRows, normalized);
    expect(audit.unmapped_row_count).toBe(0);
  });
});
