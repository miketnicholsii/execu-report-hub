export const CANONICAL_STATUSES = [
  "Not Started",
  "Discovery",
  "Drafting Spec",
  "Spec Review",
  "Ready for Development",
  "In Development",
  "In Testing",
  "Ready to Deploy",
  "Scheduled",
  "Blocked",
  "Waiting on Customer",
  "Waiting on CFS",
  "Monitoring",
  "Complete",
  "On Hold",
] as const;

export type CanonicalStatus = (typeof CANONICAL_STATUSES)[number];

export const DERIVED_FLAGS = [
  "Needs Attention",
  "Aging Item",
  "Due Soon",
  "High Risk",
  "Missing Owner",
  "Missing Due Date",
  "Missing Spec",
  "Missing Last Update",
  "Recently Updated",
  "Stale",
  "Overdue",
] as const;

export type DerivedFlag = (typeof DERIVED_FLAGS)[number];

const STATUS_ALIASES: Record<string, CanonicalStatus> = {
  "not started": "Not Started",
  new: "Not Started",
  open: "Not Started",
  discovery: "Discovery",
  planning: "Discovery",
  research: "Discovery",
  "drafting spec": "Drafting Spec",
  "in spec": "Drafting Spec",
  "in-spec": "Drafting Spec",
  "spec draft": "Drafting Spec",
  "spec review": "Spec Review",
  "in review": "Spec Review",
  "ready for development": "Ready for Development",
  "ready for dev": "Ready for Development",
  "in development": "In Development",
  "in progress": "In Development",
  "in programming": "In Development",
  "moved to programming": "In Development",
  coding: "In Development",
  "in testing": "In Testing",
  "testing active": "In Testing",
  "sit testing": "In Testing",
  "qa testing": "In Testing",
  uat: "In Testing",
  "testing complete": "Ready to Deploy",
  "ready to deploy": "Ready to Deploy",
  "ready for deployment": "Ready to Deploy",
  "ready for deploy": "Ready to Deploy",
  scheduled: "Scheduled",
  "pending deployment": "Scheduled",
  blocked: "Blocked",
  blocker: "Blocked",
  "needs review": "Spec Review",
  "waiting on customer": "Waiting on Customer",
  "waiting on info": "Waiting on Customer",
  "quote sent": "Waiting on Customer",
  "waiting on cfs": "Waiting on CFS",
  "waiting on internal": "Waiting on CFS",
  monitoring: "Monitoring",
  live: "Monitoring",
  "post implementation": "Monitoring",
  "post-implementation": "Monitoring",
  complete: "Complete",
  done: "Complete",
  deployed: "Complete",
  shipped: "Complete",
  "on hold": "On Hold",
  hold: "On Hold",
};

const RM_PATTERN = /(?:\b(?:rm|redmine|r\.m\.?)\b\s*[-#: ]*|\b)(\d{3,6})\b/gi;
const CUSTOMER_ALIASES: Record<string, string> = {
  braswell: "Braswell Eggs",
  "braswell egg": "Braswell Eggs",
  "braswell eggs": "Braswell Eggs",
  "braswell farms": "Braswell Eggs",
};

export function formatRmId(idDigits: string | number): string {
  const digits = String(idDigits).replace(/\D/g, "").slice(-5).padStart(5, "0");
  return `RM-${digits}`;
}

export function normalizeRmReference(raw?: string | null): { normalized: string | null; raw: string | null } {
  if (!raw) return { normalized: null, raw: null };
  const match = raw.match(/(\d{3,6})/);
  if (!match) return { normalized: null, raw };
  return {
    normalized: formatRmId(match[1]),
    raw,
  };
}

export function extractRmReferences(text?: string | null): Array<{ raw: string; normalized: string }> {
  if (!text) return [];
  const refs = new Map<string, { raw: string; normalized: string }>();
  let match: RegExpExecArray | null;
  while ((match = RM_PATTERN.exec(text)) !== null) {
    const raw = match[0].trim();
    const normalized = formatRmId(match[1]);
    refs.set(normalized, { raw, normalized });
  }
  return [...refs.values()];
}

export function normalizeStatusToCanonical(raw?: string | null, sourceSheet?: string): CanonicalStatus {
  const key = (raw ?? "").trim().toLowerCase();
  if (key && STATUS_ALIASES[key]) return STATUS_ALIASES[key];

  if (/test|uat|qa/i.test(sourceSheet ?? "")) return "In Testing";
  if (/review/i.test(sourceSheet ?? "")) return "Spec Review";
  if (/complete/i.test(sourceSheet ?? "")) return "Complete";
  if (/deploy/i.test(sourceSheet ?? "")) return "Ready to Deploy";
  if (/archive/i.test(sourceSheet ?? "")) return "Monitoring";
  if (/open|program/i.test(sourceSheet ?? "")) return "In Development";
  return "Not Started";
}

export function normalizeCustomerName(raw?: string | null): string {
  if (!raw) return "Needs Review";
  const cleaned = raw.trim().replace(/\s+/g, " ");
  const aliasKey = cleaned.toLowerCase();
  return CUSTOMER_ALIASES[aliasKey] ?? cleaned;
}

export function normalizeDate(raw?: string | null): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function deriveFlags(record: {
  owner?: string | null;
  dueDate?: string | null;
  lastUpdate?: string | null;
  canonicalStatus: CanonicalStatus;
  specLinked?: boolean;
}): DerivedFlag[] {
  const flags = new Set<DerivedFlag>();

  if (!record.owner || /^tbd|unassigned$/i.test(record.owner.trim())) flags.add("Missing Owner");
  if (!record.dueDate) flags.add("Missing Due Date");
  if (!record.lastUpdate) flags.add("Missing Last Update");
  if (record.specLinked === false) flags.add("Missing Spec");

  const now = Date.now();
  if (record.dueDate) {
    const due = new Date(record.dueDate).getTime();
    if (!Number.isNaN(due)) {
      const daysUntilDue = Math.ceil((due - now) / 86400000);
      if (daysUntilDue <= 5) flags.add("Due Soon");
      if (daysUntilDue < 0) {
        flags.add("Overdue");
        flags.add("Needs Attention");
      }
    }
  }

  if (record.lastUpdate) {
    const last = new Date(record.lastUpdate).getTime();
    if (!Number.isNaN(last)) {
      const daysSince = Math.floor((now - last) / 86400000);
      if (daysSince > 21) flags.add("Aging Item");
      if (daysSince > 30) flags.add("Stale");
      if (daysSince <= 3) flags.add("Recently Updated");
      if (daysSince > 14) flags.add("Needs Attention");
    }
  }

  if (record.canonicalStatus === "Blocked" || record.canonicalStatus === "Waiting on Customer") {
    flags.add("High Risk");
  }

  return [...flags];
}

export function detectDuplicateRmKeys(items: Array<{ customer_name: string; rm_reference: string | null }>): string[] {
  const seen = new Map<string, number>();
  for (const item of items) {
    if (!item.rm_reference) continue;
    const key = `${item.customer_name}::${item.rm_reference}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return [...seen.entries()].filter(([, count]) => count > 1).map(([key]) => key);
}
