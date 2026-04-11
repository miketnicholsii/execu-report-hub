import { CanonicalStatus, DerivedFlag } from "@/lib/cfs/standards";

export const STANDARD_STATUS_BUCKETS = [
  "Not Started",
  "Planning",
  "In Review",
  "In Programming",
  "In Testing",
  "Ready for Deployment",
  "Pending Deployment",
  "Waiting on CFS",
  "Waiting on Customer",
  "Blocked",
  "Live",
  "Complete",
  "Deployed",
  "Archived",
  "Needs Review",
] as const;

export type StandardStatusBucket = (typeof STANDARD_STATUS_BUCKETS)[number];

export type SourceSheetName =
  | "Open"
  | "Complete"
  | "Deployments"
  | "Pending Deployment"
  | "Archive"
  | (string & {});

export interface RawSourceRow {
  source_file: string;
  source_sheet: SourceSheetName;
  source_row: number;
  imported_at: string;
  raw_record: Record<string, string | null | undefined>;
}

export interface SourceImport {
  import_id: string;
  source_file: string;
  imported_at: string;
  row_count: number;
}

export interface TrackerItem {
  id: string;
  customer_name: string;
  site: string | null;
  project_name: string | null;
  deliverable: string | null;
  workstream: string | null;
  category: string | null;
  priority: string | null;
  rm_reference: string | null;
  rm_reference_raw: string | null;
  rm_references_detected: string[];
  original_status: string | null;
  standardized_status: string;
  canonical_status: CanonicalStatus;
  status_bucket: StandardStatusBucket;
  owner: string | null;
  owner_type: string | null;
  topic: string | null;
  context_details: string | null;
  notes: string | null;
  next_steps: string | null;
  target_eta: string | null;
  last_update: string | null;
  stale_days: number | null;
  completed_date: string | null;
  deployed_date: string | null;
  milestone_date: string | null;
  blocker_flag: boolean;
  blocker_details: string | null;
  review_flag: boolean;
  derived_flags: DerivedFlag[];
  source_file: string;
  source_sheet: string;
  source_row: number;
  imported_at: string;
  raw_record: Record<string, string | null | undefined>;
}

export interface ActionItem {
  action_item_id: string;
  customer_name: string;
  project_name: string | null;
  linked_tracker_item_id: string;
  linked_rm_reference: string | null;
  action_text: string;
  owner: string | null;
  owner_type: string | null;
  due_date: string | null;
  status: string;
  blockers: string | null;
  source_file: string;
  source_sheet: string;
  source_row: number;
  trigger_reason: string;
  confidence: "high" | "medium" | "low";
}

export interface CustomerSummary {
  customer_name: string;
  customer_slug: string;
  total_items: number;
  open_items_count: number;
  action_items_count: number;
  pending_deployments_count: number;
  completed_items_count: number;
  deployed_count: number;
  blockers_count: number;
  recently_updated_count: number;
}

export interface AuditResult {
  raw_row_count: number;
  normalized_row_count: number;
  missing_status_count: number;
  missing_owner_count: number;
  unmapped_row_count: number;
  possible_duplicate_count: number;
  empty_export_warning: boolean;
}
