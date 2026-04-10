export type SourceSheet = "Open" | "Complete" | "Archive" | "Deployments" | "Pending Deployment";

export interface RawImportRow {
  id: string;
  customerHint: string;
  source_file: string;
  source_sheet: SourceSheet;
  source_row: number;
  raw_text: string;
  import_timestamp: string;
  priority?: string;
  topic?: string;
  location?: string;
  rm_ref?: string;
  status_original?: string;
  context?: string;
  last_update?: string;
  target_eta?: string;
  notes?: string;
  next_steps?: string;
  owner?: string;
}

export type WorkstreamType = "Open Issue" | "Completed Item" | "Deployed Code Change" | "Pending Deployment" | "Historical Archive" | "Unclassified / Needs Review";

export interface NormalizedItem {
  id: string;
  customer: string;
  project: string;
  deliverable: string;
  type: WorkstreamType;
  status_original: string;
  status_display: string;
  rm_ticket?: string;
  owner?: string;
  target_date?: string;
  details: string;
  source: Pick<RawImportRow, "source_file" | "source_sheet" | "source_row" | "raw_text" | "import_timestamp">;
}

export interface ActionItem {
  id: string;
  customer: string;
  project: string;
  summary: string;
  action_type: "Follow-up" | "Waiting on CFS" | "Waiting on Customer" | "Deployment Pending";
  status: string;
  owner?: string;
  source_item_id: string;
}

export interface IngestionCheckpoint {
  chunkIndex: number;
  processedRows: number;
  checkpointToken: string;
}

const importTimestamp = "2026-04-10T12:00:00Z";

