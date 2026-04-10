import { describe, expect, it } from "vitest";
import { REQUIRED_CUSTOMER_SLUGS, REQUIRED_CUSTOMER_SECTIONS } from "@/lib/cfs/config";
import { portfolioStore } from "@/lib/cfs/portfolio";

describe("portfolio customer coverage", () => {
  it("publishes only required customer routes", () => {
    const slugs = portfolioStore.customerSummaries.map((customer) => customer.customer_slug).sort();
    expect(slugs).toEqual([...REQUIRED_CUSTOMER_SLUGS].sort());
  });

  it("defines all required customer page sections", () => {
    expect(REQUIRED_CUSTOMER_SECTIONS).toHaveLength(11);
    expect(REQUIRED_CUSTOMER_SECTIONS).toContain("Needs Review / Unmapped");
  });
});
