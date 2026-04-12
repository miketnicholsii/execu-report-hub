/**
 * useUnifiedData — single source of truth merging static seed data + Supabase DB.
 * Includes canonical entity normalization and data-quality signals.
 */
import { useMemo } from "react";
import { useSupabaseCustomers } from "./useSupabaseCustomers";
import { useSupabaseInitiatives } from "./useSupabaseInitiatives";
import { useSupabaseRmTickets } from "./useSupabaseRmTickets";
import { useSupabaseActionItems } from "./useSupabaseActionItems";
import { useSupabaseMeetings } from "./useSupabaseMeetings";
import {
  getCustomerOverviews,
  getTrackerRows,
  getRmDetailRows,
  getActionDetailRows,
  getKeyDateRows,
  getRenewalRows,
  getCustomerDeepData,
  seed,
} from "@/lib/cfs/selectors2";
import {
  actionConfidence,
  canonicalCustomerName,
  customerAliasesForCanonical,
  extractRmReferencesFromText,
  fingerprintAction,
  normalizeInitiativeTitle,
} from "@/lib/canonicalization";

function daysSince(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function agingFlag(days: number | null): string | null {
  if (days === null) return null;
  if (days > 30) return "Stale";
  if (days > 21) return "Aging";
  if (days > 14) return "Needs Attention";
  return null;
}

export interface UnifiedRmTicket {
  id: string;
  rm_number: string;
  title: string;
  customer_name: string;
  customer_slug: string;
  customer_id: string | null;
  status: string;
  owner: string;
  summary: string;
  last_update: string | null;
  due_date: string | null;
  next_steps: string;
  open_questions: string;
  dependencies: string;
  days_since_update: number | null;
  overdue: boolean;
  flags: string[];
  source: "db" | "static";
  spec_status?: string | null;
  code_status?: string | null;
  testing_status?: string | null;
  deployment_status?: string | null;
  created_date?: string | null;
  severity?: string | null;
  type?: string | null;
  urgency?: string | null;
  priority?: string | null;
  category?: string | null;
  context?: string | null;
  notes?: string | null;
  business_context?: string | null;
  technical_context?: string | null;
  key_requirements?: string | null;
}

export interface UnifiedActionItem {
  id: string;
  title: string;
  description: string;
  reason: string;
  sourceContext: string;
  owner: string;
  due_date: string | null;
  status: string;
  priority: string;
  source: "db" | "meeting" | "file" | "static" | "manual";
  linkedRmNumbers: string[];
  linkedInitiative: string | null;
  confidence: number;
  created_at?: string;
  updated_at?: string;
  customer_name: string;
  customer_slug: string;
  customer_aliases: string[];
  customer_id: string | null;
  from_db: boolean;
}

export interface UnifiedCustomer {
  id: string;
  customer_name: string;
  aliases: string[];
  slug: string;
  health: string;
  status: string;
  owner: string | null;
  notes: string | null;
  initiativeCount: number;
  totalRmTickets: number;
  openRmTickets: number;
  staleRmTickets: number;
  totalActionItems: number;
  openActionItems: number;
  blockerCount: number;
  riskLevel: "High" | "Medium" | "Low";
  source: "db" | "static" | "both";
}

export interface UnifiedInitiative {
  id: string;
  title: string;
  normalized_title: string;
  customer_id: string | null;
  customer_name: string;
  customer_slug: string;
  rm_number: string | null;
  status: string;
  health: string;
  priority: string;
  owner: string | null;
  due_date: string | null;
  description: string | null;
  next_step: string | null;
  open_question: string | null;
  source: "db" | "static";
}

export interface UnifiedDataQuality {
  score: number;
  missingRmOwners: number;
  missingActionOwners: number;
  staleOpenRm: number;
  overdueOpenActions: number;
  orphanedRmCustomers: number;
  orphanedActionCustomers: number;
  upcomingDueIn14Days: number;
}

const CLOSED_STATUSES = ["Complete", "Deployed", "Closed", "Live", "Shipped"];

export function useUnifiedData() {
  const { customers: dbCustomers, addCustomer, updateCustomer } = useSupabaseCustomers();
  const { initiatives: dbInitiatives, addInitiative, updateInitiative } = useSupabaseInitiatives();
  const { tickets: dbTickets, addTicket, updateTicket, deleteTicket, bulkUpsert, isLoading: rmLoading } = useSupabaseRmTickets();
  const { actionItems: dbActions, addActionItem, updateActionItem, deleteActionItem, bulkAdd: bulkAddActions, isLoading: actionsLoading } = useSupabaseActionItems();
  const { meetings: dbMeetings, meetingActions, addMeeting, deleteMeeting, isLoading: meetingsLoading } = useSupabaseMeetings();

  const staticCustomerOverviews = useMemo(() => { try { return getCustomerOverviews(); } catch { return []; } }, []);
  const staticRmRows = useMemo(() => { try { return getRmDetailRows(); } catch { return []; } }, []);
  const staticActionRows = useMemo(() => { try { return getActionDetailRows(); } catch { return []; } }, []);
  const keyDates = useMemo(() => { try { return getKeyDateRows(); } catch { return []; } }, []);
  const renewals = useMemo(() => { try { return getRenewalRows(); } catch { return []; } }, []);
  const staticTrackerRows = useMemo(() => { try { return getTrackerRows(); } catch { return []; } }, []);

  const rmTickets: UnifiedRmTicket[] = useMemo(() => {
    const dbCustMap = new Map(dbCustomers.map(c => [c.id, c]));
    const dbRmSet = new Set(dbTickets.map(t => t.rm_number));

    const fromDb: UnifiedRmTicket[] = dbTickets.map(t => {
      const cust = t.customer_id ? dbCustMap.get(t.customer_id) : null;
      const customer_name = canonicalCustomerName(cust?.customer_name || "Unknown");
      const days = daysSince(t.last_update);
      const flag = agingFlag(days);
      const overdue = t.due_date ? new Date(t.due_date) < new Date() && !CLOSED_STATUSES.includes(t.status) : false;
      const flags: string[] = [];
      if (flag) flags.push(flag);
      if (overdue) flags.push("Overdue");
      if (!t.owner) flags.push("Missing Owner");
      if (t.status === "Blocked" || t.status === "Waiting on Customer") flags.push("Blocked");

      return {
        id: t.id,
        rm_number: t.rm_number,
        title: t.title || "",
        customer_name,
        customer_slug: customer_name === "Unknown" ? "" : customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        customer_id: t.customer_id,
        status: t.status,
        owner: t.owner || "Unassigned",
        summary: t.summary || "",
        last_update: t.last_update,
        due_date: t.due_date,
        next_steps: t.next_steps || "",
        open_questions: t.open_questions || "",
        dependencies: t.dependencies || "",
        days_since_update: days,
        overdue,
        flags,
        source: "db" as const,
      };
    });

    const fromStatic: UnifiedRmTicket[] = staticRmRows
      .filter(sr => !dbRmSet.has(sr.rm_reference))
      .map(sr => {
        const customer_name = canonicalCustomerName(sr.customer_name);
        const days = daysSince(sr.last_update);
        const flag = agingFlag(days);
        const flags: string[] = [...(sr.derived_flags as string[])];
        if (flag && !flags.includes(flag)) flags.push(flag);

        return {
          id: sr.rm_issue_id,
          rm_number: sr.rm_reference,
          title: sr.description,
          customer_name,
          customer_slug: customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          customer_id: null,
          status: sr.canonical_status,
          owner: sr.owner,
          summary: sr.context || "",
          last_update: sr.last_update || null,
          due_date: sr.target_eta || null,
          next_steps: sr.next_steps || "",
          open_questions: "",
          dependencies: "",
          days_since_update: days,
          overdue: false,
          flags,
          source: "static" as const,
          spec_status: (sr as any).spec_status ?? null,
          code_status: (sr as any).code_status ?? null,
          testing_status: (sr as any).testing_status ?? null,
          deployment_status: (sr as any).deployment_status ?? null,
          created_date: (sr as any).created_date ?? null,
          severity: (sr as any).severity ?? null,
          type: (sr as any).type ?? null,
          urgency: (sr as any).urgency ?? null,
          priority: sr.priority ?? null,
          category: sr.category ?? null,
          context: sr.context ?? null,
          notes: sr.notes ?? null,
          business_context: (sr as any).business_context ?? null,
          technical_context: (sr as any).technical_context ?? null,
          key_requirements: (sr as any).key_requirements ?? null,
        };
      });

    return [...fromDb, ...fromStatic];
  }, [dbTickets, dbCustomers, staticRmRows]);

  const actionItems: UnifiedActionItem[] = useMemo(() => {
    const dbCustMap = new Map(dbCustomers.map(c => [c.id, c]));

    const fromDb: UnifiedActionItem[] = dbActions.map(a => {
      const customer_name = canonicalCustomerName(a.customer_id ? dbCustMap.get(a.customer_id)?.customer_name || "Unknown" : "Unknown");
      const owner = a.owner || "Unassigned";
      const linkedRmNumbers = extractRmReferencesFromText(a.title, a.description, a.source_id);
      return {
        id: a.id,
        title: a.title,
        description: a.description || "",
        reason: a.source ? `Persisted ${a.source} action requiring execution tracking.` : "Manual action entered by an operator.",
        sourceContext: a.description || a.title,
        owner,
        due_date: a.due_date,
        status: a.status,
        priority: a.priority,
        source: "db",
        linkedRmNumbers,
        linkedInitiative: null,
        confidence: actionConfidence("db", Boolean(a.due_date), owner !== "Unassigned", linkedRmNumbers.length),
        created_at: a.created_at,
        updated_at: a.updated_at,
        customer_name,
        customer_slug: customer_name === "Unknown" ? "" : customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        customer_aliases: customerAliasesForCanonical(customer_name),
        customer_id: a.customer_id,
        from_db: true,
      };
    });

    const dbFingerprints = new Set(fromDb.map(item => fingerprintAction(item.title, item.customer_name, item.owner)));
    const fromStatic: UnifiedActionItem[] = staticActionRows
      .filter(s => !dbFingerprints.has(fingerprintAction(s.description, s.customer_name, s.owner ?? "Unassigned")))
      .map(s => {
        const customer_name = canonicalCustomerName(s.customer_name);
        const owner = s.owner || "Unassigned";
        const linkedRmNumbers = extractRmReferencesFromText(s.description, s.notes, s.context, s.linked_rm_reference);
        return {
          id: s.action_item_id,
          title: s.description,
          description: s.description,
          reason: s.trigger_reason || "Inferred from tracker context and follow-up language.",
          sourceContext: [s.context, s.notes, s.source_file, s.source_sheet].filter(Boolean).join(" · "),
          owner,
          due_date: s.due_date || null,
          status: s.normalizedStatus,
          priority: s.urgency === "high" ? "High" : s.urgency === "medium" ? "Medium" : "Low",
          source: "static",
          linkedRmNumbers,
          linkedInitiative: normalizeInitiativeTitle(s.project_name),
          confidence: actionConfidence("file", Boolean(s.due_date), owner !== "Unassigned", linkedRmNumbers.length),
          customer_name,
          customer_slug: customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          customer_aliases: customerAliasesForCanonical(customer_name),
          customer_id: null,
          from_db: false,
        };
      });

    const deduped = new Map<string, UnifiedActionItem>();
    [...fromDb, ...fromStatic].forEach((item) => {
      const fp = fingerprintAction(item.title, item.customer_name, item.owner);
      if (!deduped.has(fp) || (item.from_db && !deduped.get(fp)?.from_db)) deduped.set(fp, item);
    });

    return Array.from(deduped.values());
  }, [dbActions, dbCustomers, staticActionRows]);

  const initiatives: UnifiedInitiative[] = useMemo(() => {
    const dbCustMap = new Map(dbCustomers.map(c => [c.id, c]));

    const fromDb: UnifiedInitiative[] = dbInitiatives.map(i => {
      const customer_name = canonicalCustomerName(i.customer_id ? dbCustMap.get(i.customer_id)?.customer_name || "Unknown" : "Unknown");
      return {
        id: i.id,
        title: i.title,
        normalized_title: normalizeInitiativeTitle(i.title),
        customer_id: i.customer_id,
        customer_name,
        customer_slug: customer_name === "Unknown" ? "" : customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        rm_number: i.rm_number,
        status: i.status,
        health: i.health,
        priority: i.priority,
        owner: i.owner,
        due_date: i.due_date,
        description: i.description,
        next_step: i.next_step,
        open_question: i.open_question,
        source: "db" as const,
      };
    });

    const dbTitles = new Set(fromDb.map(d => d.normalized_title.toLowerCase()));
    const staticProjects = seed.projects || [];
    const fromStatic: UnifiedInitiative[] = staticProjects
      .filter(p => !dbTitles.has(normalizeInitiativeTitle(p.project_name).toLowerCase()))
      .map(p => {
        const cust = seed.customers.find(c => c.customer_id === p.customer_id);
        const customer_name = canonicalCustomerName(cust?.customer_name || "Unknown");
        return {
          id: p.project_id,
          title: p.project_name,
          normalized_title: normalizeInitiativeTitle(p.project_name),
          customer_id: null,
          customer_name,
          customer_slug: customer_name === "Unknown" ? "" : customer_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          rm_number: null,
          status: p.normalizedStatus,
          health: "Healthy",
          priority: p.priority,
          owner: p.owner,
          due_date: (p as any).target_date || null,
          description: p.summary,
          next_step: null,
          open_question: null,
          source: "static" as const,
        };
      });

    return [...fromDb, ...fromStatic];
  }, [dbInitiatives, dbCustomers]);

  const customers: UnifiedCustomer[] = useMemo(() => {
    const dbByName = new Map(dbCustomers.map(c => [canonicalCustomerName(c.customer_name).toLowerCase(), c]));
    const staticByName = new Map(staticCustomerOverviews.map(c => [canonicalCustomerName(c.customer_name).toLowerCase(), c]));
    const allNames = new Set([...dbByName.keys(), ...staticByName.keys()]);

    return Array.from(allNames).map(nameKey => {
      const db = dbByName.get(nameKey);
      const st = staticByName.get(nameKey);
      const canonicalName = canonicalCustomerName(db?.customer_name || st?.customer_name || nameKey);
      const slug = db?.slug || st?.slug || canonicalName.replace(/\s+/g, "-").toLowerCase();
      const id = db?.id || st?.customer_id || slug;

      const custRms = rmTickets.filter(r => canonicalCustomerName(r.customer_name).toLowerCase() === nameKey || (r.customer_id && db && r.customer_id === db.id));
      const custActions = actionItems.filter(a => canonicalCustomerName(a.customer_name).toLowerCase() === nameKey || (a.customer_id && db && a.customer_id === db.id));
      const custInitiatives = initiatives.filter(i => canonicalCustomerName(i.customer_name).toLowerCase() === nameKey || (i.customer_id && db && i.customer_id === db.id));
      const openRms = custRms.filter(r => !CLOSED_STATUSES.includes(r.status));
      const staleRms = custRms.filter(r => r.flags.includes("Stale") || r.flags.includes("Aging"));
      const blockers = custRms.filter(r => r.flags.includes("Blocked"));
      const openActions = custActions.filter(a => !["Complete", "Done"].includes(a.status));

      const blockerCount = (st?.blockerCount || 0) + blockers.length;
      const health = db?.health || st?.health || (blockerCount > 0 ? "At Risk" : openRms.length > 3 ? "Caution" : "Healthy");

      return {
        id,
        customer_name: canonicalName,
        aliases: customerAliasesForCanonical(canonicalName),
        slug,
        health,
        status: db?.status || "Active",
        owner: db?.owner || st?.account_owner || null,
        notes: db?.notes || null,
        initiativeCount: custInitiatives.length,
        totalRmTickets: custRms.length,
        openRmTickets: openRms.length,
        staleRmTickets: staleRms.length,
        totalActionItems: custActions.length,
        openActionItems: openActions.length,
        blockerCount,
        riskLevel: blockerCount > 0 ? "High" as const : staleRms.length > 2 ? "Medium" as const : "Low" as const,
        source: db && st ? "both" as const : db ? "db" as const : "static" as const,
      };
    }).sort((a, b) => a.customer_name.localeCompare(b.customer_name));
  }, [dbCustomers, staticCustomerOverviews, rmTickets, actionItems, initiatives]);

  const kpis = useMemo(() => {
    const totalCustomers = customers.length;
    const totalInitiatives = initiatives.length;
    const totalRm = rmTickets.length;
    const openRm = rmTickets.filter(r => !CLOSED_STATUSES.includes(r.status)).length;
    const staleRm = rmTickets.filter(r => r.flags.includes("Stale") || r.flags.includes("Aging")).length;
    const blockedRm = rmTickets.filter(r => r.flags.includes("Blocked")).length;
    const totalActions = actionItems.length;
    const openActions = actionItems.filter(a => !["Complete", "Done"].includes(a.status)).length;
    const highPriorityActions = actionItems.filter(a => a.priority === "High" && !["Complete", "Done"].includes(a.status)).length;
    const overdueActions = actionItems.filter(a => a.due_date && new Date(a.due_date) < new Date() && !["Complete", "Done"].includes(a.status)).length;
    const atRiskCustomers = customers.filter(c => c.health === "At Risk").length;
    const cautionCustomers = customers.filter(c => c.health === "Caution").length;
    const totalMeetings = dbMeetings.length + (seed.meetingMinutes?.length || 0);
    const totalKeyDates = keyDates.length;
    const totalRenewals = renewals.length;

    return {
      totalCustomers, totalInitiatives, totalRm, openRm, staleRm, blockedRm,
      totalActions, openActions, highPriorityActions, overdueActions,
      atRiskCustomers, cautionCustomers, totalMeetings, totalKeyDates, totalRenewals,
    };
  }, [customers, initiatives, rmTickets, actionItems, dbMeetings, keyDates, renewals]);

  const dataQuality: UnifiedDataQuality = useMemo(() => {
    const openRm = rmTickets.filter(r => !CLOSED_STATUSES.includes(r.status));
    const openActions = actionItems.filter(a => !["Complete", "Done"].includes(a.status));
    const now = Date.now();
    const in14Days = now + 14 * 86400000;

    const missingRmOwners = openRm.filter(r => !r.owner || r.owner === "Unassigned").length;
    const missingActionOwners = openActions.filter(a => !a.owner || a.owner.trim().length === 0 || a.owner === "Unassigned").length;
    const staleOpenRm = openRm.filter(r => (r.days_since_update ?? 0) > 21).length;
    const overdueOpenActions = openActions.filter(a => {
      const due = Date.parse(a.due_date ?? "");
      return Number.isFinite(due) && due < now;
    }).length;
    const orphanedRmCustomers = openRm.filter(r => r.customer_name === "Unknown").length;
    const orphanedActionCustomers = openActions.filter(a => a.customer_name === "Unknown").length;
    const upcomingDueIn14Days = openActions.filter(a => {
      const due = Date.parse(a.due_date ?? "");
      return Number.isFinite(due) && due >= now && due <= in14Days;
    }).length;

    const penalty = missingRmOwners * 4 + missingActionOwners * 3 + staleOpenRm * 2 + overdueOpenActions * 2 + orphanedRmCustomers * 3 + orphanedActionCustomers * 3;
    const score = Math.max(0, Math.min(100, 100 - penalty));

    return {
      score,
      missingRmOwners,
      missingActionOwners,
      staleOpenRm,
      overdueOpenActions,
      orphanedRmCustomers,
      orphanedActionCustomers,
      upcomingDueIn14Days,
    };
  }, [rmTickets, actionItems]);

  function getCustomerData(slug: string) {
    const cust = customers.find(c => c.slug === slug);
    if (!cust) return null;
    const nameKey = canonicalCustomerName(cust.customer_name).toLowerCase();

    const custRms = rmTickets.filter(r => canonicalCustomerName(r.customer_name).toLowerCase() === nameKey || (r.customer_id && r.customer_id === cust.id));
    const custActions = actionItems.filter(a => canonicalCustomerName(a.customer_name).toLowerCase() === nameKey || (a.customer_id && a.customer_id === cust.id));
    const custInitiatives = initiatives.filter(i => canonicalCustomerName(i.customer_name).toLowerCase() === nameKey || (i.customer_id && i.customer_id === cust.id));
    const custMeetings = dbMeetings.filter(m => {
      const dbCust = dbCustomers.find(c => canonicalCustomerName(c.customer_name).toLowerCase() === nameKey);
      return dbCust && m.customer_id === dbCust.id;
    });
    const custMeetingActions = meetingActions.filter(a => custMeetings.some(m => m.id === a.meeting_id));

    const staticDeep = getCustomerDeepData(slug);
    const staticMeetings = staticDeep?.meetings || [];

    return {
      customer: cust,
      initiatives: custInitiatives,
      rmTickets: custRms,
      actionItems: custActions,
      meetings: custMeetings,
      meetingActions: custMeetingActions,
      staticDeep,
      staticMeetings,
    };
  }

  return {
    customers,
    initiatives,
    rmTickets,
    actionItems,
    kpis,
    dataQuality,
    keyDates,
    renewals,
    staticTrackerRows,
    meetings: dbMeetings,
    meetingActions,
    getCustomerData,
    addCustomer, updateCustomer,
    addInitiative, updateInitiative,
    addTicket, updateTicket, deleteTicket, bulkUpsert,
    addActionItem, updateActionItem, deleteActionItem, bulkAddActions,
    addMeeting, deleteMeeting,
    isLoading: rmLoading || actionsLoading || meetingsLoading,
    seed,
  };
}
