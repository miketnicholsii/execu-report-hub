export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "Testing"
  | "Live"
  | "Post Implementation"
  | "Needs Attention"
  | "In Review"
  | "TBD";

export interface TrackerLink {
  label: string;
  href?: string;
  availability: "available" | "pending";
  note?: string;
}

export interface UpcomingDateItem {
  id: string;
  customer: string;
  topic: string;
  dateLabel: string;
  sortDate?: string;
  notes?: string;
  status: ProjectStatus;
}

export interface RenewalItem {
  id: string;
  customer: string;
  renewalDate: string;
  sortDate: string;
  notes?: string;
  status: ProjectStatus;
}

export interface PortfolioItem {
  id: string;
  customer: string;
  deliverable: string;
  phase: string;
  status: ProjectStatus;
  summary: string;
}

export interface PmNote {
  id: string;
  customer: string;
  notes: string[];
}

export interface ProjectCard {
  id: string;
  customer: string;
  site?: string;
  projectDeliverable: string;
  phase: string;
  status: ProjectStatus;
  urgency?: "normal" | "high";
  keyDates: string[];
  summaryNotes: string[];
  openIssuesNextSteps: string[];
  recentHighlights?: string[];
  recentDeployments?: string[];
  trackerLink: TrackerLink;
  supportingLinks?: TrackerLink[];
}

export const lastUpdated = "April 10, 2026";

export const upcomingDates: UpcomingDateItem[] = [
  {
    id: "marjac-phase23-golive",
    customer: "MarJac – Gainesville",
    topic: "Phase II & III Estimated Go-Live",
    dateLabel: "Week of April 6, 2026",
    sortDate: "2026-04-06",
    notes: "Continued testing date TBD.",
    status: "Testing",
  },
  {
    id: "braswell-golive-window",
    customer: "Braswell",
    topic: "S9 Go-Live Window",
    dateLabel: "Mid to late April 2026",
    notes: "Testing FG product codes.",
    status: "Testing",
  },
  {
    id: "gold-creek-bartender",
    customer: "Gold Creek",
    topic: "BarTender Training",
    dateLabel: "TBD",
    notes: "BS quoting S9.",
    status: "Planning",
  },
  {
    id: "wayne-laurel-onsite",
    customer: "Wayne-Sanderson – Laurel",
    topic: "Onsite Training",
    dateLabel: "May 11, 2026",
    sortDate: "2026-05-11",
    notes: "Go-live planned for May 25, 2026.",
    status: "In Progress",
  },
  {
    id: "wayne-laurel-onsite-end",
    customer: "Wayne-Sanderson – Laurel",
    topic: "Onsite End Date",
    dateLabel: "May 25, 2026",
    sortDate: "2026-05-25",
    status: "In Progress",
  },
  {
    id: "vpgc-training",
    customer: "VPGC",
    topic: "Training – Inaccurate Inventory",
    dateLabel: "TBD",
    notes: "Quote #TBD.",
    status: "Planning",
  },
  {
    id: "case-morganton-zone",
    customer: "Case Farms – Morganton",
    topic: "Zone Install",
    dateLabel: "June 1, 2026",
    sortDate: "2026-06-01",
    notes: "Quote #17609A.",
    status: "In Progress",
  },
  {
    id: "case-winesburg-zone",
    customer: "Case Farms – Winesburg",
    topic: "Zone Install Travel / Install / Go-Live",
    dateLabel: "Travel Apr 15, 2026 · Install Apr 16, 2026 · Go-Live May 11, 2026",
    sortDate: "2026-04-15",
    notes: "Quote #17608A.",
    status: "In Progress",
  },
  {
    id: "uscold-roboscan",
    customer: "US Cold Storage",
    topic: "RoboScan",
    dateLabel: "November 2026",
    notes: "Needs confirmation on exact date.",
    status: "TBD",
  },
];

export const renewals: RenewalItem[] = [
  {
    id: "all-american-pet-protein",
    customer: "All American Pet Protein",
    renewalDate: "April 13, 2026",
    sortDate: "2026-04-13",
    notes: "Quote Sent",
    status: "In Review",
  },
  {
    id: "banks-cold-storage",
    customer: "Banks Cold Storage",
    renewalDate: "April 15, 2026",
    sortDate: "2026-04-15",
    notes: "Needs confirmation",
    status: "TBD",
  },
];

