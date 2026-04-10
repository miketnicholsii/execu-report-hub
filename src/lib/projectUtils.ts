import { ProjectPhase, HealthStatus } from "@/data/types";

export function getHealthColor(health: HealthStatus) {
  switch (health) {
    case "On Track": return { text: "text-status-on-track", bg: "bg-status-on-track-bg", border: "border-status-on-track" };
    case "Needs Attention": return { text: "text-status-caution", bg: "bg-status-caution-bg", border: "border-status-caution" };
    case "At Risk": return { text: "text-status-at-risk", bg: "bg-status-at-risk-bg", border: "border-status-at-risk" };
    case "Blocked": return { text: "text-status-blocked", bg: "bg-status-blocked-bg", border: "border-status-blocked" };
  }
}

export function getPhaseColor(phase: ProjectPhase) {
  if (phase.includes("Planning")) return "bg-[hsl(var(--phase-planning-bg))] text-[hsl(var(--phase-planning))]";
  if (phase.includes("Research")) return "bg-[hsl(var(--phase-research-bg))] text-[hsl(var(--phase-research))]";
  if (phase.includes("Development")) return "bg-[hsl(var(--phase-development-bg))] text-[hsl(var(--phase-development))]";
  if (phase.includes("Testing")) return "bg-[hsl(var(--phase-testing-bg))] text-[hsl(var(--phase-testing))]";
  if (phase === "Go-Live") return "bg-[hsl(var(--phase-golive-bg))] text-[hsl(var(--phase-golive))]";
  if (phase === "Live") return "bg-[hsl(var(--phase-live-bg))] text-[hsl(var(--phase-live))]";
  if (phase.includes("Post")) return "bg-[hsl(var(--phase-post-bg))] text-[hsl(var(--phase-post))]";
  if (phase.includes("Hold")) return "bg-[hsl(var(--phase-onhold-bg))] text-[hsl(var(--phase-onhold))]";
  if (phase === "At Risk") return "bg-status-at-risk-bg text-status-at-risk";
  return "bg-secondary text-secondary-foreground";
}

export function getCustomerGroups(projects: import("@/data/types").ProjectCard[]) {
  const groups: Record<string, import("@/data/types").ProjectCard[]> = {};
  projects.forEach((p) => {
    const key = p.customer;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, projects]) => ({ name, projects }));
}
