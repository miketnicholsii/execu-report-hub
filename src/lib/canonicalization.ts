const CUSTOMER_CANONICAL: Record<string, string> = {
  "braswell": "Braswell Eggs",
  "braswell eggs": "Braswell Eggs",
  "braswell egg": "Braswell Eggs",
  "braswell farms": "Braswell Eggs",
  "bwe": "Braswell Eggs",
};

const INITIATIVE_ALIASES: Array<[RegExp, string]> = [
  [/\bs9\s+post[ -]?implementation\b/i, "S9 Post Implementation"],
  [/\bs9\s+upgrade\b/i, "S9 Upgrade"],
  [/\bactive\s+work\b/i, "Active Workstream"],
  [/\bcompleted\s+items?\b/i, "Completed Workstream"],
];

const RM_PATTERN = /\bRM[-\s:]?(\d{3,6})\b|\b(\d{4,6})\b/gi;

function toTitle(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function canonicalCustomerName(raw?: string | null): string {
  if (!raw?.trim()) return "Unknown";
  const cleaned = raw.trim().replace(/\s+/g, " ");
  return CUSTOMER_CANONICAL[cleaned.toLowerCase()] ?? cleaned;
}

export function customerAliasesForCanonical(canonical: string): string[] {
  const aliases = Object.entries(CUSTOMER_CANONICAL)
    .filter(([, mapped]) => mapped === canonical)
    .map(([alias]) => toTitle(alias));
  if (!aliases.includes(canonical)) aliases.unshift(canonical);
  return Array.from(new Set(aliases));
}

export function normalizeInitiativeTitle(raw?: string | null): string {
  if (!raw?.trim()) return "Unscoped Initiative";
  const cleaned = raw.replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
  for (const [pattern, canonical] of INITIATIVE_ALIASES) {
    if (pattern.test(cleaned)) return canonical;
  }
  return cleaned;
}

export function extractRmReferencesFromText(...sources: Array<string | null | undefined>): string[] {
  const text = sources.filter(Boolean).join(" ");
  if (!text) return [];

  const refs = new Set<string>();
  let match: RegExpExecArray | null;
  RM_PATTERN.lastIndex = 0;
  while ((match = RM_PATTERN.exec(text)) !== null) {
    const digits = (match[1] || match[2] || "").replace(/\D/g, "");
    if (digits.length < 4) continue;
    refs.add(`RM-${digits.padStart(5, "0")}`);
  }
  return Array.from(refs);
}

export function fingerprintAction(title: string, customer: string, owner: string): string {
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return `${canonicalCustomerName(customer).toLowerCase()}::${normalizedTitle}::${owner.toLowerCase() || "unassigned"}`;
}

export function actionConfidence(source: "db" | "meeting" | "file" | "static", hasDueDate: boolean, hasOwner: boolean, linkedRmCount: number): number {
  let score = source === "db" ? 0.92 : source === "meeting" ? 0.82 : source === "file" ? 0.76 : 0.68;
  if (hasDueDate) score += 0.04;
  if (hasOwner) score += 0.02;
  if (linkedRmCount > 0) score += 0.02;
  return Math.min(0.99, Number(score.toFixed(2)));
}
