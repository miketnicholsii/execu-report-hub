export type NormalizedStatus =
  | "Planning"
  | "In Progress"
  | "Testing"
  | "In Review"
  | "Live"
  | "Post-Implementation"
  | "Blocked"
  | "TBD"
  | "Open"
  | "Complete";

const STATUS_MAP: Record<string, NormalizedStatus> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  TESTING: "Testing",
  IN_REVIEW: "In Review",
  LIVE: "Live",
  POST_IMPLEMENTATION: "Post-Implementation",
  BLOCKED: "Blocked",
  OPEN: "Open",
  COMPLETE: "Complete",
  TBD: "TBD",
};

export function normalizeStatus(input: string | null | undefined): NormalizedStatus {
  if (!input) return "TBD";
  return STATUS_MAP[input] ?? STATUS_MAP[input.toUpperCase()] ?? "TBD";
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
