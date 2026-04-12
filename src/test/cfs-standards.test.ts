import { describe, expect, it } from "vitest";
import {
  deriveFlags,
  extractRmReferences,
  normalizeCustomerName,
  normalizeRmReference,
  normalizeStatusToCanonical,
} from "@/lib/cfs/standards";

describe("cfs standards", () => {
  it("normalizes rm references to RM-#####", () => {
    expect(normalizeRmReference("rm 934").normalized).toBe("RM-00934");
    expect(normalizeRmReference("Redmine #12846").normalized).toBe("RM-12846");
  });

  it("extracts rm references from free text", () => {
    const refs = extractRmReferences("Need follow-up for RM#111, and redmine 12230 before rm-934.");
    expect(refs.map((entry) => entry.normalized)).toEqual(["RM-00111", "RM-12230", "RM-00934"]);
  });

  it("normalizes imported statuses into canonical list", () => {
    expect(normalizeStatusToCanonical("Moved To Programming")).toBe("In Development");
    expect(normalizeStatusToCanonical("Quote Sent")).toBe("Waiting on Customer");
  });

  it("adds required derived flags", () => {
    const flags = deriveFlags({
      owner: null,
      dueDate: null,
      lastUpdate: null,
      canonicalStatus: "Blocked",
      specLinked: false,
    });
    expect(flags).toContain("Missing Owner");
    expect(flags).toContain("Missing Due Date");
    expect(flags).toContain("Missing Last Update");
    expect(flags).toContain("Missing Spec");
    expect(flags).toContain("High Risk");
  });

  it("normalizes customer names without changing words", () => {
    expect(normalizeCustomerName("  Banks    Cold   Storage  ")).toBe("Banks Cold Storage");
    expect(normalizeCustomerName("Braswell")).toBe("Braswell Eggs");
    expect(normalizeCustomerName("braswell egg")).toBe("Braswell Eggs");
  });
});
