import rawDataset from "@/data/cfsStructuredDataset.json";
import { normalizeStatus, slugify } from "@/lib/cfs/helpers";

interface RawCustomer { customer_id: string; customer_name: string }
interface RawSite { site_id: string; customer_id: string; site_name: string }
interface RawProject { project_id: string; customer_id: string; site_id: string | null; project_name: string; status: string; summary: string; recent_highlights: string[] }
interface RawMilestone { milestone_id: string; project_id: string; title: string; date: string; confidence: string }
interface RawAction { action_item_id: string; project_id: string; description: string; owner: string | null; status: string; due_date: string | null }
interface RawRisk { risk_id: string; project_id: string; description: string; status: string }
interface RawRenewal { renewal_id: string; customer_id: string; renewal_date: string; status: string; summary: string }
interface RawNeedReview { item_id: string; entity_type: string; entity_id: string; reason: string; confidence: string }
interface RawResource { resource_id: string; label: string; href: string | null; availability: string; note: string }

interface RawDataset {
  customers: RawCustomer[];
  sites: RawSite[];
  projects: RawProject[];
  milestones: RawMilestone[];
  action_items: RawAction[];
  risks: RawRisk[];
  renewals: RawRenewal[];
  linked_resources: RawResource[];
  needs_review: RawNeedReview[];
}

const dataset = rawDataset as RawDataset;

export function loadSeedData() {
  return {
    customers: dataset.customers.map((c) => ({ ...c, slug: slugify(c.customer_name) })),
    sites: dataset.sites,
    projects: dataset.projects.map((p) => ({ ...p, normalizedStatus: normalizeStatus(p.status) })),
    milestones: dataset.milestones,
    actionItems: dataset.action_items.map((a) => ({ ...a, normalizedStatus: normalizeStatus(a.status), owner: a.owner && a.owner !== "TBD" ? a.owner : "Unassigned" })),
    risks: dataset.risks.map((r) => ({ ...r, normalizedStatus: normalizeStatus(r.status) })),
    renewals: dataset.renewals.map((r) => ({ ...r, normalizedStatus: normalizeStatus(r.status) })),
    linkedResources: dataset.linked_resources,
    needsReview: dataset.needs_review,
  };
}

export type SeedData = ReturnType<typeof loadSeedData>;