export const portfolioItems: PortfolioItem[] = [
  { id: "braswell-s9", customer: "Braswell", deliverable: "S9 Upgrade", phase: "Go-Live", status: "In Progress", summary: "Shipping-focused validation in progress." },
  { id: "case-winesburg-s9", customer: "Case Farms – Winesburg", deliverable: "S9 Upgrade", phase: "Planning", status: "Planning", summary: "Server update timing and patch sequencing pending." },
  { id: "case-farmerville", customer: "Case Farms – Farmerville", deliverable: "S9 Go-Live", phase: "Live", status: "Live", summary: "Live with follow-up patch dependency." },
  { id: "case-morganton-zone", customer: "Case Farms – Morganton", deliverable: "Zone Install", phase: "Implementation", status: "In Progress", summary: "Install scheduled with approved quote." },
  { id: "case-winesburg-zone", customer: "Case Farms – Winesburg", deliverable: "Zone Install", phase: "Implementation", status: "In Progress", summary: "Install/go-live sequence defined; VRT orientation issue open." },
  { id: "catfish-post", customer: "Consolidated Catfish", deliverable: "S9 Install Go-Live / Post Implementation", phase: "Post Implementation", status: "Post Implementation", summary: "Open patch and deliverable scheduling continues." },
  { id: "farbest", customer: "Farbest", deliverable: "S9 Upgrade / Open Issues", phase: "Planning", status: "Planning", summary: "Timeline and scope discovery active." },
  { id: "gold-creek", customer: "Gold Creek", deliverable: "SLC Product Setup / Label Design", phase: "Design", status: "In Progress", summary: "BarTender scope and S9 quote in progress." },
  { id: "harpleys", customer: "Harpley’s / Randolph Packing", deliverable: "System Upgrade", phase: "Research", status: "In Review", summary: "Hardware assessment quote sent; restart timeline needed." },
  { id: "marjac-phase23", customer: "MarJac Gainesville", deliverable: "Phase II & III – RoboScan Install & Interfaces", phase: "Development / Testing", status: "Testing", summary: "Onsite test cycle complete; checklists in WIP state." },
  { id: "marjac-s9", customer: "MarJac Gainesville", deliverable: "S9 Upgrade", phase: "Planning", status: "Planning", summary: "Upgrade timeline and custom scope under review." },
  { id: "wayne-m3", customer: "Wayne-Sanderson Farms", deliverable: "M3 Merger", phase: "SIT 3 Testing", status: "Testing", summary: "Plant rollout sequence and issue closure in progress." },
  { id: "vpgc-s9", customer: "VPGC", deliverable: "S9 Upgrade", phase: "Planning", status: "Planning", summary: "PT usage assessment and quote/interface updates required." },
];

export const pmNotes: PmNote[] = [
  {
    id: "tip-top",
    customer: "Tip Top",
    notes: [
      "COA questions are open; QC meeting is scheduled.",
      "Inventory sync confirmed; data cleanup and monitoring needed before June.",
      "Q6 COA functionality verification is WIP.",
      "Data transfer to EnviroMap marked In-Spec.",
      "Manual COA statement removal marked In-Spec.",
      "CFS Internal MN S9 Trailer Report marked In-Spec.",
    ],
  },
  {
    id: "randolph-harpleys",
    customer: "Randolph Packing / Harpley’s",
    notes: ["Hardware assessment quote sent."],
  },
  {
    id: "farbest",
    customer: "Farbest",
    notes: [
      "Requested training for Q6, R8, and Nimbus.",
      "Requested no update to InvStatCode.",
      "Spec drafted and in review (RM 13656).",
    ],
  },
];

