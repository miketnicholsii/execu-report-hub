import { useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import KpiCard from "@/components/KpiCard";
import { weeklySummaries } from "@/data/weeklySummaries";
import { customerById } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { CalendarDays, Sun, Cloud, Moon } from "lucide-react";

const PERIOD_LABELS = { BOW: "Beginning of Week", MOW: "Mid-Week", EOW: "End of Week" };
const PERIOD_ICONS = { BOW: Sun, MOW: Cloud, EOW: Moon };
const PERIOD_COLORS = { BOW: "text-status-caution", MOW: "text-primary", EOW: "text-status-on-track" };

const weeks = Array.from(new Set(weeklySummaries.map((s) => s.week))).sort().reverse();

export default function WeeklySummaryPage() {
  const [weekFilter, setWeekFilter] = useState(weeks[0] || "");
  const [levelFilter, setLevelFilter] = useState<"all" | "portfolio" | "customer" | "initiative">("all");
  const [periodFilter, setPeriodFilter] = useState<"all" | "BOW" | "MOW" | "EOW">("all");

  const filtered = useMemo(() => {
    return weeklySummaries.filter((s) => {
      if (weekFilter && s.week !== weekFilter) return false;
      if (levelFilter !== "all" && s.level !== levelFilter) return false;
      if (periodFilter !== "all" && s.period !== periodFilter) return false;
      return true;
    });
  }, [weekFilter, levelFilter, periodFilter]);

  const portfolioSummaries = filtered.filter((s) => s.level === "portfolio");
  const customerSummaries = filtered.filter((s) => s.level === "customer");

  const totalHighlights = filtered.reduce((a, s) => a + s.highlights.length, 0);
  const totalBlockers = filtered.reduce((a, s) => a + s.blockers.length, 0);
  const totalQuestions = filtered.reduce((a, s) => a + s.openQuestions.length, 0);

  const exportExcel = () => downloadCsv("cfs-weekly-summaries.csv", filtered.flatMap((s) => [
    ...s.highlights.map((h) => ({ Week: s.week, Period: s.period, Level: s.level, Customer: s.customer_id ? (customerById.get(s.customer_id)?.customer_name ?? s.customer_id) : "Portfolio", Type: "Highlight", Content: h, Owner: s.owner })),
    ...s.openQuestions.map((q) => ({ Week: s.week, Period: s.period, Level: s.level, Customer: s.customer_id ? (customerById.get(s.customer_id)?.customer_name ?? s.customer_id) : "Portfolio", Type: "Open Question", Content: q, Owner: s.owner })),
    ...s.blockers.map((b) => ({ Week: s.week, Period: s.period, Level: s.level, Customer: s.customer_id ? (customerById.get(s.customer_id)?.customer_name ?? s.customer_id) : "Portfolio", Type: "Blocker", Content: b, Owner: s.owner })),
    ...s.nextSteps.map((n) => ({ Week: s.week, Period: s.period, Level: s.level, Customer: s.customer_id ? (customerById.get(s.customer_id)?.customer_name ?? s.customer_id) : "Portfolio", Type: "Next Step", Content: n, Owner: s.owner })),
  ]));

  return (
    <AppShell title="Weekly Summaries" subtitle="BOW / MOW / EOW status framework" onExportExcel={exportExcel} onExportPdf={exportPdf}>
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Summaries" value={filtered.length} />
        <KpiCard label="Highlights" value={totalHighlights} color="text-status-on-track" />
        <KpiCard label="Open Questions" value={totalQuestions} color="text-status-caution" />
        <KpiCard label="Blockers" value={totalBlockers} color="text-destructive" />
        <KpiCard label="Week" value={weekFilter} />
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm print:hidden">
        <div className="grid md:grid-cols-3 gap-2">
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={weekFilter} onChange={(e) => setWeekFilter(e.target.value)}>
            {weeks.map((w) => <option key={w}>{w}</option>)}
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value as any)}>
            <option value="all">All Periods</option>
            <option value="BOW">Beginning of Week</option>
            <option value="MOW">Mid-Week</option>
            <option value="EOW">End of Week</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as any)}>
            <option value="all">All Levels</option>
            <option value="portfolio">Portfolio</option>
            <option value="customer">Customer</option>
            <option value="initiative">Initiative</option>
          </select>
        </div>
      </section>

      {/* Portfolio Summaries */}
      {portfolioSummaries.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Portfolio-Level Summaries
          </h2>
          {portfolioSummaries.map((s) => {
            const Icon = PERIOD_ICONS[s.period];
            return (
              <article key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`h-5 w-5 ${PERIOD_COLORS[s.period]}`} />
                  <h3 className="font-semibold text-foreground">{PERIOD_LABELS[s.period]}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">Updated {s.lastUpdated} · {s.owner}</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {s.highlights.length > 0 && (
                    <SummaryBlock title="Key Highlights" items={s.highlights} icon="✦" color="text-status-on-track" />
                  )}
                  {s.progress.length > 0 && (
                    <SummaryBlock title="Notable Progress" items={s.progress} icon="→" color="text-primary" />
                  )}
                  {s.openQuestions.length > 0 && (
                    <SummaryBlock title="Open Questions" items={s.openQuestions} icon="?" color="text-status-caution" />
                  )}
                  {s.blockers.length > 0 && (
                    <SummaryBlock title="Blockers" items={s.blockers} icon="!" color="text-destructive" />
                  )}
                  {s.nextSteps.length > 0 && (
                    <SummaryBlock title="Next Steps" items={s.nextSteps} icon="▸" color="text-foreground" />
                  )}
                  {s.rmUpdates.length > 0 && (
                    <SummaryBlock title="RM Updates" items={s.rmUpdates} icon="⚙" color="text-muted-foreground" />
                  )}
                  {s.deploymentUpdates.length > 0 && (
                    <SummaryBlock title="Deployments" items={s.deploymentUpdates} icon="🚀" color="text-status-info" />
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Customer Summaries */}
      {customerSummaries.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Customer-Level Summaries</h2>
          {customerSummaries.map((s) => {
            const Icon = PERIOD_ICONS[s.period];
            const custName = s.customer_id ? (customerById.get(s.customer_id)?.customer_name ?? s.customer_id) : "Unknown";
            return (
              <article key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`h-4 w-4 ${PERIOD_COLORS[s.period]}`} />
                  <h3 className="font-semibold text-foreground">{custName}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-medium border border-border bg-muted text-muted-foreground">{PERIOD_LABELS[s.period]}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{s.owner} · {s.lastUpdated}</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {s.highlights.length > 0 && <SummaryBlock title="Highlights" items={s.highlights} icon="✦" color="text-status-on-track" />}
                  {s.openQuestions.length > 0 && <SummaryBlock title="Open Questions" items={s.openQuestions} icon="?" color="text-status-caution" />}
                  {s.blockers.length > 0 && <SummaryBlock title="Blockers" items={s.blockers} icon="!" color="text-destructive" />}
                  {s.nextSteps.length > 0 && <SummaryBlock title="Next Steps" items={s.nextSteps} icon="▸" color="text-foreground" />}
                  {s.rmUpdates.length > 0 && <SummaryBlock title="RM Updates" items={s.rmUpdates} icon="⚙" color="text-muted-foreground" />}
                  {s.deploymentUpdates.length > 0 && <SummaryBlock title="Deployments" items={s.deploymentUpdates} icon="🚀" color="text-status-info" />}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No summaries match the selected filters.</p>
        </div>
      )}
    </AppShell>
  );
}

function SummaryBlock({ title, items, icon, color }: { title: string; items: string[]; icon: string; color: string }) {
  return (
    <div className="rounded-lg border border-border p-3 bg-muted/10">
      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">{title}</h4>
      <ul className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`${color} mt-0.5 flex-shrink-0 text-xs`}>{icon}</span>
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
