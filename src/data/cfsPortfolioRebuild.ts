export type PortfolioStatus =
  | "Planning"
  | "Research"
  | "In Spec"
  | "In Review"
  | "Development"
  | "Testing"
  | "Ready to Deploy"
  | "Scheduled"
  | "Live"
  | "Post-Implementation"
  | "On Hold"
  | "Blocked"
  | "Complete"
  | "TBD";

export type HealthIndicator = "Green" | "Yellow" | "Red";
export type DateConfidence = "Confirmed" | "Tentative" | "TBD";

export interface CustomerEntity {
  customer_id: string;
  customer_name: string;
  account_owner: string | null;
  summary_status: PortfolioStatus;
  notes: string;
}

export interface CustomerSiteEntity {
  site_id: string;
  customer_id: string;
  site_name: string;
  location: string | null;
  notes: string;
}

export interface ProjectEntity {
  project_id: string;
  customer_id: string;
  site_id: string | null;
  project_name: string;
  deliverable_name: string;
  phase: string;
  status: PortfolioStatus;
  summary: string;
  notes: string;
  priority: "High" | "Medium" | "Low" | "TBD";
  source_reference: string;
  last_updated: string;
  owner: string | null;
  health: HealthIndicator;
}

export interface MilestoneEntity {
  milestone_id: string;
  project_id: string;
  milestone_name: string;
  milestone_date: string;
  date_confidence: DateConfidence;
  owner: string | null;
  notes: string;
}

export interface ActionEntity {
  action_id: string;
  project_id: string;
  action_text: string;
  owner: string | null;
  due_date: string;
  status: PortfolioStatus;
  priority: "High" | "Medium" | "Low" | "TBD";
  blocker: string | null;
  notes: string;
}

export interface RiskEntity {
  risk_id: string;
  project_id: string;
  risk_text: string;
  severity: "High" | "Medium" | "Low";
  owner: string | null;
  mitigation: string;
  status: "Open" | "Monitoring" | "Closed";
}

export interface RenewalEntity {
  renewal_id: string;
  customer_id: string;
  renewal_type: string;
  renewal_date: string;
  status: PortfolioStatus;
  notes: string;
}

export interface LinkedResourceEntity {
  resource_id: string;
  project_id: string;
  resource_label: string;
  resource_type: string;
  resource_url: string | null;
  notes: string;
}

export interface StatusHistoryEntity {
  status_history_id: string;
  project_id: string;
  status: PortfolioStatus;
  status_date: string;
  notes: string;
}

export const customers: CustomerEntity[] = [
  { customer_id: "cust-marjac-gainesville", customer_name: "MarJac Gainesville", account_owner: "MN", summary_status: "Testing", notes: "Phase II & III and S9 workstreams are active." },
  { customer_id: "cust-braswell", customer_name: "Braswell", account_owner: "WJ", summary_status: "Testing", notes: "Shipping and label defect testing remains active." },
  { customer_id: "cust-gold-creek", customer_name: "Gold Creek", account_owner: null, summary_status: "Planning", notes: "BarTender and S9 quote activities are in planning." },
  { customer_id: "cust-wayne-sanderson", customer_name: "Wayne-Sanderson Farms", account_owner: null, summary_status: "Testing", notes: "M3 merger rollout planning and SIT testing are active." },
  { customer_id: "cust-vpgc", customer_name: "VPGC", account_owner: null, summary_status: "Planning", notes: "S9 planning is active with interface and quote updates pending." },
  { customer_id: "cust-case-farms", customer_name: "Case Farms", account_owner: "WJ", summary_status: "Scheduled", notes: "Multiple sites are running parallel S9 and zone-install workstreams." },
  { customer_id: "cust-us-cold-storage", customer_name: "US Cold Storage", account_owner: "MN", summary_status: "Planning", notes: "RoboScan target window is November 2026." },
  { customer_id: "cust-all-american-pet-protein", customer_name: "All American Pet Protein", account_owner: null, summary_status: "In Review", notes: "Software maintenance renewal is in commercial review." },
  { customer_id: "cust-banks-cold-storage", customer_name: "Banks Cold Storage", account_owner: "MN", summary_status: "Blocked", notes: "High-priority ASN mismatch is waiting on CFS hotfix." },
  { customer_id: "cust-tip-top", customer_name: "Tip Top", account_owner: "MN", summary_status: "In Spec", notes: "COA and inventory cleanup items are active." },
  { customer_id: "cust-randolph-harpleys", customer_name: "Randolph Packing / Harpley’s", account_owner: null, summary_status: "Research", notes: "Hardware-assessment quote sent; restart plan still needed." },
  { customer_id: "cust-farbest-foods", customer_name: "Farbest Foods", account_owner: "WJ", summary_status: "Planning", notes: "Training and upgrade scope definition remain in planning." },
  { customer_id: "cust-consolidated-catfish", customer_name: "Consolidated Catfish", account_owner: "WJ", summary_status: "Post-Implementation", notes: "Post-go-live patches and interface follow-up remain active." },
  { customer_id: "cust-marjac-phase23", customer_name: "MarJac – Phase II & III", account_owner: "MN", summary_status: "Testing", notes: "RoboScan install and interface validation are in testing." },
];

