import rawDataset from "@/data/cfsStructuredDataset.json";
import { normalizeStatus, slugify } from "@/lib/cfs/helpers";

interface RawCustomer { customer_id: string; customer_name: string }
interface RawSite { site_id: string; customer_id: string; site_name: string }
interface RawProject {
  project_id: string;
  customer_id: string;
  site_id: string | null;
  project_name: string;
  deliverable: string | null;
  summary: string;
  status: string;
  owner: string | null;
}
interface RawMilestone {
  milestone_id: string;
  project_id: string;
  title: string;
  date_text: string | null;
  date_confidence: "high" | "medium" | "low" | null;
}
interface RawAction {
  action_item_id: string;
  project_id: string;
  description: string;
  owner: string | null;
  due_date: string | null;
  urgency: string | null;
}
interface RawRmIssue {
  rm_issue_id: string;
  project_id: string;
  rm_reference: string;
  description: string;
  status: string;
  urgency: string | null;
  owner: string | null;
}
interface RawBlocker {
  blocker_id: string;
  project_id: string;
  description: string;
  severity: string | null;
}
interface RawRenewal {
  renewal_id: string;
  customer_id: string;
  project_id: string | null;
  renewal_type: string;
  renewal_date: string;
  date_confidence: "high" | "medium" | "low" | null;
  status: string;
  summary: string;
  quote_number: string | null;
}
interface RawNeedReview { needs_review_id: string; entity_type: string; entity_id: string; reason: string; date_confidence: string | null }
interface RawResource { resource_id: string; project_id: string | null; resource_type: string; label: string; href: string | null; notes: string | null }
interface RawHighlight { highlight_id: string; project_id: string; highlight: string; date_text: string | null }

interface RawDataset {
  customers: RawCustomer[];
  sites: RawSite[];
  projects: RawProject[];
  milestones: RawMilestone[];
  action_items: RawAction[];
  rm_issues: RawRmIssue[];
  blockers: RawBlocker[];
  renewals: RawRenewal[];
  linked_resources: RawResource[];
  recent_highlights: RawHighlight[];
  needs_review: RawNeedReview[];
}

const dataset = rawDataset as RawDataset;

export function loadSeedData() {
  return {
    customers: dataset.customers.map((c) => ({ ...c, slug: slugify(c.customer_name) })),
    sites: dataset.sites,
    projects: dataset.projects.map((p) => ({ ...p, normalizedStatus: normalizeStatus(p.status), owner: p.owner ?? "Unassigned" })),
    milestones: dataset.milestones,
    actionItems: dataset.action_items.map((a) => ({ ...a, owner: a.owner ?? "Unassigned", normalizedStatus: "Open" as const })),
    rmIssues: dataset.rm_issues.map((r) => ({ ...r, owner: r.owner ?? "Unassigned", normalizedStatus: normalizeStatus(r.status) })),
    blockers: dataset.blockers,
    renewals: dataset.renewals.map((r) => ({ ...r, normalizedStatus: normalizeStatus(r.status) })),
    linkedResources: dataset.linked_resources,
    recentHighlights: dataset.recent_highlights,
    needsReview: dataset.needs_review,
  };
}

export type SeedData = ReturnType<typeof loadSeedData>;