export const rawImports: RawImportRow[] = [
  { id: "braswell-1", customerHint: "Braswell", source_file: "Braswell - Open Items.xlsx", source_sheet: "Open", source_row: 2, raw_text: "RM-13634 secondary label fails to print in shipping.", priority: "High", topic: "Label Printing", location: "Shipping", rm_ref: "RM-13634", status_original: "Testing Active", context: "Occurs during secondary label generation", last_update: "2026-04-09", target_eta: "2026-04-18", notes: "Tom reproduced in SSS", next_steps: "Validate patch in test environment", owner: "WJ", import_timestamp: importTimestamp },
  { id: "braswell-2", customerHint: "Braswell", source_file: "Braswell - Open Items.xlsx", source_sheet: "Open", source_row: 3, raw_text: "Cancel/reprint flow intermittently fails.", priority: "Medium", topic: "Cancel Reprint", location: "Shipping", rm_ref: "RM-13421", status_original: "", context: "Intermittent behavior", notes: "Need retest", next_steps: "Customer to provide fresh logs", owner: "WJ", import_timestamp: importTimestamp },
  { id: "braswell-3", customerHint: "Braswell", source_file: "Braswell - Open Items.xlsx", source_sheet: "Complete", source_row: 5, raw_text: "SSS baseline validation complete.", topic: "Baseline Validation", status_original: "Complete", context: "Completed with Tom", last_update: "2026-04-07", owner: "WJ", import_timestamp: importTimestamp },
  { id: "banks-1", customerHint: "Banks Cold Storage", source_file: "Banks Cold Storage - Issue Tracker.xlsx", source_sheet: "Open", source_row: 2, raw_text: "Inbound ASN staging mismatch for lot attribute.", priority: "High", topic: "ASN", location: "Receiving", status_original: "Waiting on CFS", notes: "Customer blocked on release", next_steps: "CFS to deliver hotfix", rm_ref: "RM-14002", owner: "MN", import_timestamp: importTimestamp },
  { id: "banks-2", customerHint: "Banks Cold Storage", source_file: "Banks Cold Storage - Issue Tracker.xlsx", source_sheet: "Archive", source_row: 21, raw_text: "Legacy scanner tuning issue from 2025.", topic: "Scanner", status_original: "Archived", import_timestamp: importTimestamp },
  { id: "case-1", customerHint: "Case Farms", source_file: "Case Farms - Open Items.xlsx", source_sheet: "Open", source_row: 2, raw_text: "Order update patch required for Winesburg.", topic: "Order Update", location: "Winesburg", status_original: "Waiting on CFS", notes: "Testing complete but deployment pending", next_steps: "Schedule production deployment window", rm_ref: "RM-13987", owner: "WJ", import_timestamp: importTimestamp },
  { id: "case-2", customerHint: "Case Farms", source_file: "Case Farms - Open Items.xlsx", source_sheet: "Pending Deployment", source_row: 8, raw_text: "Morganton zone install package approved and queued.", topic: "Zone Install", location: "Morganton", status_original: "Approved", target_eta: "2026-06-01", notes: "Waiting on customer maintenance window", owner: "MN", import_timestamp: importTimestamp },
  { id: "case-3", customerHint: "Case Farms", source_file: "Case Farms - Open Items.xlsx", source_sheet: "Complete", source_row: 12, raw_text: "Farmerville S9 cutover stabilization complete.", topic: "S9 Go-Live", status_original: "Complete", last_update: "2026-03-25", owner: "WJ", import_timestamp: importTimestamp },
  { id: "catfish-1", customerHint: "Consolidated Catfish", source_file: "Consolidated Catfish - Issue Tracker.xlsx", source_sheet: "Open", source_row: 3, raw_text: "Catch weight interface retry logic needed.", topic: "Interface", status_original: "In Progress", notes: "Follow-up with integration team", next_steps: "Create retry design note", rm_ref: "RM-14110", owner: "WJ", import_timestamp: importTimestamp },
  { id: "catfish-2", customerHint: "Consolidated Catfish", source_file: "Consolidated Catfish - Issue Tracker.xlsx", source_sheet: "Deployments", source_row: 9, raw_text: "Deployed Tuesday: carton summary performance patch.", topic: "Performance", status_original: "Deployed", last_update: "2026-04-08", owner: "WJ", import_timestamp: importTimestamp },
  { id: "catfish-3", customerHint: "Consolidated Catfish", source_file: "Consolidated Catfish - Issue Tracker.xlsx", source_sheet: "Complete", source_row: 14, raw_text: "UI sorting fix accepted by operations.", topic: "UI", status_original: "Complete", owner: "WJ", import_timestamp: importTimestamp },
  { id: "cfs-pdf-1", customerHint: "Farbest", source_file: "CFS Projects Team Initiatives & Status Tracker.pdf", source_sheet: "Open", source_row: 31, raw_text: "Farbest requested training for Q6, R8, Nimbus.", topic: "Training", status_original: "Planning", notes: "Need customer date options", next_steps: "Send scheduling poll", owner: "WJ", import_timestamp: importTimestamp },
  { id: "cfs-pdf-2", customerHint: "US Cold Storage", source_file: "CFS Projects Team Initiatives & Status Tracker.pdf", source_sheet: "Open", source_row: 33, raw_text: "RoboScan implementation target November 2026.", topic: "RoboScan", status_original: "Planning", target_eta: "2026-11", owner: "MN", import_timestamp: importTimestamp },
  { id: "cfs-pdf-3", customerHint: "Unknown", source_file: "CFS Projects Team Initiatives & Status Tracker.pdf", source_sheet: "Open", source_row: 50, raw_text: "Customer not specified: pending data cleanup and mapping.", topic: "Data Cleanup", status_original: "", notes: "Potential duplicate with Tip Top", import_timestamp: importTimestamp },
];

const statusFallbackMap: Record<string, string> = {
  "": "Needs Review",
  complete: "Complete",
  deployed: "Deployed",
  archived: "Archived",
  "waiting on cfs": "Waiting on CFS",
  "waiting on customer": "Waiting on Customer",
  planning: "Planning",
  "testing active": "Testing Active",
  approved: "Approved",
  "in progress": "In Progress",
};

export function inferDisplayStatus(statusOriginal?: string) {
  const value = (statusOriginal ?? "").trim().toLowerCase();
  return statusFallbackMap[value] ?? statusOriginal?.trim() ?? "Needs Review";
}

