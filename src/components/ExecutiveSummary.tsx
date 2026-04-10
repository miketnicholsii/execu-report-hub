import { projects } from "@/data/sampleData";
import { Activity, AlertTriangle, CheckCircle, Clock, Rocket, Settings, Shield, Wrench } from "lucide-react";

const metrics = () => {
  const total = projects.length;
  const planning = projects.filter((p) => p.phase === "Planning").length;
  const dev = projects.filter((p) => p.phase.includes("Development")).length;
  const testing = projects.filter((p) => p.phase.includes("Testing")).length;
  const live = projects.filter((p) => p.phase === "Live").length;
  const postImpl = projects.filter((p) => p.phase.includes("Post")).length;
  const atRisk = projects.filter((p) => p.health === "Needs Attention" || p.health === "At Risk").length;
  const goLive = projects.filter((p) => p.phase === "Go-Live").length;
  const totalRM = projects.reduce((sum, p) => sum + p.rmTickets.length, 0);

  return [
    { label: "Total Active", value: total, icon: Activity, accent: "text-primary" },
    { label: "Planning", value: planning, icon: Clock, accent: "text-[hsl(var(--phase-planning))]" },
    { label: "Development", value: dev, icon: Settings, accent: "text-[hsl(var(--phase-development))]" },
    { label: "Testing", value: testing, icon: Wrench, accent: "text-[hsl(var(--phase-testing))]" },
    { label: "Live", value: live, icon: CheckCircle, accent: "text-[hsl(var(--phase-live))]" },
    { label: "Post-Impl", value: postImpl, icon: Shield, accent: "text-[hsl(var(--phase-post))]" },
    { label: "Needs Attention", value: atRisk, icon: AlertTriangle, accent: "text-status-caution" },
    { label: "Go-Live", value: goLive, icon: Rocket, accent: "text-[hsl(var(--phase-golive))]" },
    { label: "Open RM Items", value: totalRM, icon: Activity, accent: "text-status-info" },
  ];
};

export default function ExecutiveSummary() {
  const m = metrics();
  return (
    <section className="print-avoid-break">
      <h2 className="text-lg font-semibold text-foreground mb-4">Executive Overview</h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {m.map((item) => (
          <div key={item.label} className="bg-card rounded-lg border p-3 flex flex-col items-center text-center gap-1">
            <item.icon className={`h-5 w-5 ${item.accent}`} />
            <span className="text-2xl font-bold text-foreground">{item.value}</span>
            <span className="text-[11px] text-muted-foreground leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