export const customer_sites: CustomerSiteEntity[] = [
  { site_id: "site-marjac-gainesville", customer_id: "cust-marjac-gainesville", site_name: "Gainesville", location: null, notes: "Primary MarJac program location." },
  { site_id: "site-wayne-laurel", customer_id: "cust-wayne-sanderson", site_name: "Laurel", location: null, notes: "Laurel plant milestones included in merger plan." },
  { site_id: "site-case-morganton", customer_id: "cust-case-farms", site_name: "Morganton", location: null, notes: "Zone install under Quote #17609A." },
  { site_id: "site-case-winesburg", customer_id: "cust-case-farms", site_name: "Winesburg", location: null, notes: "S9 upgrade and zone install under separate workstreams." },
  { site_id: "site-case-farmerville", customer_id: "cust-case-farms", site_name: "Farmerville", location: null, notes: "S9 go-live completed; stabilization activities remain." },
];

export const projects: ProjectEntity[] = [
  { project_id: "prj-braswell-s9", customer_id: "cust-braswell", site_id: null, project_name: "S9 Upgrade", deliverable_name: "Shipping Workflow Validation", phase: "Go-Live", status: "Testing", summary: "Secondary label and cancel/reprint defects are in active testing.", notes: "Preserve RM-13634 and RM-13421 priority handling.", priority: "High", source_reference: "Braswell Open Items + executive tracker", last_updated: "2026-04-10", owner: "WJ", health: "Yellow" },
  { project_id: "prj-marjac-phase23", customer_id: "cust-marjac-phase23", site_id: "site-marjac-gainesville", project_name: "Phase II & III", deliverable_name: "RoboScan Install and Interfaces", phase: "Development / Testing", status: "Testing", summary: "Onsite testing completed; checklist and follow-up tasks remain WIP.", notes: "Workstreams include RoboScan and interface validation.", priority: "High", source_reference: "Executive tracker upcoming dates and project portfolio", last_updated: "2026-04-10", owner: "MN", health: "Yellow" },
  { project_id: "prj-marjac-s9", customer_id: "cust-marjac-gainesville", site_id: "site-marjac-gainesville", project_name: "S9 Upgrade", deliverable_name: "Upgrade Scope and Timeline", phase: "Planning", status: "Planning", summary: "Custom scope review is active; schedule remains unconfirmed.", notes: "No confirmed implementation date in source.", priority: "Medium", source_reference: "Project Team Key Deliverables", last_updated: "2026-04-10", owner: "MN", health: "Yellow" },
  { project_id: "prj-gold-creek-slc", customer_id: "cust-gold-creek", site_id: null, project_name: "SLC Product Setup", deliverable_name: "Label Design and BarTender Training", phase: "Design", status: "Planning", summary: "BarTender scope and S9 quote planning are in progress.", notes: "Quote 17578 and BarTender training reference retained.", priority: "Medium", source_reference: "Executive tracker portfolio and upcoming dates", last_updated: "2026-04-10", owner: null, health: "Yellow" },
  { project_id: "prj-wayne-m3", customer_id: "cust-wayne-sanderson", site_id: "site-wayne-laurel", project_name: "M3 Merger", deliverable_name: "SIT 3 Testing and Rollout", phase: "SIT 3 Testing", status: "Testing", summary: "Issue closure and phased plant rollout planning are active.", notes: "Multi-site schedule remains in progress.", priority: "High", source_reference: "Wayne-Sanderson schedule rows", last_updated: "2026-04-10", owner: null, health: "Yellow" },
  { project_id: "prj-vpgc-s9", customer_id: "cust-vpgc", site_id: null, project_name: "S9 Upgrade", deliverable_name: "PT Usage and Interface Updates", phase: "Planning", status: "Planning", summary: "PT usage confirmation and quote/interface updates are pending.", notes: "Training topic marked inaccurate inventory in source.", priority: "Medium", source_reference: "VPGC initiative and upcoming dates", last_updated: "2026-04-10", owner: null, health: "Yellow" },
  { project_id: "prj-case-winesburg-s9", customer_id: "cust-case-farms", site_id: "site-case-winesburg", project_name: "S9 Upgrade", deliverable_name: "Order Updates Patch", phase: "Planning", status: "Ready to Deploy", summary: "Testing is complete; production deployment window is pending.", notes: "RM-13987 retained from open items.", priority: "High", source_reference: "Case Farms Open + executive summary", last_updated: "2026-04-10", owner: "WJ", health: "Yellow" },
  { project_id: "prj-case-farmerville-s9", customer_id: "cust-case-farms", site_id: "site-case-farmerville", project_name: "S9 Go-Live", deliverable_name: "Post-Go-Live Stabilization", phase: "Live", status: "Live", summary: "Site is live with a remaining order update dependency.", notes: "Patch dependency shared with Winesburg.", priority: "Medium", source_reference: "Case Farms portfolio notes", last_updated: "2026-04-10", owner: "WJ", health: "Yellow" },
  { project_id: "prj-case-morganton-zone", customer_id: "cust-case-farms", site_id: "site-case-morganton", project_name: "Zone Install", deliverable_name: "Morganton Zone Install", phase: "Implementation", status: "Scheduled", summary: "Install is approved and queued pending customer maintenance window.", notes: "Quote #17609A retained.", priority: "High", source_reference: "Case Farms pending deployment", last_updated: "2026-04-10", owner: "MN", health: "Yellow" },
  { project_id: "prj-case-winesburg-zone", customer_id: "cust-case-farms", site_id: "site-case-winesburg", project_name: "Zone Install", deliverable_name: "Winesburg Travel / Install / Go-Live", phase: "Implementation", status: "Scheduled", summary: "Travel, install, and go-live sequence is defined.", notes: "Quote #17608A and VRT orientation issue retained.", priority: "High", source_reference: "Case Farms zone install schedule", last_updated: "2026-04-10", owner: "MN", health: "Yellow" },
  { project_id: "prj-uscold-roboscan", customer_id: "cust-us-cold-storage", site_id: null, project_name: "RoboScan", deliverable_name: "Implementation Planning", phase: "Planning", status: "TBD", summary: "Target month is November 2026; exact date is unconfirmed.", notes: "Date remains tentative by source.", priority: "Medium", source_reference: "Executive tracker upcoming dates", last_updated: "2026-04-10", owner: "MN", health: "Yellow" },
  { project_id: "prj-banks-asn", customer_id: "cust-banks-cold-storage", site_id: null, project_name: "Inbound ASN", deliverable_name: "Lot Attribute Hotfix", phase: "Open Issue", status: "Blocked", summary: "Customer release is blocked until CFS delivers hotfix.", notes: "RM-14002 retained.", priority: "High", source_reference: "Banks issue tracker", last_updated: "2026-04-10", owner: "MN", health: "Red" },
  { project_id: "prj-tiptop-coa", customer_id: "cust-tip-top", site_id: null, project_name: "COA and Data Cleanup", deliverable_name: "Q6 and Inventory Readiness", phase: "Specification", status: "In Spec", summary: "COA validation and inventory cleanup remain active.", notes: "WIP and In-Spec wording preserved.", priority: "Medium", source_reference: "Tip Top PM Notes", last_updated: "2026-04-10", owner: "MN", health: "Yellow" },
  { project_id: "prj-randolph-upgrade", customer_id: "cust-randolph-harpleys", site_id: null, project_name: "System Upgrade", deliverable_name: "Hardware Assessment and Restart Plan", phase: "Research", status: "Research", summary: "Hardware assessment quote has been sent; restart timeline is not finalized.", notes: "Harpley’s naming retained for commercial continuity.", priority: "Medium", source_reference: "Randolph / Harpley’s PM notes", last_updated: "2026-04-10", owner: null, health: "Yellow" },
  { project_id: "prj-farbest-s9", customer_id: "cust-farbest-foods", site_id: null, project_name: "S9 Upgrade", deliverable_name: "Scope and Timeline Definition", phase: "Planning", status: "Planning", summary: "Training and scope definition remain in discovery.", notes: "RM 13656 and training request retained.", priority: "Medium", source_reference: "Farbest notes and PDF row 31", last_updated: "2026-04-10", owner: "WJ", health: "Yellow" },
  { project_id: "prj-catfish-post", customer_id: "cust-consolidated-catfish", site_id: null, project_name: "S9 Post Implementation", deliverable_name: "Patch Scheduling and Deployments", phase: "Post Implementation", status: "Post-Implementation", summary: "Follow-up patches and interface retry logic remain active.", notes: "Recent deployment and RM-14110 retained.", priority: "Medium", source_reference: "Consolidated Catfish issue tracker", last_updated: "2026-04-10", owner: "WJ", health: "Yellow" },
];