export function classifySheetType(sourceSheet: SourceSheet): WorkstreamType {
  if (sourceSheet === "Open") return "Open Issue";
  if (sourceSheet === "Complete") return "Completed Item";
  if (sourceSheet === "Deployments") return "Deployed Code Change";
  if (sourceSheet === "Pending Deployment") return "Pending Deployment";
  if (sourceSheet === "Archive") return "Historical Archive";
  return "Unclassified / Needs Review";
}

export function chunkedIngestion(rows: RawImportRow[], chunkSize = 4) {
  const checkpoints: IngestionCheckpoint[] = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    checkpoints.push({
      chunkIndex: Math.floor(i / chunkSize) + 1,
      processedRows: Math.min(i + chunkSize, rows.length),
      checkpointToken: `ckpt_${Math.floor(i / chunkSize) + 1}_${rows[Math.min(i + chunkSize, rows.length) - 1].id}`,
    });
  }
  return checkpoints;
}

function resolveCustomer(row: RawImportRow) {
  if (!row.customerHint || row.customerHint === "Unknown") return "Unclassified / Needs Review";
  return row.customerHint;
}

export function normalizeRows(rows: RawImportRow[]): NormalizedItem[] {
  return rows.map((row) => {
    const customer = resolveCustomer(row);
    const type = classifySheetType(row.source_sheet);
    const statusDisplay = inferDisplayStatus(row.status_original);
    const project = row.topic || "General";

    const forceUnclassified = customer === "Unclassified / Needs Review";
    const normalizedType = forceUnclassified ? "Unclassified / Needs Review" : type;

    return {
      id: row.id,
      customer,
      project,
      deliverable: row.raw_text,
      type: normalizedType,
      status_original: row.status_original ?? "",
      status_display: statusDisplay,
      rm_ticket: row.rm_ref,
      owner: row.owner,
      target_date: row.target_eta,
      details: row.context || row.notes || row.raw_text,
      source: {
        source_file: row.source_file,
        source_sheet: row.source_sheet,
        source_row: row.source_row,
        raw_text: row.raw_text,
        import_timestamp: row.import_timestamp,
      },
    };
  });
}

export function extractActionItems(items: NormalizedItem[]): ActionItem[] {
  const actionItems: ActionItem[] = [];

  items.forEach((item) => {
    const details = item.details.toLowerCase();
    const status = item.status_display.toLowerCase();

    if (details.includes("follow-up") || details.includes("next") || details.includes("schedule")) {
      actionItems.push({
        id: `ai-${item.id}-followup`,
        customer: item.customer,
        project: item.project,
        summary: `Follow up: ${item.deliverable}`,
        action_type: "Follow-up",
        status: item.status_display,
        owner: item.owner,
        source_item_id: item.id,
      });
    }

    if (status.includes("waiting on cfs")) {
      actionItems.push({
        id: `ai-${item.id}-cfs`,
        customer: item.customer,
        project: item.project,
        summary: `CFS action required for ${item.project}`,
        action_type: "Waiting on CFS",
        status: item.status_display,
        owner: item.owner,
        source_item_id: item.id,
      });
    }

    if (status.includes("waiting on customer")) {
      actionItems.push({
        id: `ai-${item.id}-customer`,
        customer: item.customer,
        project: item.project,
        summary: `Customer response required for ${item.project}`,
        action_type: "Waiting on Customer",
        status: item.status_display,
        owner: item.owner,
        source_item_id: item.id,
      });
    }

    if (item.type === "Pending Deployment") {
      actionItems.push({
        id: `ai-${item.id}-deploy`,
        customer: item.customer,
        project: item.project,
        summary: `Deployment pending: ${item.deliverable}`,
        action_type: "Deployment Pending",
        status: item.status_display,
        owner: item.owner,
        source_item_id: item.id,
      });
    }
  });

  return actionItems;
}

export function integrityAudit(rows: RawImportRow[], normalized: NormalizedItem[]) {
  const mapped = new Set(normalized.map((n) => n.id));
  return rows.filter((r) => !mapped.has(r.id));
}
