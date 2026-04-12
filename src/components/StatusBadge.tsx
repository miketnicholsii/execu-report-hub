/**
 * Unified badge/chip system for the NÈKO platform.
 * Every badge uses the same base dimensions, radius, and type scale.
 */

const BADGE_BASE =
  "inline-flex items-center justify-center px-2 py-[3px] rounded-md text-[10px] font-semibold border whitespace-nowrap min-w-[68px] text-center leading-tight tracking-wide uppercase";

/* ── Status Styles ── */
const STATUS_STYLES: Record<string, string> = {
  // Complete / Done family
  Complete: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Deployed: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  "Testing Complete": "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Shipped: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Live: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Done: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Closed: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  // Testing family
  "Testing Active": "bg-status-caution/10 text-status-caution border-status-caution/20",
  "In-Testing": "bg-status-caution/10 text-status-caution border-status-caution/20",
  "In Testing": "bg-status-caution/10 text-status-caution border-status-caution/20",
  // In Progress family
  "In Progress": "bg-status-info/10 text-status-info border-status-info/20",
  "In Programming": "bg-status-info/10 text-status-info border-status-info/20",
  "In-Programming": "bg-status-info/10 text-status-info border-status-info/20",
  "In Development": "bg-status-info/10 text-status-info border-status-info/20",
  "Development Active": "bg-status-info/10 text-status-info border-status-info/20",
  "Development Assigned": "bg-status-info/10 text-status-info border-status-info/20",
  // Moved to Programming
  "Moved To Programming": "bg-primary/8 text-primary border-primary/18",
  "Moved to Programming": "bg-primary/8 text-primary border-primary/18",
  // Spec family
  "In-Spec": "bg-status-info/8 text-status-info border-status-info/16",
  "In Spec": "bg-status-info/8 text-status-info border-status-info/16",
  "In Review": "bg-status-info/8 text-status-info border-status-info/16",
  "Drafting Spec": "bg-status-info/8 text-status-info border-status-info/16",
  "Spec Review": "bg-status-info/8 text-status-info border-status-info/16",
  // Waiting family
  "Waiting on Customer": "bg-status-waiting/10 text-status-waiting border-status-waiting/20",
  "Waiting on Case Farms": "bg-status-waiting/10 text-status-waiting border-status-waiting/20",
  "Waiting on Info": "bg-status-waiting/10 text-status-waiting border-status-waiting/20",
  "Waiting on CFS": "bg-status-caution/10 text-status-caution border-status-caution/20",
  "Waiting on Cust": "bg-status-waiting/10 text-status-waiting border-status-waiting/20",
  "Waiting for PM review": "bg-status-caution/10 text-status-caution border-status-caution/20",
  "Addt'l Deployment Required": "bg-status-caution/10 text-status-caution border-status-caution/20",
  // Other
  Open: "bg-status-caution/10 text-status-caution border-status-caution/20",
  "On Hold": "bg-muted text-muted-foreground border-border",
  "Quote Sent": "bg-primary/8 text-primary border-primary/18",
  Planning: "bg-secondary/20 text-secondary border-border",
  "Post Implementation": "bg-status-on-track/8 text-status-on-track border-status-on-track/16",
  Pending: "bg-status-caution/8 text-status-caution border-status-caution/16",
  TBD: "bg-muted text-muted-foreground border-border",
  "Not Started": "bg-muted/60 text-muted-foreground border-border",
  Discovery: "bg-primary/8 text-primary border-primary/18",
  "Ready for Development": "bg-status-info/10 text-status-info border-status-info/20",
  "Ready to Deploy": "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Scheduled: "bg-primary/8 text-primary border-primary/18",
  Monitoring: "bg-status-on-track/8 text-status-on-track border-status-on-track/16",
  Blocked: "bg-destructive/10 text-destructive border-destructive/20",
};

/* ── Priority Styles ── */
const PRIORITY_STYLES: Record<string, string> = {
  Highest: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-status-at-risk/10 text-status-at-risk border-status-at-risk/20",
  Medium: "bg-status-caution/10 text-status-caution border-status-caution/20",
  Low: "bg-muted text-muted-foreground border-border",
};

/* ── Health Styles ── */
const HEALTH_STYLES: Record<string, string> = {
  "On Track": "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Healthy: "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  Caution: "bg-status-caution/10 text-status-caution border-status-caution/20",
  Watch: "bg-status-caution/10 text-status-caution border-status-caution/20",
  "At Risk": "bg-status-at-risk/10 text-status-at-risk border-status-at-risk/20",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Blocked: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} ${style}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLES[priority] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[52px] ${style}`}>{priority}</span>;
}

export function HealthBadge({ health }: { health: string }) {
  const style = HEALTH_STYLES[health] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[64px] ${style}`}>{health}</span>;
}

export function FlagBadge({ flag }: { flag: string }) {
  const isRed = ["Stale", "Overdue", "Blocked", "Missing Owner"].includes(flag);
  const style = isRed
    ? "bg-destructive/8 text-destructive border-destructive/16"
    : "bg-status-caution/8 text-status-caution border-status-caution/16";
  return (
    <span className={`inline-flex items-center px-1.5 py-[2px] rounded text-[9px] font-bold border whitespace-nowrap tracking-wider uppercase ${style}`}>
      {flag}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const style =
    urgency === "high"
      ? "bg-status-at-risk/10 text-status-at-risk border-status-at-risk/20"
      : "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[52px] ${style}`}>{urgency}</span>;
}

/** Signal dot for inline health indicators */
export function HealthDot({ health }: { health: string }) {
  const colorMap: Record<string, string> = {
    Healthy: "bg-status-on-track",
    "On Track": "bg-status-on-track",
    Caution: "bg-status-caution",
    Watch: "bg-status-caution",
    "At Risk": "bg-status-at-risk",
    Critical: "bg-destructive",
    Blocked: "bg-destructive",
  };
  return <span className={`signal-dot ${colorMap[health] || "bg-muted-foreground"}`} />;
}
