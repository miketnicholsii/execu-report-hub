import { projects } from "@/data/sampleData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const PHASE_COLORS: Record<string, string> = {
  Planning: "hsl(260,50%,55%)",
  Research: "hsl(200,60%,50%)",
  Development: "hsl(220,70%,50%)",
  Testing: "hsl(38,92%,50%)",
  "Go-Live": "hsl(142,60%,40%)",
  Live: "hsl(142,70%,35%)",
  "Post-Implementation": "hsl(220,15%,50%)",
  "On Hold": "hsl(0,0%,55%)",
};

const HEALTH_COLORS: Record<string, string> = {
  "On Track": "hsl(142,60%,40%)",
  "Needs Attention": "hsl(38,92%,50%)",
  "At Risk": "hsl(0,72%,51%)",
  Blocked: "hsl(0,0%,45%)",
};

function normalizePhase(phase: string) {
  if (phase.includes("Testing")) return "Testing";
  if (phase.includes("Development")) return "Development";
  if (phase.includes("Post")) return "Post-Implementation";
  return phase;
}

export default function StatusCharts() {
  const phaseCounts: Record<string, number> = {};
  const healthCounts: Record<string, number> = {};

  projects.forEach((p) => {
    const norm = normalizePhase(p.phase);
    phaseCounts[norm] = (phaseCounts[norm] || 0) + 1;
    healthCounts[p.health] = (healthCounts[p.health] || 0) + 1;
  });

  const phaseData = Object.entries(phaseCounts).map(([name, value]) => ({ name, value }));
  const healthData = Object.entries(healthCounts).map(([name, value]) => ({ name, value }));

  return (
    <section className="print-avoid-break">
      <h2 className="text-lg font-semibold text-foreground mb-4">Status Distribution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Projects by Phase</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={phaseData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {phaseData.map((entry) => (
                  <Cell key={entry.name} fill={PHASE_COLORS[entry.name] || "hsl(220,15%,70%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Projects by Health</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={healthData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {healthData.map((entry) => (
                  <Cell key={entry.name} fill={HEALTH_COLORS[entry.name] || "hsl(220,15%,70%)"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
