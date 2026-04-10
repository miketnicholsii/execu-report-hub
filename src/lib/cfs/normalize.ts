import { ActionItem, AuditResult, CustomerSummary, RawSourceRow, TrackerItem } from "@/lib/cfs/model";
import { mapStatusBucket, rankStatusForSort } from "@/lib/cfs/status";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function classifyStandardizedStatus(bucket: TrackerItem["status_bucket"], sourceSheet: string) {
  if (sourceSheet === "Open") return bucket === "Needs Review" ? "Open" : bucket;
  if (sourceSheet === "Complete") return "Completed Items";
  if (sourceSheet === "Deployments") return "Deployed Code Changes";
  if (sourceSheet === "Pending Deployment") return "Pending Deployments";
  if (sourceSheet === "Archive") return "Archive / Historical";
  return bucket;
}

export function normalizeRows(rows: RawSourceRow[]): TrackerItem[] {
  return rows.map((row) => {
    const raw = row.raw_record;
    const customer_name = raw.customer_name?.trim() || "Needs Review";
    const original_status = raw.status?.trim() || null;
    const status_bucket = mapStatusBucket(original_status, row.source_sheet);
    const next_steps = raw.next_steps?.trim() || null;
    const notes = raw.notes?.trim() || null;

    const review_flag = customer_name === "Needs Review" || status_bucket === "Needs Review";
    const blocker_flag = status_bucket === "Blocked" || status_bucket === "Waiting on CFS" || status_bucket === "Waiting on Customer";

    return {
      id: `${slugify(customer_name)}-${slugify(row.source_file)}-${row.source_sheet}-${row.source_row}`,
      customer_name,
      site: raw.site ?? null,
      project_name: raw.project_name ?? raw.topic ?? null,
      deliverable: raw.deliverable ?? raw.topic ?? raw.project_name ?? null,
      workstream: row.source_sheet,
      category: raw.category ?? null,
      priority: raw.priority ?? null,
      rm_reference: raw.rm_reference ?? null,
      original_status,
      standardized_status: classifyStandardizedStatus(status_bucket, row.source_sheet),
      status_bucket,
      owner: raw.owner ?? null,
      owner_type: raw.owner_type ?? "CFS",
      topic: raw.topic ?? null,
      context_details: raw.context_details ?? null,
      notes,
      next_steps,
      target_eta: raw.target_eta ?? null,
      last_update: raw.last_update ?? null,
      completed_date: raw.completed_date ?? null,
      deployed_date: raw.deployed_date ?? null,
      milestone_date: raw.milestone_date ?? null,
      blocker_flag,
      blocker_details: blocker_flag ? notes ?? next_steps ?? "Dependency / blocker present" : null,
      review_flag,
      source_file: row.source_file,
      source_sheet: row.source_sheet,
      source_row: row.source_row,
      imported_at: row.imported_at,
      raw_record: row.raw_record,
    };
  });
}

export function extractActionItems(items: TrackerItem[]): ActionItem[] {
  const actionItems: ActionItem[] = [];
  const actionRegex = /follow-up|schedule|deploy|validate|decision|waiting|test/i;

  for (const item of items) {
    const signals = [item.next_steps, item.notes, item.status_bucket].filter(Boolean).join(" | ");
    if (item.next_steps) {
      actionItems.push({
        action_item_id: `ai-next-${item.id}`,
        customer_name: item.customer_name,
        project_name: item.project_name,
        linked_tracker_item_id: item.id,
        linked_rm_reference: item.rm_reference,
        action_text: item.next_steps,
        owner: item.owner,
        owner_type: item.owner_type,
        due_date: item.target_eta ?? item.milestone_date,
        status: item.standardized_status,
        blockers: item.blocker_details,
        source_file: item.source_file,
        source_sheet: item.source_sheet,
        source_row: item.source_row,
        confidence: "high",
      });
    } else if (actionRegex.test(signals)) {
      actionItems.push({
        action_item_id: `ai-inferred-${item.id}`,
        customer_name: item.customer_name,
        project_name: item.project_name,
        linked_tracker_item_id: item.id,
        linked_rm_reference: item.rm_reference,
        action_text: `Follow-up needed: ${item.deliverable ?? item.topic ?? item.project_name ?? "Needs review"}`,
        owner: item.owner,
        owner_type: item.owner_type,
        due_date: item.target_eta ?? item.milestone_date,
        status: item.standardized_status,
        blockers: item.blocker_details,
        source_file: item.source_file,
        source_sheet: item.source_sheet,
        source_row: item.source_row,
        confidence: "medium",
      });
    }
  }

  return actionItems;
}

export function runAudit(rawRows: RawSourceRow[], normalized: TrackerItem[]): AuditResult {
  const ids = new Set(normalized.map((row) => `${row.source_file}-${row.source_sheet}-${row.source_row}`));
  const unmapped = rawRows.filter((row) => !ids.has(`${row.source_file}-${row.source_sheet}-${row.source_row}`));
  const duplicates = normalized.filter((item, idx) => normalized.findIndex((candidate) => candidate.id === item.id) !== idx);

  return {
    raw_row_count: rawRows.length,
    normalized_row_count: normalized.length,
    missing_status_count: normalized.filter((item) => !item.original_status).length,
    missing_owner_count: normalized.filter((item) => !item.owner).length,
    unmapped_row_count: unmapped.length,
    possible_duplicate_count: duplicates.length,
    empty_export_warning: normalized.length === 0,
  };
}

export function sortTrackerItems(items: TrackerItem[]): TrackerItem[] {
  return [...items].sort((a, b) => {
    if (a.blocker_flag !== b.blocker_flag) return a.blocker_flag ? -1 : 1;
    const statusRank = rankStatusForSort(a.status_bucket) - rankStatusForSort(b.status_bucket);
    if (statusRank !== 0) return statusRank;
    const priorityRank = (b.priority ?? "").localeCompare(a.priority ?? "");
    if (priorityRank !== 0) return priorityRank;
    const etaRank = (a.target_eta ?? "9999").localeCompare(b.target_eta ?? "9999");
    if (etaRank !== 0) return etaRank;
    return (a.rm_reference ?? "").localeCompare(b.rm_reference ?? "");
  });
}

export function summarizeCustomers(items: TrackerItem[], actionItems: ActionItem[]): CustomerSummary[] {
  const grouped = new Map<string, TrackerItem[]>();
  items.forEach((item) => {
    grouped.set(item.customer_name, [...(grouped.get(item.customer_name) ?? []), item]);
  });

  return [...grouped.entries()].map(([customer_name, customerItems]) => ({
    customer_name,
    customer_slug: slugify(customer_name),
    total_items: customerItems.length,
    open_items_count: customerItems.filter((item) => ["Open", "In Programming", "In Testing", "Blocked", "Waiting on CFS", "Waiting on Customer"].includes(item.source_sheet) || ["In Programming", "In Testing", "Blocked", "Waiting on CFS", "Waiting on Customer"].includes(item.status_bucket)).length,
    action_items_count: actionItems.filter((action) => action.customer_name === customer_name).length,
    pending_deployments_count: customerItems.filter((item) => item.source_sheet === "Pending Deployment").length,
    completed_items_count: customerItems.filter((item) => item.source_sheet === "Complete").length,
    deployed_count: customerItems.filter((item) => item.source_sheet === "Deployments").length,
    blockers_count: customerItems.filter((item) => item.blocker_flag).length,
    recently_updated_count: customerItems.filter((item) => item.last_update).length,
  }));
}

export function slugifyCustomer(name: string) {
  return slugify(name);
}
