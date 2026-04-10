import { portfolioStore } from "@/lib/cfs/portfolio";

export interface TrackerRow {
  itemId: string;
  description: string;
  status: string;
  priority?: string | null;
  owner?: string | null;
  dueDate?: string | null;
  completedDate?: string | null;
  notes?: string | null;
  ticketNumber?: string | null;
  deploymentStatus?: string | null;
  section: string;
}

export interface TrackerSection {
  id: string;
  label: string;
  rows: TrackerRow[];
}

const SECTION_ORDER = ["Open", "Pending Deployment", "Deployments", "Complete", "Archive"];

function mapSection(sheet: string): string {
  if (sheet === "Open") return "Open Items";
  if (sheet === "Pending Deployment") return "Pending Deployment";
  if (sheet === "Deployments") return "Deployed Changes";
  if (sheet === "Complete") return "Completed Items";
  if (sheet === "Archive") return "Reference Notes";
  return "In Progress / Testing";
}

export function getTrackerSections(customerSlug: string): TrackerSection[] {
  const rows = portfolioStore.normalizedItems.filter((item) =>
    item.customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === customerSlug,
  );

  const sectionMap = new Map<string, TrackerRow[]>();

  for (const row of rows) {
    const section = mapSection(row.source_sheet);
    if (!sectionMap.has(section)) sectionMap.set(section, []);
    sectionMap.get(section)?.push({
      itemId: row.id,
      description: row.deliverable ?? row.topic ?? row.project_name ?? "—",
      status: row.status_bucket,
      priority: row.priority,
      owner: row.owner,
      dueDate: row.target_eta ?? row.milestone_date,
      completedDate: row.completed_date ?? row.deployed_date,
      notes: row.notes ?? row.next_steps ?? row.context_details,
      ticketNumber: row.rm_reference,
      deploymentStatus: row.source_sheet === "Deployments" ? "Deployed" : undefined,
      section,
    });
  }

  return Array.from(sectionMap.entries())
    .sort((a, b) => SECTION_ORDER.indexOf(a[0].replace(" Items", "")) - SECTION_ORDER.indexOf(b[0].replace(" Items", "")))
    .map(([label, sectionRows]) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      rows: sectionRows,
    }));
}