export const milestones: MilestoneEntity[] = [
  { milestone_id: "ms-braswell-window", project_id: "prj-braswell-s9", milestone_name: "S9 Go-Live Window", milestone_date: "Mid to Late April 2026", date_confidence: "Tentative", owner: "WJ", notes: "Shipping-focused validation is still active." },
  { milestone_id: "ms-marjac-phase23-golive", project_id: "prj-marjac-phase23", milestone_name: "Phase II & III Estimated Go-Live", milestone_date: "Week of 2026-04-06", date_confidence: "Tentative", owner: "MN", notes: "Preserved as week-of descriptor from source." },
  { milestone_id: "ms-marjac-phase23-test", project_id: "prj-marjac-phase23", milestone_name: "Additional Testing", milestone_date: "TBD", date_confidence: "TBD", owner: "MN", notes: "Follow-up testing date not confirmed." },
  { milestone_id: "ms-wayne-laurel-training", project_id: "prj-wayne-m3", milestone_name: "Laurel Onsite Training", milestone_date: "2026-05-11", date_confidence: "Confirmed", owner: null, notes: "Go-live planned for late May." },
  { milestone_id: "ms-wayne-laurel-golive", project_id: "prj-wayne-m3", milestone_name: "Laurel Go-Live", milestone_date: "2026-05-25", date_confidence: "Confirmed", owner: null, notes: "Source includes onsite end date alignment." },
  { milestone_id: "ms-case-morganton-install", project_id: "prj-case-morganton-zone", milestone_name: "Zone Install", milestone_date: "2026-06-01", date_confidence: "Confirmed", owner: "MN", notes: "Quote #17609A." },
  { milestone_id: "ms-case-winesburg-travel", project_id: "prj-case-winesburg-zone", milestone_name: "Travel", milestone_date: "2026-04-15", date_confidence: "Confirmed", owner: "MN", notes: "Quote #17608A." },
  { milestone_id: "ms-case-winesburg-install", project_id: "prj-case-winesburg-zone", milestone_name: "Install", milestone_date: "2026-04-16", date_confidence: "Confirmed", owner: "MN", notes: "Quote #17608A." },
  { milestone_id: "ms-case-winesburg-golive", project_id: "prj-case-winesburg-zone", milestone_name: "Go-Live", milestone_date: "2026-05-11", date_confidence: "Confirmed", owner: "MN", notes: "Quote #17608A." },
  { milestone_id: "ms-gold-creek-training", project_id: "prj-gold-creek-slc", milestone_name: "BarTender Training", milestone_date: "TBD", date_confidence: "TBD", owner: null, notes: "Date not provided in source." },
  { milestone_id: "ms-vpgc-training", project_id: "prj-vpgc-s9", milestone_name: "Training – Inaccurate Inventory", milestone_date: "TBD", date_confidence: "TBD", owner: null, notes: "Source quote reference is TBD." },
  { milestone_id: "ms-uscold-roboscan", project_id: "prj-uscold-roboscan", milestone_name: "RoboScan Target Window", milestone_date: "November 2026", date_confidence: "Tentative", owner: "MN", notes: "Month-only date provided." },
  { milestone_id: "ms-farbest-training", project_id: "prj-farbest-s9", milestone_name: "Q6 / R8 / Nimbus Training Scheduling", milestone_date: "2026-05-05", date_confidence: "Tentative", owner: "WJ", notes: "From source row milestone_date." },
];

