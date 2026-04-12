import { describe, expect, it } from "vitest";
import { rawSourceRows } from "@/data/cfsRawSources";
import { extractActionItems, normalizeRows, runAudit } from "@/lib/cfs/normalize";
import { RawSourceRow } from "@/lib/cfs/model";

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

  it("standardizes rm references and canonical status fields", () => {
    const normalized = normalizeRows(rawSourceRows);
    const rmRows = normalized.filter((row) => row.rm_reference);
    expect(rmRows.every((row) => /^RM-\\d{5}$/.test(row.rm_reference!))).toBe(true);
    expect(normalized.some((row) => row.canonical_status === "In Development")).toBe(true);
  });

  it("rewrites vague action text into operational instructions", () => {
    const sample: RawSourceRow = {
      source_file: "sample.csv",
      source_sheet: "Open",
      source_row: 1,
      imported_at: "2026-04-10T12:00:00Z",
      raw_record: {
        customer_name: "Braswell",
        status: "Waiting on CFS",
        deliverable: "PO search field requirements",
        next_steps: "follow up",
      },
    };

    const [normalized] = normalizeRows([sample]);
    const [action] = extractActionItems([normalized]);
    expect(action.action_text.toLowerCase()).not.toBe("follow up");
    expect(action.action_text).toContain("record outcome in tracker");
  });
});
