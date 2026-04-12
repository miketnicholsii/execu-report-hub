/**
 * CompanySummaryNarrative — generates a grounded executive narrative
 * from real KPI data. No AI fabrication — purely data-driven prose.
 */
import { useMemo } from "react";
import { FileText } from "lucide-react";

interface NarrativeProps {
  kpis: {
    totalCustomers: number;
    totalInitiatives: number;
    totalRm: number;
    openRm: number;
    staleRm: number;
    blockedRm: number;
    totalActions: number;
    openActions: number;
    highPriorityActions: number;
    overdueActions: number;
    atRiskCustomers: number;
    cautionCustomers: number;
    totalMeetings: number;
    totalKeyDates: number;
    totalRenewals: number;
  };
  topCustomersByOpenRms: { name: string; count: number }[];
  topCustomersByStale: { name: string; count: number }[];
  waitingOnCustomerCount: number;
  waitingOnCfsCount: number;
  inDevelopmentCount: number;
  inTestingCount: number;
  completeCount: number;
  recentlyUpdatedCount: number;
}

export default function CompanySummaryNarrative({
  kpis,
  topCustomersByOpenRms,
  topCustomersByStale,
  waitingOnCustomerCount,
  waitingOnCfsCount,
  inDevelopmentCount,
  inTestingCount,
  completeCount,
  recentlyUpdatedCount,
}: NarrativeProps) {
  const narrative = useMemo(() => {
    const lines: string[] = [];

    // Overall health
    const openPct = kpis.totalRm > 0 ? Math.round((kpis.openRm / kpis.totalRm) * 100) : 0;
    const closedPct = 100 - openPct;

    if (kpis.atRiskCustomers === 0 && kpis.blockedRm === 0) {
      lines.push(`The CFS portfolio is in a **healthy position** with ${kpis.totalCustomers} active customers and ${kpis.totalRm} total RM tickets tracked. ${closedPct}% of all tickets have been completed.`);
    } else if (kpis.atRiskCustomers > 0) {
      lines.push(`The portfolio requires **executive attention** — ${kpis.atRiskCustomers} customer${kpis.atRiskCustomers > 1 ? "s are" : " is"} flagged At Risk across ${kpis.totalCustomers} active accounts. ${kpis.totalRm} RM tickets are tracked, with ${kpis.openRm} currently open (${openPct}%).`);
    } else {
      lines.push(`The portfolio is **stable but has active blockers** — ${kpis.blockedRm} items are blocked across the ${kpis.totalCustomers} customer base. ${kpis.openRm} of ${kpis.totalRm} RMs remain open.`);
    }

    // What's going well
    const goingWell: string[] = [];
    if (completeCount > 0) goingWell.push(`${completeCount} tickets marked complete`);
    if (inTestingCount > 0) goingWell.push(`${inTestingCount} items actively in testing`);
    if (recentlyUpdatedCount > 0) goingWell.push(`${recentlyUpdatedCount} tickets updated recently`);
    if (goingWell.length > 0) {
      lines.push(`**What's going well:** ${goingWell.join(", ")}.`);
    }

    // Development pipeline
    if (inDevelopmentCount > 0 || inTestingCount > 0) {
      lines.push(`**Active pipeline:** ${inDevelopmentCount} items in development and ${inTestingCount} in testing, indicating steady delivery momentum.`);
    }

    // Attention needed
    const attention: string[] = [];
    if (kpis.staleRm > 0) attention.push(`${kpis.staleRm} stale/aging RMs without recent activity`);
    if (kpis.overdueActions > 0) attention.push(`${kpis.overdueActions} overdue action items`);
    if (kpis.blockedRm > 0) attention.push(`${kpis.blockedRm} blocked items requiring intervention`);
    if (kpis.highPriorityActions > 0) attention.push(`${kpis.highPriorityActions} high-priority actions still open`);
    if (attention.length > 0) {
      lines.push(`**Needs attention:** ${attention.join("; ")}.`);
    }

    // Customer highlights
    if (topCustomersByOpenRms.length > 0) {
      const top3 = topCustomersByOpenRms.slice(0, 3);
      lines.push(`**Highest workload:** ${top3.map(c => `${c.name} (${c.count} open RMs)`).join(", ")}.`);
    }

    if (topCustomersByStale.length > 0) {
      const top2 = topCustomersByStale.slice(0, 2);
      lines.push(`**Stale work concentration:** ${top2.map(c => `${c.name} (${c.count} aging)`).join(", ")} — these may need owner follow-up.`);
    }

    // Waiting analysis
    if (waitingOnCustomerCount > 0 || waitingOnCfsCount > 0) {
      lines.push(`**Dependencies:** ${waitingOnCustomerCount} items waiting on customer input, ${waitingOnCfsCount} items waiting on CFS action.`);
    }

    // Action summary
    if (kpis.openActions > 0) {
      lines.push(`**Action items:** ${kpis.openActions} open actions across the portfolio (${kpis.totalActions} total tracked).`);
    }

    return lines;
  }, [kpis, topCustomersByOpenRms, topCustomersByStale, waitingOnCustomerCount, waitingOnCfsCount, inDevelopmentCount, inTestingCount, completeCount, recentlyUpdatedCount]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Executive Summary</h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Source-grounded portfolio narrative · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </div>
      <div className="space-y-2.5 text-sm text-foreground leading-relaxed">
        {narrative.map((line, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground italic">
          This summary is generated from live portfolio data. All figures are source-grounded.
        </p>
      </div>
    </div>
  );
}