export const action_items: ActionEntity[] = [
  { action_id: "act-braswell-rm13634", project_id: "prj-braswell-s9", action_text: "Validate RM-13634 secondary-label patch in test environment.", owner: "WJ", due_date: "2026-04-18", status: "Testing", priority: "High", blocker: null, notes: "Marked urgent in source." },
  { action_id: "act-braswell-rm13421", project_id: "prj-braswell-s9", action_text: "Collect fresh logs and retest RM-13421 cancel/reprint flow.", owner: "WJ", due_date: "TBD", status: "Testing", priority: "Medium", blocker: "Pending customer log sample", notes: "No due date provided." },
  { action_id: "act-case-winesburg-s9", project_id: "prj-case-winesburg-s9", action_text: "Schedule production deployment window for RM-13987 patch.", owner: "WJ", due_date: "TBD", status: "Ready to Deploy", priority: "High", blocker: "Deployment window not confirmed", notes: "Testing already complete." },
  { action_id: "act-case-morganton-window", project_id: "prj-case-morganton-zone", action_text: "Confirm customer maintenance window for Morganton zone install.", owner: "MN", due_date: "2026-06-01", status: "Scheduled", priority: "High", blocker: "Customer maintenance window", notes: "Install package is approved." },
  { action_id: "act-case-winesburg-vrt", project_id: "prj-case-winesburg-zone", action_text: "Resolve box-orientation issue going into VRT before go-live.", owner: "MN", due_date: "2026-05-11", status: "Scheduled", priority: "High", blocker: "Open orientation issue", notes: "Source calls out VRT issue." },
  { action_id: "act-banks-hotfix", project_id: "prj-banks-asn", action_text: "Deliver and deploy ASN lot-attribute hotfix.", owner: "MN", due_date: "TBD", status: "Blocked", priority: "High", blocker: "Customer release is blocked", notes: "RM-14002." },
  { action_id: "act-catfish-retry-design", project_id: "prj-catfish-post", action_text: "Create retry-design note for catch-weight interface logic.", owner: "WJ", due_date: "TBD", status: "Post-Implementation", priority: "Medium", blocker: null, notes: "Follow-up with integration team." },
  { action_id: "act-farbest-poll", project_id: "prj-farbest-s9", action_text: "Send scheduling poll for Q6, R8, and Nimbus training.", owner: "WJ", due_date: "2026-05-05", status: "Planning", priority: "Medium", blocker: null, notes: "Training request from customer." },
  { action_id: "act-wayne-issues", project_id: "prj-wayne-m3", action_text: "Close open SIT 3 issues before plant rollout milestones.", owner: null, due_date: "2026-05-11", status: "Testing", priority: "High", blocker: "Open SIT 3 issue list", notes: "Owner missing in source." },
  { action_id: "act-vpgc-quote", project_id: "prj-vpgc-s9", action_text: "Update quote and interface document for S9 scope.", owner: null, due_date: "TBD", status: "Planning", priority: "Medium", blocker: null, notes: "PT usage confirmation still pending." },
  { action_id: "act-tiptop-qc", project_id: "prj-tiptop-coa", action_text: "Run QC meeting and close open COA questions.", owner: "MN", due_date: "TBD", status: "In Spec", priority: "Medium", blocker: "Open COA questions", notes: "Q6 verification remains WIP." },
];

