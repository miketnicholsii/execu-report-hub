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
  "Not Started": "bg-slate-200 text-slate-700 border-slate-300",
  "Discovery": "bg-sky-100 text-sky-700 border-sky-200",
  "Drafting Spec": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Spec Review": "bg-violet-100 text-violet-700 border-violet-200",
  "Ready for Development": "bg-blue-100 text-blue-700 border-blue-200",
  "In Development": "bg-blue-100 text-blue-700 border-blue-200",
  "In Testing": "bg-amber-100 text-amber-700 border-amber-200",
  "Ready to Deploy": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Scheduled": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Waiting on CFS": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Monitoring": "bg-teal-100 text-teal-700 border-teal-200",
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
