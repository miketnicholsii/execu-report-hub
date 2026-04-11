import { loadSeedData } from "@/data/cfsSeedLoader";
import { formatDateDisplay, vagueMilestoneToLabel, isVagueDate } from "@/lib/cfs/helpers";

const seed = loadSeedData();

export type TrackerRow = ReturnType<typeof getTrackerRows>[number];
export type RmDetailRow = ReturnType<typeof getRmDetailRows>[number];
export type ActionDetailRow = ReturnType<typeof getActionDetailRows>[number];
export type CustomerOverviewRow = ReturnType<typeof getCustomerOverviews>[number];

const projectById = new Map(seed.projects.map((p) => [p.project_id, p]));
const customerById = new Map(seed.customers.map((c) => [c.customer_id, c]));
const customerBySlug = new Map(seed.customers.map((c) => [c.slug, c]));

function projectCustomer(projectId: string) {
  const p = projectById.get(projectId);
  return p ? customerById.get(p.customer_id) : null;
}

export { seed, projectById, customerById, customerBySlug };

export function getCustomerOverviews() {
  return seed.customers.map((customer) => {
    const projects = seed.projects.filter((p) => p.customer_id === customer.customer_id);
    const ids = new Set(projects.map((p) => p.project_id));
    const actions = seed.actionItems.filter((a) => ids.has(a.project_id));
    const rmIssues = seed.rmIssues.filter((r) => ids.has(r.project_id));
    const blockers = seed.blockers.filter((b) => ids.has(b.project_id));
    const milestones = seed.milestones.filter((m) => m.project_id && ids.has(m.project_id));
    const trackerItems = seed.trackerItems.filter((t) => ids.has(t.project_id));
    const openTracker = trackerItems.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status));
    const openRm = rmIssues.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus));

    return {
      customer_id: customer.customer_id,
      customer_name: customer.customer_name,
      slug: customer.slug,
      projectCount: projects.length,
      projects,
      openItems: openTracker.length,
      totalItems: trackerItems.length,
      completeItems: trackerItems.length - openTracker.length,
      openRm: openRm.length,
      totalRm: rmIssues.length,
      actionCount: actions.length,
      blockerCount: blockers.length,
      nextMilestone: milestones[0]?.date_text ? vagueMilestoneToLabel(milestones[0].date_text) : "TBD",
      renewals: seed.renewals.filter((r) => r.customer_id === customer.customer_id).length,
      health: blockers.length > 0 ? "At Risk" as const : openRm.length > 3 ? "Caution" as const : "On Track" as const,
      topStatus: projects[0]?.normalizedStatus ?? "TBD",
    };
  });
}

export function getTrackerRows() {
  return seed.trackerItems.map((t) => {
    const project = projectById.get(t.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      ...t,
      customer_name: customer?.customer_name ?? "Unknown",
      customer_slug: customer?.slug ?? "",
      project_name: project?.project_name ?? "Unknown",
    };
  });
}