export const risks: RiskEntity[] = [
  { risk_id: "risk-banks-release", project_id: "prj-banks-asn", risk_text: "Customer release is blocked pending CFS hotfix.", severity: "High", owner: "MN", mitigation: "Prioritize hotfix delivery and coordinate release retest.", status: "Open" },
  { risk_id: "risk-case-vrt", project_id: "prj-case-winesburg-zone", risk_text: "VRT orientation issue may impact go-live readiness.", severity: "High", owner: "MN", mitigation: "Resolve orientation behavior before install closeout.", status: "Open" },
  { risk_id: "risk-marjac-date", project_id: "prj-marjac-phase23", risk_text: "Go-live is only defined as week-of and remains tentative.", severity: "Medium", owner: "MN", mitigation: "Confirm exact cutover date during test-exit review.", status: "Monitoring" },
];

export const renewals: RenewalEntity[] = [
  { renewal_id: "ren-aapp-2026", customer_id: "cust-all-american-pet-protein", renewal_type: "Software Maintenance Renewal", renewal_date: "2026-04-13", status: "In Review", notes: "Quote Sent." },
  { renewal_id: "ren-banks-2026", customer_id: "cust-banks-cold-storage", renewal_type: "Software Maintenance Renewal", renewal_date: "2026-04-15", status: "TBD", notes: "Needs confirmation." },
  { renewal_id: "ren-wayne-2026", customer_id: "cust-wayne-sanderson", renewal_type: "Software Maintenance Renewal", renewal_date: "2026-09-30", status: "Planning", notes: "Renewal workflow kickoff." },
];

