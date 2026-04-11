import { loadSeedData } from "@/data/cfsSeedLoader";
import { formatDateDisplay, vagueMilestoneToLabel, isVagueDate } from "@/lib/cfs/helpers";
import { normalizeDate, normalizeStatusToCanonical } from "@/lib/cfs/standards";

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
    const highlights = seed.recentHighlights.filter((h) => ids.has(h.project_id));
    const blockers = seed.blockers.filter((b) => ids.has(b.project_id));
    const milestones = seed.milestones.filter((m) => m.project_id && ids.has(m.project_id));
    const trackerItems = seed.trackerItems.filter((t) => ids.has(t.project_id));
    const openTracker = trackerItems.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status));
    const openRm = rmIssues.filter((r) => !["Complete", "Live"].includes(r.normalizedStatus));
    const deployReady = trackerItems.filter((t) => t.status === "Testing Complete").length;
    const staleRmCount = rmIssues.filter((rm) => {
      const touched = normalizeDate(rm.created_date);
      return touched ? Math.floor((Date.now() - new Date(touched).getTime()) / 86400000) > 21 : true;
    }).length;
    const lastUpdated = [...trackerItems]
      .map((item) => normalizeDate(item.last_update))
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => b.localeCompare(a))[0] ?? null;
    const blockedCount = rmIssues.filter((rm) => normalizeStatusToCanonical(rm.normalizedStatus) === "Blocked").length;
    const missingSpecCount = rmIssues.filter((rm) => !rm.spec_status || /^tbd|missing$/i.test(rm.spec_status)).length;
    const highRisk = blockedCount > 0 || staleRmCount > 2;

    return {
      customer_id: customer.customer_id,
      customer_name: customer.customer_name,
      slug: customer.slug,
      industry: customer.industry ?? "",
      region: customer.region ?? "",
      account_owner: customer.account_owner ?? "TBD",
      projectCount: projects.length,
      projects,
      openItems: openTracker.length,
      totalItems: trackerItems.length,
      completeItems: trackerItems.length - openTracker.length,
      openRm: openRm.length,
      totalRm: rmIssues.length,
      actionCount: actions.length,
      blockerCount: blockers.length,
      staleRmCount,
      deployReady,
      blockedCount,
      missingSpecCount,
      lastUpdated,
      riskIndicator: highRisk ? "High" as const : staleRmCount > 0 ? "Medium" as const : "Low" as const,
      keyHighlights: highlights.slice(0, 2).map((h) => h.highlight),
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
    const trackerMatch = seed.trackerItems.find((t) => t.rm_reference === r.rm_reference);
    return {
      ...r,
      customer_name: customer?.customer_name ?? "Unknown",
      customer_slug: customer?.slug ?? "",
      project_name: project?.project_name ?? "Unknown",
      project_status: project?.normalizedStatus ?? "TBD",
      project_owner: project?.owner ?? "Unassigned",
      context: trackerMatch?.context ?? null,
      last_update: trackerMatch?.last_update ?? null,
      target_eta: trackerMatch?.target_eta ?? null,
      notes: trackerMatch?.notes ?? null,
      next_steps: trackerMatch?.next_steps ?? null,
      priority: trackerMatch?.priority ?? null,
      category: trackerMatch?.category ?? null,
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
      category: trackerMatch?.category ?? null,
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

export function getAllRmReferences() {
  const refs: { rm_reference: string; customer_name: string; customer_slug: string; project_name: string; description: string; status: string; owner: string; urgency: string; severity: string; type: string }[] = [];
  for (const r of seed.rmIssues) {
    const project = projectById.get(r.project_id);
    const customer = project ? customerById.get(project.customer_id) : null;
    refs.push({
      rm_reference: r.rm_reference,
      customer_name: customer?.customer_name ?? "Unknown",
      customer_slug: customer?.slug ?? "",
      project_name: project?.project_name ?? "Unknown",
      description: r.description,
      status: r.normalizedStatus,
      owner: r.owner,
      urgency: r.urgency ?? "normal",
      severity: (r as any).severity ?? "Medium",
      type: (r as any).type ?? "General",
    });
  }
  // Also find RM references in tracker items that don't have dedicated RM records
  for (const t of seed.trackerItems) {
    if (t.rm_reference && !refs.some((r) => r.rm_reference === t.rm_reference)) {
      const project = projectById.get(t.project_id);
      const customer = project ? customerById.get(project.customer_id) : null;
      refs.push({
        rm_reference: t.rm_reference,
        customer_name: customer?.customer_name ?? "Unknown",
        customer_slug: customer?.slug ?? "",
        project_name: project?.project_name ?? "Unknown",
        description: t.topic,
        status: t.status,
        owner: t.owner,
        urgency: "normal",
        severity: "Medium",
        type: "Tracker Item",
      });
    }
  }
  return refs;
}

export function getProjectDetail(projectId: string) {
  const project = projectById.get(projectId);
  if (!project) return null;
  const customer = customerById.get(project.customer_id);
  const trackerItems = seed.trackerItems.filter((t) => t.project_id === projectId);
  const rmIssues = seed.rmIssues.filter((r) => r.project_id === projectId);
  const actions = seed.actionItems.filter((a) => a.project_id === projectId);
  const milestones = seed.milestones.filter((m) => m.project_id === projectId);
  const blockers = seed.blockers.filter((b) => b.project_id === projectId);
  const highlights = seed.recentHighlights.filter((h) => h.project_id === projectId);
  const resources = seed.linkedResources.filter((r) => r.project_id === projectId);
  const openTracker = trackerItems.filter((t) => !["Complete", "Deployed", "Shipped"].includes(t.status));
  return {
    project: { ...project, customer_name: customer?.customer_name ?? "Unknown", customer_slug: customer?.slug ?? "" },
    trackerItems,
    openTracker,
    rmIssues,
    actions,
    milestones,
    blockers,
    highlights,
    resources,
  };
}