export function getRmDetailRows() {
  return seed.rmIssues.map((r) => {
    const project = projectById.get(r.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    // Find matching tracker item for extra spec detail
    const trackerMatch = seed.trackerItems.find((t) => t.rm_reference === r.rm_reference);
    return {
      ...r,
      customer_name: customer?.customer_name ?? "Unknown",
      customer_slug: customer?.slug ?? "",
      project_name: project?.project_name ?? "Unknown",
      project_status: project?.normalizedStatus ?? "TBD",
      project_owner: project?.owner ?? "Unassigned",
      // Spec-level detail from tracker
      context: trackerMatch?.context ?? null,
      last_update: trackerMatch?.last_update ?? null,
      target_eta: trackerMatch?.target_eta ?? null,
      notes: trackerMatch?.notes ?? null,
      next_steps: trackerMatch?.next_steps ?? null,
      priority: trackerMatch?.priority ?? null,
    };
  });
}

export function getActionDetailRows() {
  return seed.actionItems.map((a) => {
    const project = projectById.get(a.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      ...a,
      customer_name: customer?.customer_name ?? "Unknown",
      customer_slug: customer?.slug ?? "",
      project_name: project?.project_name ?? "Unknown",
    };
  });
}

export function getKeyDateRows() {
  return seed.milestones.map((m) => {
    const project = m.project_id ? projectById.get(m.project_id) : null;
    const customer = project ? customerById.get(project.customer_id) : null;
    return {
      id: m.milestone_id,
      customer: customer?.customer_name ?? "Unknown",
      project: project?.project_name ?? "Unknown",
      milestone: m.title,
      date: m.date_text,
      displayDate: vagueMilestoneToLabel(m.date_text),
      confidence: m.date_confidence ?? "low",
      isVague: isVagueDate(m.date_text),
      isPast: !isVagueDate(m.date_text) && m.date_text ? new Date(m.date_text) < new Date() : false,
    };
  });
}

export function getRenewalRows() {
  return seed.renewals.map((r) => ({
    id: r.renewal_id,
    customer: customerById.get(r.customer_id)?.customer_name ?? r.customer_id,
    customer_slug: customerById.get(r.customer_id)?.slug ?? "",
    type: r.renewal_type,
    renewalDate: formatDateDisplay(r.renewal_date),
    renewalDateRaw: r.renewal_date,
    confidence: r.date_confidence ?? "low",
    status: r.normalizedStatus,
    quoteNumber: r.quote_number ?? "TBD",
    summary: r.summary,
  }));
}

export function getCustomerDeepData(slug: string) {
  const customer = customerBySlug.get(slug);
  if (!customer) return null;

  const projects = seed.projects.filter((p) => p.customer_id === customer.customer_id);
  const ids = new Set(projects.map((p) => p.project_id));
  const actions = seed.actionItems.filter((a) => ids.has(a.project_id));
  const milestones = seed.milestones.filter((m) => m.project_id && ids.has(m.project_id));
  const rmIssues = seed.rmIssues.filter((r) => ids.has(r.project_id));
  const blockers = seed.blockers.filter((b) => ids.has(b.project_id));
  const highlights = seed.recentHighlights.filter((h) => ids.has(h.project_id));
  const trackerItems = seed.trackerItems.filter((t) => ids.has(t.project_id));
  const meetings = seed.meetingMinutes.filter((m) => m.customer_id === customer.customer_id);
  const resources = seed.linkedResources.filter((r) => r.project_id && ids.has(r.project_id));
  const openTracker = trackerItems.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status));
  const completeTracker = trackerItems.filter((t) => ["Complete", "Deployed", "Shipped"].includes(t.status));

  // RM detail with full spec info
  const rmDetail = rmIssues.map((r) => {
    const trackerMatch = trackerItems.find((t) => t.rm_reference === r.rm_reference);
    return {
      ...r,
      context: trackerMatch?.context ?? null,
      last_update: trackerMatch?.last_update ?? null,
      target_eta: trackerMatch?.target_eta ?? null,
      notes: trackerMatch?.notes ?? null,
      next_steps: trackerMatch?.next_steps ?? null,
      priority: trackerMatch?.priority ?? null,
      topic: trackerMatch?.topic ?? r.description,
    };
  });

  const health = blockers.length > 0 ? "At Risk" : rmIssues.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus)).length > 3 ? "Caution" : "On Track";

  return {
    customer,
    projects,
    actions,
    milestones,
    rmIssues,
    rmDetail,
    blockers,
    highlights,
    trackerItems,
    openTracker,
    completeTracker,
    meetings,
    resources,
    health,
  };
}

export function getMeetingAllActions() {
  return seed.meetingMinutes.flatMap((m) => {
    const customer = customerById.get(m.customer_id);
    return m.action_items_from_meeting.map((a) => ({
      ...a,
      meeting_title: m.title,
      meeting_date: m.date,
      customer_name: customer?.customer_name ?? m.customer_id,
      customer_slug: customer?.slug ?? "",
    }));
  });
}
