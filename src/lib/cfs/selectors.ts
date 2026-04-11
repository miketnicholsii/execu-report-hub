import { loadSeedData } from "@/data/cfsSeedLoader";
import { formatDateDisplay, isVagueDate, vagueMilestoneToLabel } from "@/lib/cfs/helpers";

const seed = loadSeedData();

export function getPortfolioSnapshot() {
  const projectById = new Map(seed.projects.map((p) => [p.project_id, p]));
  const customerById = new Map(seed.customers.map((c) => [c.customer_id, c]));
  const siteById = new Map(seed.sites.map((s) => [s.site_id, s]));

  const byCustomer = seed.customers.map((customer) => {
    const projects = seed.projects.filter((p) => p.customer_id === customer.customer_id);
    const ids = new Set(projects.map((p) => p.project_id));
    const actions = seed.actionItems.filter((a) => ids.has(a.project_id));
    const risks = seed.risks.filter((r) => ids.has(r.project_id) && r.status === "OPEN");
    const milestones = seed.milestones.filter((m) => ids.has(m.project_id));

    return {
      customer: customer.customer_name,
      customerSlug: customer.slug,
      projectCount: projects.length,
      nextDate: milestones[0]?.date ? vagueMilestoneToLabel(milestones[0].date) : "TBD",
      renewals: seed.renewals.filter((r) => r.customer_id === customer.customer_id).length,
      openActions: actions.length,
      blockedOrTbd: projects.filter((p) => p.status === "TBD" || p.status === "BLOCKED").length,
      openRisks: risks.length,
      topStatus: projects[0]?.normalizedStatus ?? "TBD",
    };
  });

  const upcomingDates = seed.milestones.map((m) => {
    const project = projectById.get(m.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      milestone: m.title,
      date: vagueMilestoneToLabel(m.date),
      confidence: m.confidence,
      dateRaw: m.date,
    };
  });

  const renewalRows = seed.renewals.map((r) => ({
    customer: customerById.get(r.customer_id)?.customer_name ?? r.customer_id,
    renewalDate: formatDateDisplay(r.renewal_date),
    renewalDateRaw: r.renewal_date,
    status: r.normalizedStatus,
    summary: r.summary,
  }));

  const actionRows = seed.actionItems.map((a) => {
    const project = projectById.get(a.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    const site = project?.site_id ? siteById.get(project.site_id)?.site_name : "Program";
    return {
      id: a.action_item_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      site: site ?? "Program",
      owner: a.owner,
      dueDate: a.due_date ?? "TBD",
      status: a.normalizedStatus,
      priority: project?.status === "BLOCKED" ? "High" : "Medium",
      text: a.description,
    };
  });

  const keyDateRows = seed.milestones.map((m) => {
    const project = projectById.get(m.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      id: m.milestone_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      milestone: m.title,
      date: m.date,
      displayDate: vagueMilestoneToLabel(m.date),
      confidence: m.confidence,
      isVague: isVagueDate(m.date),
    };
  });

  return {
    seed,
    byCustomer,
    upcomingDates,
    renewalRows,
    actionRows,
    keyDateRows,
  };
}
