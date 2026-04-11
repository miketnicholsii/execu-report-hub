export type NormalizedStatus =
  | "Not Started"
  | "Discovery"
  | "Drafting Spec"
  | "Spec Review"
  | "Ready for Development"
  | "In Development"
  | "In Testing"
  | "Ready to Deploy"
  | "Scheduled"
  | "Blocked"
  | "Waiting on Customer"
  | "Waiting on CFS"
  | "Monitoring"
  | "Complete";

const STATUS_MAP: Record<string, NormalizedStatus> = {
  "NOT STARTED": "Not Started",
  OPEN: "Not Started",
  NEW: "Not Started",
  DISCOVERY: "Discovery",
  PLANNING: "Discovery",
  "IN SPEC": "Drafting Spec",
  "DRAFTING SPEC": "Drafting Spec",
  "SPEC REVIEW": "Spec Review",
  "IN REVIEW": "Spec Review",
  "READY FOR DEVELOPMENT": "Ready for Development",
  "READY FOR DEV": "Ready for Development",
  "IN PROGRESS": "In Development",
  IN_PROGRESS: "In Development",
  "IN PROGRAMMING": "In Development",
  TESTING: "In Testing",
  "IN TESTING": "In Testing",
  "READY TO DEPLOY": "Ready to Deploy",
  "READY FOR DEPLOYMENT": "Ready to Deploy",
  SCHEDULED: "Scheduled",
  "PENDING DEPLOYMENT": "Scheduled",
  BLOCKED: "Blocked",
  "WAITING ON CUSTOMER": "Waiting on Customer",
  "WAITING ON INFO": "Waiting on Customer",
  "WAITING ON CFS": "Waiting on CFS",
  LIVE: "Monitoring",
  MONITORING: "Monitoring",
  "POST IMPLEMENTATION": "Monitoring",
  POST_IMPLEMENTATION: "Monitoring",
  COMPLETE: "Complete",
  COMPLETED: "Complete",
  DEPLOYED: "Complete",
};

export function normalizeStatus(input: string | null | undefined): NormalizedStatus {
  if (!input) return "Not Started";
  const key = input.trim().toUpperCase();
  return STATUS_MAP[key] ?? STATUS_MAP[key.replace(/\s+/g, "_")] ?? "Not Started";
}

export function formatDateDisplay(input: string | null | undefined): string {
  if (!input) return "TBD";
  const plain = input.trim();
  if (!plain || plain.toUpperCase() === "TBD") return "TBD";
  const parsed = new Date(plain);
  if (Number.isNaN(parsed.getTime())) return plain;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function vagueMilestoneToLabel(input: string | null | undefined): string {
  if (!input) return "Date TBD";
  const raw = input.trim();
  const lower = raw.toLowerCase();
  if (lower.includes("week of")) return `${raw} (week window)`;
  if (lower.includes("mid to late")) return `${raw} (target window)`;
  if (lower.includes("before")) return `${raw} (deadline range)`;
  if (/^[a-z]+\s+\d{4}$/i.test(raw)) return `${raw} (month target)`;
  return formatDateDisplay(raw);
}

export function isVagueDate(input: string | null | undefined): boolean {
  if (!input) return true;
  const raw = input.toLowerCase();
  return raw.includes("week of") || raw.includes("mid to") || raw.includes("before") || raw.includes("tbd") || /^[a-z]+\s+\d{4}$/i.test(input.trim());
}

export function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
