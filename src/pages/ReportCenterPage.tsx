import AppShell from "@/components/AppShell";
import { getCustomerOverviews, getTrackerRows, getRmDetailRows, getActionDetailRows, getKeyDateRows, getRenewalRows, getMeetingAllActions, getAllRmReferences, seed } from "@/lib/cfs/selectors2";
import { downloadCsv, exportPdf } from "@/lib/csvExport";
import { Download, FileText, Table2, Printer } from "lucide-react";

const reports = [
  {
    category: "Executive",
    items: [
      { label: "Portfolio Overview", description: "All customers with health, projects, open items, blockers, and milestones", icon: FileText,
        action: () => downloadCsv("cfs-portfolio-overview.csv", getCustomerOverviews().map((c) => ({
          Customer: c.customer_name, Health: c.health, Industry: c.industry, Region: c.region, "Account Owner": c.account_owner,
          Projects: c.projectCount, "Open Items": c.openItems, "Total Items": c.totalItems, "Complete Items": c.completeItems,
          "Open RM": c.openRm, "Total RM": c.totalRm, "Action Items": c.actionCount, Blockers: c.blockerCount,
          "Deploy Ready": c.deployReady, "Next Milestone": c.nextMilestone, Renewals: c.renewals,
        })))
      },
      { label: "Customer Health Summary", description: "Focused health-status view per customer for leadership review", icon: FileText,
        action: () => downloadCsv("cfs-customer-health.csv", getCustomerOverviews().map((c) => ({
          Customer: c.customer_name, Health: c.health, "Open Items": c.openItems, Blockers: c.blockerCount,
          "Open RM": c.openRm, "Action Items": c.actionCount, "Next Milestone": c.nextMilestone,
        })))
      },
    ],
  },
  {
    category: "Project & Initiative",
    items: [
      { label: "All Projects Detail", description: "Every project with phase, percent complete, owner, dates, and goals", icon: Table2,
        action: () => downloadCsv("cfs-projects-detail.csv", seed.projects.map((p) => {
          const customer = seed.customers.find((c) => c.customer_id === p.customer_id);
          return {
            Customer: customer?.customer_name ?? "", Project: p.project_name, Deliverable: p.deliverable ?? "",
            "Initiative Type": p.initiative_type, Phase: p.phase, "% Complete": p.percent_complete,
            Status: p.normalizedStatus, Priority: p.priority, Owner: p.owner,
            "Start Date": (p as any).start_date ?? "", "Target Date": (p as any).target_date ?? "",
            "Last Updated": (p as any).last_updated ?? "",
            Summary: p.summary, "Business Goal": (p as any).business_goal ?? "", "Technical Goal": (p as any).technical_goal ?? "",
            Dependencies: p.dependencies.join("; "), "Deployment Notes": (p as any).deployment_notes ?? "",
          };
        }))
      },
      { label: "Initiative Type Breakdown", description: "Projects grouped by initiative type for portfolio analysis", icon: Table2,
        action: () => downloadCsv("cfs-initiative-types.csv", seed.projects.map((p) => ({
          "Initiative Type": p.initiative_type, Customer: seed.customers.find((c) => c.customer_id === p.customer_id)?.customer_name ?? "",
          Project: p.project_name, Phase: p.phase, "% Complete": p.percent_complete, Owner: p.owner,
        })))
      },
    ],
  },
  {
    category: "Issue Tracker",
    items: [
      { label: "Full Issue Tracker", description: "All tracked items with priority, status, context, notes, and next steps", icon: Table2,
        action: () => downloadCsv("cfs-issue-tracker-full.csv", getTrackerRows().map((r) => ({
          Customer: r.customer_name, Project: r.project_name, Priority: r.priority, Category: r.category,
          Topic: r.topic, "RM Reference": r.rm_reference ?? "", Status: r.status,
          Context: r.context ?? "", "Last Update": r.last_update ?? "", "Target ETA": r.target_eta ?? "",
          Notes: r.notes ?? "", "Next Steps": r.next_steps ?? "", Owner: r.owner,
        })))
      },
      { label: "Open Items Only", description: "Filtered to active/open items excluding completed", icon: Table2,
        action: () => downloadCsv("cfs-open-items.csv", getTrackerRows().filter((r) => !["Complete", "Deployed", "Shipped"].includes(r.status)).map((r) => ({
          Customer: r.customer_name, Project: r.project_name, Priority: r.priority,
          Topic: r.topic, "RM Reference": r.rm_reference ?? "", Status: r.status,
          Owner: r.owner, "Last Update": r.last_update ?? "", "Next Steps": r.next_steps ?? "",
        })))
      },
    ],
  },
  {
    category: "Redmine / RM",
    items: [
      { label: "RM Issues – Full Spec Detail", description: "All RM issues with spec status, code status, testing status, and business/technical context", icon: Table2,
        action: () => downloadCsv("cfs-rm-spec-detail.csv", getRmDetailRows().map((r) => ({
          "RM Reference": r.rm_reference, Customer: r.customer_name, Project: r.project_name,
          Description: r.description, Type: (r as any).type ?? "", Severity: (r as any).severity ?? "",
          Status: r.normalizedStatus, Urgency: r.urgency ?? "", Owner: r.owner,
          "Spec Status": (r as any).spec_status ?? "", "Code Status": (r as any).code_status ?? "",
          "Testing Status": (r as any).testing_status ?? "", "Deployment Status": (r as any).deployment_status ?? "",
          "Created Date": (r as any).created_date ?? "", "Due Date": (r as any).due_date ?? "",
          "Business Context": (r as any).business_context ?? "", "Technical Context": (r as any).technical_context ?? "",
          "Key Requirements": (r as any).key_requirements ?? "", "Open Questions": (r as any).open_questions ?? "",
          Context: r.context ?? "", Notes: r.notes ?? "", "Next Steps": r.next_steps ?? "",
        })))
      },
      { label: "RM Reference List", description: "All RM numbers with customer, status, and owner for Redmine queries", icon: Table2,
        action: () => downloadCsv("cfs-rm-references.csv", getAllRmReferences().map((r) => ({
          "RM Reference": r.rm_reference, Customer: r.customer_name, Project: r.project_name,
          Description: r.description, Status: r.status, Owner: r.owner, Type: r.type,
        })))
      },
    ],
  },
  {
    category: "Action Items",
    items: [
      { label: "All Action Items", description: "Complete action item list with owner, due date, urgency, and status", icon: Table2,
        action: () => downloadCsv("cfs-action-items.csv", getActionDetailRows().map((r) => ({
          Customer: r.customer_name, Project: r.project_name, Description: r.description,
          Owner: r.owner, "Due Date": r.due_date ?? "TBD", Urgency: r.urgency ?? "normal",
          Status: r.normalizedStatus,
        })))
      },
      { label: "Meeting Action Items", description: "Action items from all meeting minutes with meeting context", icon: Table2,
        action: () => downloadCsv("cfs-meeting-actions.csv", getMeetingAllActions().map((a) => ({
          Customer: a.customer_name, Meeting: a.meeting_title, "Meeting Date": a.meeting_date,
          Action: a.description, Owner: a.owner, "Due Date": a.due_date ?? "TBD", Status: a.status,
        })))
      },
    ],
  },
  {
    category: "Dates & Renewals",
    items: [
      { label: "Key Dates / Milestones", description: "All milestones with confidence levels and past-due flags", icon: Table2,
        action: () => downloadCsv("cfs-key-dates.csv", getKeyDateRows().map((r) => ({
          Customer: r.customer, Project: r.project, Milestone: r.milestone,
          Date: r.date ?? "TBD", "Display Date": r.displayDate, Confidence: r.confidence,
          "Is Past": r.isPast ? "Yes" : "No", "Is Vague": r.isVague ? "Yes" : "No",
        })))
      },
      { label: "Software Renewals", description: "Renewal pipeline with dates, status, and quotes", icon: Table2,
        action: () => downloadCsv("cfs-renewals.csv", getRenewalRows().map((r) => ({
          Customer: r.customer, Type: r.type, Date: r.renewalDate,
          Confidence: r.confidence, Status: r.status, "Quote #": r.quoteNumber, Summary: r.summary,
        })))
      },
    ],
  },
  {
    category: "Blockers & Risks",
    items: [
      { label: "Active Blockers", description: "All blockers with severity and project context", icon: Table2,
        action: () => downloadCsv("cfs-blockers.csv", seed.blockers.map((b) => {
          const project = seed.projects.find((p) => p.project_id === b.project_id);
          const customer = project ? seed.customers.find((c) => c.customer_id === project.customer_id) : null;
          return { Customer: customer?.customer_name ?? "", Project: project?.project_name ?? "", Description: b.description, Severity: b.severity ?? "" };
        }))
      },
    ],
  },
];

export default function ReportCenterPage() {
  return (
    <AppShell title="Report & Export Center" subtitle="Download polished data exports for any view">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <Printer className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">PDF Export</h3>
            <p className="text-sm text-muted-foreground">Navigate to any page and use the PDF button in the header, or press Ctrl+P to print any view with optimized page breaks and formatting.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reports.map((group) => (
          <section key={group.category}>
            <h2 className="text-lg font-semibold text-foreground mb-3">{group.category}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {group.items.map((item) => (
                <button key={item.label} onClick={item.action} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{item.label}</h3>
                      <Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}