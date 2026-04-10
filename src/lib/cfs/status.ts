import { StandardStatusBucket } from "@/lib/cfs/model";

const STATUS_RULES: Array<{ pattern: RegExp; bucket: StandardStatusBucket }> = [
  { pattern: /not started|todo|backlog/i, bucket: "Not Started" },
  { pattern: /planning|scoping/i, bucket: "Planning" },
  { pattern: /review/i, bucket: "In Review" },
  { pattern: /program|dev|in progress/i, bucket: "In Programming" },
  { pattern: /testing|uat|sit|qa/i, bucket: "In Testing" },
  { pattern: /ready for deployment|ready/i, bucket: "Ready for Deployment" },
  { pattern: /pending deployment|queued/i, bucket: "Pending Deployment" },
  { pattern: /waiting on cfs/i, bucket: "Waiting on CFS" },
  { pattern: /waiting on customer/i, bucket: "Waiting on Customer" },
  { pattern: /blocked|hold/i, bucket: "Blocked" },
  { pattern: /live|go-live/i, bucket: "Live" },
  { pattern: /complete|done/i, bucket: "Complete" },
  { pattern: /deployed|production deploy/i, bucket: "Deployed" },
  { pattern: /archive|historical/i, bucket: "Archived" },
];

export function mapStatusBucket(originalStatus: string | null | undefined, sourceSheet: string): StandardStatusBucket {
  const text = `${originalStatus ?? ""} ${sourceSheet}`.trim();

  for (const rule of STATUS_RULES) {
    if (rule.pattern.test(text)) {
      return rule.bucket;
    }
  }

  if (/^open$/i.test(sourceSheet)) return "In Programming";
  if (/^complete$/i.test(sourceSheet)) return "Complete";
  if (/^deployments$/i.test(sourceSheet)) return "Deployed";
  if (/^pending deployment$/i.test(sourceSheet)) return "Pending Deployment";
  if (/^archive$/i.test(sourceSheet)) return "Archived";

  return "Needs Review";
}

export function rankStatusForSort(bucket: StandardStatusBucket): number {
  const rank: Record<StandardStatusBucket, number> = {
    Blocked: 0,
    "Waiting on Customer": 1,
    "Waiting on CFS": 2,
    "Pending Deployment": 3,
    "In Testing": 4,
    "In Programming": 5,
    "In Review": 6,
    "Ready for Deployment": 7,
    Planning: 8,
    "Not Started": 9,
    Live: 10,
    Complete: 11,
    Deployed: 12,
    Archived: 13,
    "Needs Review": 14,
  };
  return rank[bucket];
}
