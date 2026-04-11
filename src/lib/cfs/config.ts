export const REQUIRED_CUSTOMER_ROUTES = [
  "/customers/banks-cold-storage",
  "/customers/braswell",
  "/customers/case-farms",
  "/customers/consolidated-catfish",
] as const;

export const REQUIRED_CUSTOMER_SLUGS = REQUIRED_CUSTOMER_ROUTES.map((route) => route.replace("/customers/", ""));

export const REQUIRED_CUSTOMER_SECTIONS = [
  "Customer Summary",
  "Active Projects / Deliverables",
  "Open Issues / Open Items",
  "Action Items",
  "Pending Deployments",
  "Completed Items",
  "Deployed Code Changes",
  "Archive / Historical Items",
  "Upcoming Dates / Milestones",
  "Notes / Context",
  "Needs Review / Unmapped",
] as const;

export const SHEET_MAPPING_RULES: Record<string, string> = {
  Open: "Open Issues / Active Work",
  Complete: "Completed Items",
  Deployed: "Deployed Code Changes",
  Deployments: "Deployed Code Changes",
  "Pending Deployment": "Pending Deployments",
  Archive: "Historical Archive",
};