export const projectCards: ProjectCard[] = [
  {
    id: "braswell-card",
    customer: "Braswell",
    projectDeliverable: "S9 Upgrade",
    phase: "Go-Live",
    status: "In Progress",
    urgency: "high",
    keyDates: ["CFS onsite shipping focus: TBD", "Full system go-live: April 2026"],
    summaryNotes: [
      "Testing SSS with Tom is complete.",
      "RM-13634 secondary label fails to print; Testing Active (urgent).",
      "RM-13421 cancel/reprint testing active.",
    ],
    openIssuesNextSteps: ["Continue FG product code validation and shipping workflow checks."],
    recentHighlights: ["No material update outside active test items."],
    trackerLink: { label: "Braswell tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "case-winesburg-s9-card",
    customer: "Case Farms",
    site: "Winesburg",
    projectDeliverable: "S9 Upgrade",
    phase: "Planning",
    status: "Planning",
    keyDates: ["Server update date: TBD"],
    summaryNotes: ["Waiting on CFS to deploy patch for Order Updates issues.", "CFS can deploy updates as they become available."],
    openIssuesNextSteps: ["Confirm deployment window and validate post-patch Order Updates behavior."],
    recentHighlights: ["No new highlights."],
    trackerLink: { label: "Case Farms tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "case-farmerville-card",
    customer: "Case Farms",
    site: "Farmerville",
    projectDeliverable: "S9 Go-Live",
    phase: "Live",
    status: "Live",
    keyDates: ["Go-live: complete"],
    summaryNotes: ["Live site waiting on CFS patch for Order Updates."],
    openIssuesNextSteps: ["Deploy patch after validation and confirm stability."],
    trackerLink: { label: "Case Farms tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "case-zone-card",
    customer: "Case Farms",
    projectDeliverable: "Zone Install",
    phase: "Implementation",
    status: "In Progress",
    keyDates: ["Morganton install: June 1, 2026 (Quote #17609A)", "Winesburg travel/install/go-live: Apr 15 / Apr 16 / May 11, 2026 (Quote #17608A)"],
    summaryNotes: ["Zone install workstreams are approved and scheduled."],
    openIssuesNextSteps: ["Resolve Winesburg open issue: box orientation going into VRT."],
    trackerLink: { label: "Case Farms tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "catfish-card",
    customer: "Consolidated Catfish",
    projectDeliverable: "S9 Post Implementation",
    phase: "Post Implementation",
    status: "Post Implementation",
    keyDates: ["Recent deployment completed on Tuesday (date in source not specified)."],
    summaryNotes: ["Projects are being tested and open deliverables, patches, and updates are being scheduled."],
    openIssuesNextSteps: ["Prioritize remaining open deliverables and schedule next deployment bundle."],
    recentDeployments: ["Deployment completed on Tuesday."],
    trackerLink: { label: "Consolidated Catfish tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "farbest-card",
    customer: "Farbest",
    projectDeliverable: "S9 Upgrade / Open Issues",
    phase: "Planning",
    status: "Planning",
    keyDates: ["Timeline and requirements: TBD"],
    summaryNotes: ["Early upgrade planning underway.", "Custom development has been reviewed to determine scope."],
    openIssuesNextSteps: ["Determine timeline and requirements with customer stakeholders."],
    recentHighlights: ["Training requested for Q6, R8, and Nimbus."],
    trackerLink: { label: "Farbest tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "gold-creek-card",
    customer: "Gold Creek",
    projectDeliverable: "Stand-alone SLC Product Setup and Label Design",
    phase: "Product Setup / Label Design",
    status: "In Progress",
    keyDates: ["BarTender training date: TBD"],
    summaryNotes: ["BS quoting S9.", "Quote 17578 covers BarTender license and training."],
    openIssuesNextSteps: ["Provision Bartender_TestDB for Gold Creek."],
    trackerLink: { label: "Gold Creek tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "harpleys-card",
    customer: "Harpley’s / Randolph Packing",
    projectDeliverable: "System Upgrade",
    phase: "Research",
    status: "In Review",
    keyDates: ["On-site hardware assessment: schedule TBD"],
    summaryNotes: ["Hardware assessment quote sent."],
    openIssuesNextSteps: ["Determine timeline to resume PT usage."],
    trackerLink: { label: "Harpley’s / Randolph tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "marjac-phase23-card",
    customer: "MarJac Gainesville",
    projectDeliverable: "Phase II & III – RoboScan Install & Interfaces",
    phase: "Development / Testing",
    status: "Testing",
    keyDates: ["Initial onsite testing: week of Mar 9, 2026 complete", "Additional testing date: TBD", "Go-live target: week of Apr 6, 2026"],
    summaryNotes: ["Initial onsite testing is complete."],
    openIssuesNextSteps: ["Refine onsite testing checklist (WIP).", "Create RoboScan install checklist (WIP)."],
    trackerLink: { label: "MarJac tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "marjac-s9-card",
    customer: "MarJac Gainesville",
    projectDeliverable: "S9 Upgrade",
    phase: "Planning",
    status: "Planning",
    keyDates: ["Upgrade schedule: TBD"],
    summaryNotes: ["Timeline and requirements for upgrade are being determined.", "Custom development scope is under review."],
    openIssuesNextSteps: ["Confirm roadmap and implementation sequence."],
    trackerLink: { label: "MarJac tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "wayne-card",
    customer: "Wayne-Sanderson Farms",
    projectDeliverable: "M3 Merger",
    phase: "SIT 3 Testing",
    status: "Testing",
    keyDates: ["First plant go-live: May 2026"],
    summaryNotes: ["Rollout planning is active across plants."],
    openIssuesNextSteps: ["Review and resolve open issues prior to rollout stages."],
    recentHighlights: ["Laurel onsite training begins May 11, 2026; onsite end/go-live on May 25, 2026."],
    trackerLink: { label: "Wayne-Sanderson tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
  {
    id: "vpgc-card",
    customer: "VPGC",
    projectDeliverable: "S9 Upgrade",
    phase: "Planning",
    status: "Planning",
    keyDates: ["Training for inaccurate inventory: TBD"],
    summaryNotes: ["Need to identify PT usage so S9 covers required functions."],
    openIssuesNextSteps: ["Update quote.", "Update interface document."],
    trackerLink: { label: "VPGC tracker", availability: "pending", note: "Tracker file not yet in repo." },
  },
];

export const supportingLinks: TrackerLink[] = [
  { label: "Braswell - Customer Ready Tracker.xlsx", availability: "pending", note: "File not present in repository." },
  { label: "Banks Cold Storage - Customer Ready Tracker.xlsx", availability: "pending", note: "File not present in repository." },
  { label: "Case Farms - Customer Ready Tracker.xlsx", availability: "pending", note: "File not present in repository." },
  { label: "Consolidated Catfish - Customer Ready Tracker.xlsx", availability: "pending", note: "File not present in repository." },
  { label: "CPT-CFS Projects Team _ Initiatives & Status Tracker-100426-181710.pdf", availability: "pending", note: "Attached report reference not present in repository." },
];
