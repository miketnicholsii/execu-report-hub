const BADGE_BASE = "inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap min-w-[80px] text-center";

const STATUS_STYLES: Record<string, string> = {
  "Complete": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Deployed": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Testing Complete": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Shipped": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Live": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Done": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Testing Active": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "In-Testing": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "In Progress": "bg-status-info/15 text-status-info border-status-info/30",
  "In Programming": "bg-status-info/15 text-status-info border-status-info/30",
  "In-Programming": "bg-status-info/15 text-status-info border-status-info/30",
  "Moved To Programming": "bg-primary/10 text-primary border-primary/30",
  "Moved to Programming": "bg-primary/10 text-primary border-primary/30",
  "In-Spec": "bg-status-info/10 text-status-info border-status-info/25",
  "In Spec": "bg-status-info/10 text-status-info border-status-info/25",
  "In Review": "bg-status-info/10 text-status-info border-status-info/25",
  "Waiting on Customer": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Waiting on Case Farms": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Waiting on Info": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Waiting on CFS": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Open": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "On Hold": "bg-muted text-muted-foreground border-border",
  "Quote Sent": "bg-primary/10 text-primary border-primary/30",
  "Planning": "bg-secondary text-secondary-foreground border-border",
  "Post Implementation": "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  "Pending": "bg-status-caution/10 text-status-caution border-status-caution/20",
  "TBD": "bg-muted text-muted-foreground border-border",
  "Not Started": "bg-muted/80 text-muted-foreground border-border",
  "Discovery": "bg-sky-500/15 text-sky-400 border-sky-500/25",
  "Drafting Spec": "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  "Spec Review": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "Ready for Development": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "In Development": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "In Testing": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Ready to Deploy": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Scheduled": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Monitoring": "bg-teal-500/15 text-teal-400 border-teal-500/25",
  "Blocked": "bg-destructive/15 text-destructive border-destructive/30",
};

const PRIORITY_STYLES: Record<string, string> = {
  "Highest": "bg-destructive/15 text-destructive border-destructive/30",
  "High": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Medium": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "Low": "bg-muted text-muted-foreground border-border",
};

const HEALTH_STYLES: Record<string, string> = {
  "On Track": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Healthy": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Caution": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "At Risk": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Blocked": "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} ${style}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLES[priority] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[60px] ${style}`}>{priority}</span>;
}

export function HealthBadge({ health }: { health: string }) {
  const style = HEALTH_STYLES[health] || "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[70px] ${style}`}>{health}</span>;
}

export function FlagBadge({ flag }: { flag: string }) {
  const isRed = ["Stale", "Overdue", "Blocked"].includes(flag);
  const style = isRed
    ? "bg-destructive/10 text-destructive border-destructive/20"
    : "bg-amber-500/10 text-amber-500 border-amber-500/20";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${style}`}>{flag}</span>;
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const style = urgency === "high"
    ? "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30"
    : "bg-muted text-muted-foreground border-border";
  return <span className={`${BADGE_BASE} min-w-[60px] ${style}`}>{urgency}</span>;
}
