import { loadSeedData } from "@/data/cfsSeedLoader";
import { formatDateDisplay, isVagueDate, vagueMilestoneToLabel } from "@/lib/cfs/helpers";

const seed = loadSeedData();

export function getPortfolioSnapshot() {
  const projectById = new Map(seed.projects.map((p) => [p.project_id, p]));
  const customerById = new Map(seed.customers.map((c) => [c.customer_id, c]));

  const byCustomer = seed.customers.map((customer) => {
    const projects = seed.projects.filter((p) => p.customer_id === customer.customer_id);
    const ids = new Set(projects.map((p) => p.project_id));
    const actions = seed.actionItems.filter((a) => ids.has(a.project_id));
    const rmIssues = seed.rmIssues.filter((r) => ids.has(r.project_id));
    const blockers = seed.blockers.filter((b) => ids.has(b.project_id));
    const milestones = seed.milestones.filter((m) => m.project_id && ids.has(m.project_id));
    const trackerItems = seed.trackerItems.filter((t) => ids.has(t.project_id));
    const openRm = rmIssues.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus));
    const openTrackerItems = trackerItems.filter((t) => !["Complete", "Deployed", "Live"].includes(t.normalizedStatus));

    return {
      customer: customer.customer_name,
      customerSlug: customer.slug,
      projectCount: projects.length,
      nextDate: milestones[0]?.date_text ? vagueMilestoneToLabel(milestones[0].date_text) : "TBD",
      renewals: seed.renewals.filter((r) => r.customer_id === customer.customer_id).length,
      openActions: actions.length,
      blockedOrTbd: blockers.length + projects.filter((p) => p.normalizedStatus === "TBD").length,
      openRisks: blockers.length,
      openRmCount: openRm.length,
      openTrackerItems: openTrackerItems.length,
      totalTrackerItems: trackerItems.length,
      topStatus: projects[0]?.normalizedStatus ?? "TBD",
      health: blockers.length > 0 ? "At Risk" : openRm.length > 3 ? "Caution" : "On Track",
    };
  });

  const upcomingDates = seed.milestones.map((m) => {
    const project = m.project_id ? projectById.get(m.project_id) : null;
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      milestone: m.title,
      date: vagueMilestoneToLabel(m.date_text),
      confidence: m.date_confidence ?? "low",
      dateRaw: m.date_text,
    };
  });

  const renewalRows = seed.renewals.map((r) => ({
    id: r.renewal_id,
    customer: customerById.get(r.customer_id)?.customer_name ?? r.customer_id,
    type: r.renewal_type,
    renewalDate: formatDateDisplay(r.renewal_date),
    renewalDateRaw: r.renewal_date,
    confidence: r.date_confidence ?? "low",
    status: r.normalizedStatus,
    quoteNumber: r.quote_number ?? "TBD",
    summary: r.summary,
  }));

  const actionRows = seed.actionItems.map((a) => {
    const project = projectById.get(a.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      id: a.action_item_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      rmReference: "—",
      owner: a.owner,
      dueDate: a.due_date ?? "TBD",
      dueType: "Due Date",
      status: a.normalizedStatus,
      priority: a.urgency === "high" ? "High" : "Medium",
      text: a.description,
    };
  });

  const rmRows = seed.rmIssues.map((r) => {
    const project = projectById.get(r.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      id: r.rm_issue_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      rmReference: r.rm_reference,
      owner: r.owner,
      status: r.normalizedStatus,
      urgency: r.urgency ?? "normal",
      description: r.description,
    };
  });

  const blockerRows = seed.blockers.map((b) => {
    const project = projectById.get(b.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      id: b.blocker_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      severity: b.severity ?? "medium",
      description: b.description,
    };
  });

  const keyDateRows = seed.milestones.map((m) => {
    const project = m.project_id ? projectById.get(m.project_id) : null;
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      id: m.milestone_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      milestone: m.title,
      date: m.date_text,
      displayDate: vagueMilestoneToLabel(m.date_text),
      dateType: "Milestone",
      confidence: m.date_confidence ?? "low",
      isVague: isVagueDate(m.date_text),
    };
  });

  return {
    seed,
    byCustomer,
    upcomingDates,
    renewalRows,
    actionRows,
    rmRows,
    blockerRows,
    keyDateRows,
  };
}
