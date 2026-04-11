const STATUS_STYLES: Record<string, string> = {
  "Complete": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Deployed": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Testing Complete": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Shipped": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
  "Live": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
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
  "Open": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "On Hold": "bg-muted text-muted-foreground border-border",
  "Quote Sent": "bg-primary/10 text-primary border-primary/30",
  "Planning": "bg-secondary text-secondary-foreground border-border",
  "Post Implementation": "bg-status-on-track/10 text-status-on-track border-status-on-track/20",
  "Pending": "bg-status-caution/10 text-status-caution border-status-caution/20",
  "TBD": "bg-muted text-muted-foreground border-border",
};

const PRIORITY_STYLES: Record<string, string> = {
  "Highest": "bg-destructive/15 text-destructive border-destructive/30",
  "High": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
  "Medium": "bg-status-caution/15 text-status-caution border-status-caution/30",
  "Low": "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLES[priority] || "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style}`}>{priority}</span>;
}

export function HealthBadge({ health }: { health: string }) {
  const styles: Record<string, string> = {
    "On Track": "bg-status-on-track/15 text-status-on-track border-status-on-track/30",
    "Caution": "bg-status-caution/15 text-status-caution border-status-caution/30",
    "At Risk": "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30",
    "Blocked": "bg-destructive/15 text-destructive border-destructive/30",
  };
  const style = styles[health] || "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style}`}>{health}</span>;
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const style = urgency === "high"
    ? "bg-status-at-risk/15 text-status-at-risk border-status-at-risk/30"
    : "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style}`}>{urgency}</span>;
}
