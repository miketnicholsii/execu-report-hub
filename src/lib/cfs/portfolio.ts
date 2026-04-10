import { rawSourceRows } from "@/data/cfsRawSources";
import { extractActionItems, normalizeRows, runAudit, slugifyCustomer, sortTrackerItems, summarizeCustomers } from "@/lib/cfs/normalize";
import { REQUIRED_CUSTOMER_SLUGS } from "@/lib/cfs/config";

const normalizedItems = sortTrackerItems(normalizeRows(rawSourceRows));
const actionItems = extractActionItems(normalizedItems);
const customerSummaries = summarizeCustomers(normalizedItems, actionItems)
  .filter((customer) => REQUIRED_CUSTOMER_SLUGS.includes(customer.customer_slug))
  .sort((a, b) => a.customer_name.localeCompare(b.customer_name));
const audit = runAudit(rawSourceRows, normalizedItems);

export const portfolioStore = {
  rawSourceRows,
  normalizedItems,
  actionItems,
  customerSummaries,
  audit,
};

export function getCustomerDataBySlug(slug: string) {
  const customer = portfolioStore.customerSummaries.find((entry) => entry.customer_slug === slug);
  if (!customer) return null;

  const trackerItems = portfolioStore.normalizedItems.filter((item) => slugifyCustomer(item.customer_name) === slug);
  const customerActionItems = portfolioStore.actionItems.filter((item) => slugifyCustomer(item.customer_name) === slug);
  const customerRawRows = portfolioStore.rawSourceRows.filter((item) => slugifyCustomer(item.raw_record.customer_name ?? "Needs Review") === slug);

  return {
    customer,
    trackerItems,
    customerActionItems,
    customerRawRows,
  };
}
