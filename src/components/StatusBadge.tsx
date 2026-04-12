/**
 * Unified badge/chip system for the entire NÈKO platform.
 * Every badge uses the same base, same height, same radius, same type scale.
 */

const BADGE_BASE =
  "inline-flex items-center justify-center px-2.5 py-[3px] rounded-md text-[10.5px] font-semibold border whitespace-nowrap min-w-[76px] text-center leading-tight tracking-wide uppercase";

/* ── Status Styles ── */
const STATUS_STYLES: Record<string, string> = {
  // Complete / Done family
  Complete: "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  Deployed: "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  "Testing Complete": "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  Shipped: "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  Live: "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  Done: "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  // Testing family
  "Testing Active": "bg-status-caution/12 text-status-caution border-status-caution/25",
  "In-Testing": "bg-status-caution/12 text-status-caution border-status-caution/25",
  "In Testing": "bg-status-caution/12 text-status-caution border-status-caution/25",
  // In Progress family
  "In Progress": "bg-status-info/12 text-status-info border-status-info/25",
  "In Programming": "bg-status-info/12 text-status-info border-status-info/25",
  "In-Programming": "bg-status-info/12 text-status-info border-status-info/25",
  "In Development": "bg-status-info/12 text-status-info border-status-info/25",
  "Development Active": "bg-status-info/12 text-status-info border-status-info/25",
  "Development Assigned": "bg-status-info/12 text-status-info border-status-info/25",
  // Moved to Programming
  "Moved To Programming": "bg-primary/8 text-primary border-primary/20",
  "Moved to Programming": "bg-primary/8 text-primary border-primary/20",
  // Spec family
  "In-Spec": "bg-status-info/8 text-status-info border-status-info/20",
  "In Spec": "bg-status-info/8 text-status-info border-status-info/20",
  "In Review": "bg-status-info/8 text-status-info border-status-info/20",
  "Drafting Spec": "bg-status-info/8 text-status-info border-status-info/20",
  "Spec Review": "bg-status-info/8 text-status-info border-status-info/20",
  // Waiting family
  "Waiting on Customer": "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25",
  "Waiting on Case Farms": "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25",
  "Waiting on Info": "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25",
  "Waiting on CFS": "bg-status-caution/12 text-status-caution border-status-caution/25",
  "Waiting on Cust": "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25",
  "Waiting for PM review": "bg-status-caution/12 text-status-caution border-status-caution/25",
  "Addt'l Deployment Required": "bg-status-caution/12 text-status-caution border-status-caution/25",
  // Other
  Open: "bg-status-caution/12 text-status-caution border-status-caution/25",
  "On Hold": "bg-muted text-muted-foreground border-border",
  "Quote Sent": "bg-primary/8 text-primary border-primary/20",
  Planning: "bg-secondary text-secondary-foreground border-border",
  "Post Implementation": "bg-status-on-track/8 text-status-on-track border-status-on-track/18",
  Pending: "bg-status-caution/8 text-status-caution border-status-caution/18",
  TBD: "bg-muted text-muted-foreground border-border",
  "Not Started": "bg-muted/80 text-muted-foreground border-border",
  Discovery: "bg-primary/8 text-primary border-primary/20",
  "Ready for Development": "bg-status-info/10 text-status-info border-status-info/22",
  "Ready to Deploy": "bg-status-on-track/10 text-status-on-track border-status-on-track/22",
  Scheduled: "bg-primary/8 text-primary border-primary/20",
  Monitoring: "bg-status-on-track/8 text-status-on-track border-status-on-track/18",
  Blocked: "bg-destructive/12 text-destructive border-destructive/25",
};

/* ── Priority Styles ── */
const PRIORITY_STYLES: Record<string, string> = {
  Highest: "bg-destructive/12 text-destructive border-destructive/25",
  High: "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25",
  Medium: "bg-status-caution/12 text-status-caution border-status-caution/25",
  Low: "bg-muted text-muted-foreground border-border",
};

/* ── Health Styles ── */
const HEALTH_STYLES: Record<string, string> = {
  "On Track": "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  Healthy: "bg-status-on-track/12 text-status-on-track border-status-on-track/25",
  Caution: "bg-status-caution/12 text-status-caution border-status-caution/25",
  "At Risk": "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25",
  Blocked: "bg-destructive/12 text-destructive border-destructive/25",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} ${style}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLES[priority] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[56px] ${style}`}>{priority}</span>;
}

export function HealthBadge({ health }: { health: string }) {
  const style = HEALTH_STYLES[health] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[68px] ${style}`}>{health}</span>;
}

export function FlagBadge({ flag }: { flag: string }) {
  const isRed = ["Stale", "Overdue", "Blocked"].includes(flag);
  const style = isRed
    ? "bg-destructive/8 text-destructive border-destructive/18"
    : "bg-status-caution/8 text-status-caution border-status-caution/18";
  return (
    <span className={`inline-flex items-center px-2 py-[2px] rounded-md text-[10px] font-semibold border whitespace-nowrap tracking-wide uppercase ${style}`}>
      {flag}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const style =
    urgency === "high"
      ? "bg-status-at-risk/12 text-status-at-risk border-status-at-risk/25"
      : "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[56px] ${style}`}>{urgency}</span>;
}