export const linked_resources: LinkedResourceEntity[] = [
  { resource_id: "res-rm13634", project_id: "prj-braswell-s9", resource_label: "RM-13634", resource_type: "RM", resource_url: null, notes: "Secondary label issue." },
  { resource_id: "res-rm13421", project_id: "prj-braswell-s9", resource_label: "RM-13421", resource_type: "RM", resource_url: null, notes: "Cancel/reprint issue." },
  { resource_id: "res-rm13987", project_id: "prj-case-winesburg-s9", resource_label: "RM-13987", resource_type: "RM", resource_url: null, notes: "Order updates patch." },
  { resource_id: "res-rm13656", project_id: "prj-farbest-s9", resource_label: "RM 13656", resource_type: "RM", resource_url: null, notes: "Spec drafted and in review." },
  { resource_id: "res-quote17609a", project_id: "prj-case-morganton-zone", resource_label: "Quote #17609A", resource_type: "Quote", resource_url: null, notes: "Morganton zone install." },
  { resource_id: "res-quote17608a", project_id: "prj-case-winesburg-zone", resource_label: "Quote #17608A", resource_type: "Quote", resource_url: null, notes: "Winesburg zone install." },
  { resource_id: "res-quote17578", project_id: "prj-gold-creek-slc", resource_label: "Quote 17578", resource_type: "Quote", resource_url: null, notes: "BarTender license and training." },
];

export const status_history: StatusHistoryEntity[] = projects.map((project) => ({
  status_history_id: `hist-${project.project_id}-current`,
  project_id: project.project_id,
  status: project.status,
  status_date: project.last_updated,
  notes: "Current normalized status from tracker rebuild.",
}));

export const needs_review = [
  "Tip Top row in PDF source appears to overlap another data-cleanup entry; confirm deduplication.",
  "Wayne-Sanderson owner is not specified for SIT actions and milestone ownership.",
  "US Cold Storage RoboScan date is month-level only (November 2026); confirm exact date.",
  "VPGC training entry includes Quote TBD; confirm quote number and owner.",
  "MarJac naming appears as 'MarJac Gainesville' and 'MarJac – Phase II & III'; confirm reporting preference.",
  "Randolph Packing / Harpley’s naming order varies by row; confirm standard customer label.",
  "Banks renewal status is listed as TBD while project work is blocked; confirm commercial owner and next step.",
];

export function getCustomerById(id: string) {
  return customers.find((customer) => customer.customer_id === id) ?? null;
}

export function getProjectsForCustomer(customerId: string) {
  return projects.filter((project) => project.customer_id === customerId);
}
