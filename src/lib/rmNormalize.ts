import { deriveFlags, extractRmReferences as extractCanonicalRmReferences, normalizeRmReference, normalizeStatusToCanonical } from "@/lib/cfs/standards";

/**
 * Normalize any RM reference variant into RM-##### format.
 * Handles: "RM-12721", "RM 12721", "rm12721", "12721", "redmine 12721", "RM#12721"
 */
export function normalizeRm(raw: string): string {
  if (!raw) return raw;
  return normalizeRmReference(raw).normalized ?? raw;
}

/** Extract all RM references from a block of text and normalize them */
export function extractRmReferences(text: string): string[] {
  return extractCanonicalRmReferences(text).map((entry) => entry.normalized);
}

/** Standardize status text into the controlled vocabulary */
const STATUS_MAP: Record<string, string> = {
  "not started": "Not Started",
  "new": "Not Started",
  "discovery": "Discovery",
  "research": "Discovery",
  "drafting spec": "Drafting Spec",
  "spec review": "Spec Review",
  "in spec": "Drafting Spec",
  "in-spec": "Drafting Spec",
  "ready for development": "Ready for Development",
  "ready for dev": "Ready for Development",
  "in development": "In Development",
  "in programming": "In Development",
  "in-programming": "In Development",
  "moved to programming": "In Development",
  "coding": "In Development",
  "in testing": "In Testing",
  "in-testing": "In Testing",
  "testing active": "In Testing",
  "sit testing": "In Testing",
  "uat": "In Testing",
  "testing complete": "Ready to Deploy",
  "ready to deploy": "Ready to Deploy",
  "scheduled": "Scheduled",
  "blocked": "Blocked",
  "waiting on customer": "Waiting on Customer",
  "waiting on info": "Waiting on Customer",
  "waiting on cfs": "Waiting on CFS",
  "monitoring": "Monitoring",
  "complete": "Complete",
  "done": "Complete",
  "deployed": "Complete",
  "shipped": "Complete",
  "live": "Complete",
  "on hold": "On Hold",
  "open": "Open",
  "in progress": "In Progress",
  "in review": "Spec Review",
  "quote sent": "Waiting on Customer",
};

export function normalizeStatus(raw: string): string {
  if (!raw) return "Not Started";
  const key = raw.toLowerCase().trim();
  return STATUS_MAP[key] || normalizeStatusToCanonical(raw);
}

/** Calculate days between a date and now */
export function daysBetween(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

/** Get aging bucket label */
export function agingBucket(days: number | null): string {
  if (days === null) return "Unknown";
  if (days <= 7) return "0–7 days";
  if (days <= 14) return "8–14 days";
  if (days <= 30) return "15–30 days";
  if (days <= 60) return "31–60 days";
  return "61+ days";
}

/** Get attention flags for a record */
export function getAttentionFlags(record: {
  owner?: string | null;
  due_date?: string | null;
  last_update?: string | null;
  status?: string;
}): string[] {
  const flags: string[] = [];
  if (!record.owner || record.owner === "TBD" || record.owner === "Unassigned") flags.push("Missing Owner");
  if (!record.due_date) flags.push("Missing Due Date");
  if (record.due_date) {
    const daysUntil = -daysBetween(record.due_date)!;
    if (daysUntil < 0) flags.push("Overdue");
    else if (daysUntil <= 7) flags.push("Due Soon");
  }
  if (record.last_update) {
    const age = daysBetween(record.last_update);
    if (age !== null && age > 30) flags.push("Aging Item");
    if (age !== null && age > 14) flags.push("Needs Attention");
  }
  if (record.status === "Blocked") flags.push("High Risk");
  flags.push(...deriveFlags({
    owner: record.owner,
    dueDate: record.due_date,
    lastUpdate: record.last_update,
    canonicalStatus: normalizeStatusToCanonical(record.status),
    specLinked: true,
  }).filter((flag) => !flags.includes(flag)));
  return flags;
}
