import rawDataset from "@/data/cfsStructuredDataset.json";
import { normalizeStatus, slugify } from "@/lib/cfs/helpers";

interface RawCustomer { customer_id: string; customer_name: string; industry?: string; region?: string; account_owner?: string; contract_start?: string | null }
interface RawSite { site_id: string; customer_id: string; site_name: string }
interface RawProject {
  project_id: string;
  customer_id: string;
  site_id: string | null;
  project_name: string;
  deliverable: string | null;
  initiative_type?: string | null;
  summary: string;
  business_goal?: string | null;
  technical_goal?: string | null;
  status: string;
  phase?: string | null;
  percent_complete?: number | null;
  priority?: string | null;
  owner: string | null;
  sponsor?: string | null;
  start_date?: string | null;
  target_date?: string | null;
  last_updated?: string | null;
  dependencies?: string[];
  deployment_notes?: string | null;
}
interface RawMilestone {
  milestone_id: string;
  project_id: string | null;
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
  status?: string | null;
}
interface RawRmIssue {
  rm_issue_id: string;
  project_id: string;
  rm_reference: string;
  description: string;
  status: string;
  urgency: string | null;
  owner: string | null;
  type?: string | null;
  severity?: string | null;
  spec_status?: string | null;
  code_status?: string | null;
  testing_status?: string | null;
  deployment_status?: string | null;
  created_date?: string | null;
  due_date?: string | null;
  business_context?: string | null;
  technical_context?: string | null;
  key_requirements?: string | null;
  open_questions?: string | null;
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
interface RawTrackerItem {
  item_id: string;
  project_id: string;
  priority: string;
  topic: string;
  rm_reference: string | null;
  status: string;
  context: string | null;
  last_update: string | null;
  target_eta: string | null;
  notes: string | null;
  next_steps: string | null;
  owner: string | null;
  category?: string | null;
}
interface RawMeetingMinute {
  meeting_id: string;
  customer_id: string;
  project_id: string;
  title: string;
  date: string;
  attendees: string[];
  summary: string;
  decisions: string[];
  discussion_notes: string[];
  action_items_from_meeting: { description: string; owner: string; due_date: string | null; status: string }[];
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
  tracker_items?: RawTrackerItem[];
  meeting_minutes?: RawMeetingMinute[];
  linked_resources: RawResource[];
  recent_highlights: RawHighlight[];
  needs_review: RawNeedReview[];
}

const dataset = rawDataset as RawDataset;

export function loadSeedData() {
  return {
    customers: dataset.customers.map((c) => ({ ...c, slug: slugify(c.customer_name) })),
    sites: dataset.sites,
    projects: dataset.projects.map((p) => ({
      ...p,
      normalizedStatus: normalizeStatus(p.status),
      owner: p.owner ?? "Unassigned",
      initiative_type: p.initiative_type ?? "General",
      phase: p.phase ?? "TBD",
      percent_complete: p.percent_complete ?? 0,
      priority: p.priority ?? "Medium",
      dependencies: p.dependencies ?? [],
    })),
    milestones: dataset.milestones,
    actionItems: dataset.action_items.map((a) => ({
      ...a,
      owner: a.owner ?? "Unassigned",
      normalizedStatus: a.status ?? "Open",
    })),
    rmIssues: dataset.rm_issues.map((r) => ({
      ...r,
      owner: r.owner ?? "Unassigned",
      normalizedStatus: normalizeStatus(r.status),
    })),
    blockers: dataset.blockers,
    renewals: dataset.renewals.map((r) => ({ ...r, normalizedStatus: normalizeStatus(r.status) })),
    trackerItems: (dataset.tracker_items ?? []).map((t) => ({
      ...t,
      normalizedStatus: normalizeStatus(t.status),
      owner: t.owner ?? "Unassigned",
      category: t.category ?? "General",
    })),
    meetingMinutes: dataset.meeting_minutes ?? [],
    linkedResources: dataset.linked_resources,
    recentHighlights: dataset.recent_highlights,
    needsReview: dataset.needs_review,
  };
}

export type SeedData = ReturnType<typeof loadSeedData>;