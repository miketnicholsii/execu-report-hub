export type ExecutiveStatus =
  | "Planning"
  | "In Progress"
  | "Testing"
  | "Live"
  | "Post Implementation"
  | "In Review"
  | "TBD";

export interface Initiative {
  id: string;
  siteName?: string;
  projectName: string;
  deliverable: string;
  phase: string;
  status: ExecutiveStatus;
  summary: string;
  keyDates: string[];
  nextSteps: string[];
  recentHighlights?: string[];
  recentDeployments?: string[];
}

export interface CustomerProfile {
  id: string;
  slug: string;
  customerName: string;
  overview: string;
  initiatives: Initiative[];
  trackerAvailable: boolean;
}

export const customers: CustomerProfile[] = [
  {
    id: "braswell",
    slug: "braswell",
    customerName: "Braswell",
    overview: "S9 go-live activities remain active, with shipping-focused validation and urgent print-related testing items.",
    trackerAvailable: true,
    initiatives: [
      {
        id: "braswell-s9",
        projectName: "S9 Upgrade",
        deliverable: "Full system go-live",
        phase: "Go-Live",
        status: "In Progress",
        summary:
          "Testing SSS with Tom is complete. The team is now focused on shipping flow validation and active RM fixes.",
        keyDates: ["CFS onsite shipping focus: TBD", "Full system go-live window: April 2026"],
        nextSteps: [
          "RM-13634 secondary label print issue remains in active testing (urgent).",
          "RM-13421 cancel/reprint testing remains active.",
          "Continue FG product code validation.",
        ],
      },
    ],
  },
  {
    id: "case-farms",
    slug: "case-farms",
    customerName: "Case Farms",
    overview: "Multiple Case Farms workstreams are moving in parallel across S9 upgrade support and zone install implementation.",
    trackerAvailable: true,
    initiatives: [
      {
        id: "case-winesburg-s9",
        siteName: "Winesburg",
        projectName: "S9 Upgrade",
        deliverable: "Order update patch readiness",
        phase: "Planning",
        status: "Planning",
        summary: "Pending deployment of a CFS patch to address order update issues.",
        keyDates: ["Server update date: TBD"],
        nextSteps: ["Confirm patch deployment window.", "Validate order update behavior after deployment."],
      },
      {
        id: "case-farmerville-live",
        siteName: "Farmerville",
        projectName: "S9 Go-Live",
        deliverable: "Post-go-live stabilization",
        phase: "Live",
        status: "Live",
        summary: "Site is live and waiting on the same CFS patch for order update issues.",
        keyDates: ["Go-live: complete"],
        nextSteps: ["Deploy validated patch and confirm stability."],
      },
      {
        id: "case-morganton-zone",
        siteName: "Morganton",
        projectName: "Zone Install",
        deliverable: "Zone implementation",
        phase: "Implementation",
        status: "In Progress",
        summary: "Zone install is scheduled under quote #17609A.",
        keyDates: ["Zone install: June 1, 2026"],
        nextSteps: ["Coordinate final install readiness with the customer."],
      },
      {
        id: "case-winesburg-zone",
        siteName: "Winesburg",
        projectName: "Zone Install",
        deliverable: "Travel, install, and go-live sequence",
        phase: "Implementation",
        status: "In Progress",
        summary: "Travel/install/go-live sequence is scheduled under quote #17608A.",
        keyDates: ["Travel: April 15, 2026", "Install: April 16, 2026", "Go-live: May 11, 2026"],
        nextSteps: ["Resolve open box-orientation issue going into VRT."],
      },
    ],
  },
  {
    id: "consolidated-catfish",
    slug: "consolidated-catfish",
    customerName: "Consolidated Catfish",
    overview: "Post-implementation support is ongoing with additional deliverables, patch planning, and deployment follow-up.",
    trackerAvailable: true,
    initiatives: [
      {
        id: "catfish-post",
        projectName: "S9 Post Implementation",
        deliverable: "Patch and open deliverable scheduling",
        phase: "Post Implementation",
        status: "Post Implementation",
        summary: "Projects continue to test and schedule open deliverables, patches, and updates.",
        keyDates: ["Recent deployment completed on Tuesday (date not specified in source)."],
        nextSteps: ["Prioritize remaining open items and schedule the next deployment bundle."],
        recentDeployments: ["Deployment completed on Tuesday."],
      },
    ],
  },
  {
    id: "farbest",
    slug: "farbest",
    customerName: "Farbest",
    overview: "Upgrade planning is underway and scope is still being defined.",
    trackerAvailable: false,
    initiatives: [
      {
        id: "farbest-s9",
        projectName: "S9 Upgrade / Open Issues",
        deliverable: "Scope and timeline definition",
        phase: "Planning",
        status: "Planning",
        summary: "Custom development has been reviewed to help define upgrade scope.",
        keyDates: ["Timeline: TBD"],
        nextSteps: ["Determine timeline and requirements for upgrade."],
        recentHighlights: ["Training requested for Q6, R8, and Nimbus."],
      },
    ],
  },
  {
    id: "gold-creek",
    slug: "gold-creek",
    customerName: "Gold Creek",
    overview: "Product setup and label design are progressing for a stand-alone SLC station.",
    trackerAvailable: false,
    initiatives: [
      {
        id: "gold-creek-setup",
        projectName: "Product Setup and Label Design",
        deliverable: "Stand-alone SLC station setup",
        phase: "Design",
        status: "In Progress",
        summary: "BS is quoting S9. Quote 17578 covers BarTender license and training.",
        keyDates: ["BarTender training: TBD"],
        nextSteps: ["Provide BarTender_TestDB for customer environment."],
      },
    ],
  },
  {
    id: "harpleys-randolph",
    slug: "harpleys-randolph-packing",
    customerName: "Harpley’s / Randolph Packing",
    overview: "System upgrade research is active and hardware readiness planning has started.",
    trackerAvailable: false,
    initiatives: [
      {
        id: "harpleys-upgrade",
        projectName: "System Upgrade",
        deliverable: "Hardware assessment and restart plan",
        phase: "Research",
        status: "In Review",
        summary: "Hardware assessment quote has been sent; planning is still early.",
        keyDates: ["On-site hardware assessment scheduling: TBD"],
        nextSteps: ["Define timeline to resume PT usage."],
        recentHighlights: ["Quote sent for hardware assessment."],
      },
    ],
  },
  {
    id: "marjac",
    slug: "marjac",
    customerName: "MarJac Gainesville",
    overview: "RoboScan and S9 upgrade efforts are running in parallel across testing and planning phases.",
    trackerAvailable: false,
    initiatives: [
      {
        id: "marjac-phase23",
        projectName: "Phase II & III – RoboScan Install & Interfaces",
        deliverable: "RoboScan install and interface validation",
        phase: "Development / Testing",
        status: "Testing",
        summary: "Initial onsite testing from the week of March 9 is complete.",
        keyDates: ["Additional testing: TBD", "Go-live target: week of April 6, 2026"],
        nextSteps: ["Refine onsite testing checklist (WIP).", "Create RoboScan install checklist (WIP)."],
      },
      {
        id: "marjac-s9",
        projectName: "S9 Upgrade",
        deliverable: "Upgrade timeline and custom scope",
        phase: "Planning",
        status: "Planning",
        summary: "Upgrade planning is underway and custom development scope is under review.",
        keyDates: ["Upgrade timeline: TBD"],
        nextSteps: ["Determine timeline and requirements for upgrade."],
      },
    ],
  },
  {
    id: "wayne-sanderson",
    slug: "wayne-sanderson-farms",
    customerName: "Wayne-Sanderson Farms",
    overview: "M3 merger SIT 3 testing is active with first-plant rollout planning in progress.",
    trackerAvailable: false,
    initiatives: [
      {
        id: "wayne-m3",
        projectName: "M3 Merger",
        deliverable: "SIT 3 testing and rollout",
        phase: "SIT 3 Testing",
        status: "Testing",
        summary: "Issue review and resolution are ongoing ahead of phased rollout.",
        keyDates: ["Laurel onsite training: May 11, 2026", "Laurel go-live: May 25, 2026", "First plant go-live: May 2026"],
        nextSteps: ["Review and resolve open issues before rollout milestones."],
      },
    ],
  },
  {
    id: "vpgc",
    slug: "vpgc",
    customerName: "VPGC",
    overview: "S9 upgrade planning is active with dependencies on PT usage validation and quote/interface updates.",
    trackerAvailable: false,
    initiatives: [
      {
        id: "vpgc-s9",
        projectName: "S9 Upgrade",
        deliverable: "PT usage mapping and implementation planning",
        phase: "Planning",
        status: "Planning",
        summary: "Upgrade planning is underway and exact PT usage still needs to be confirmed.",
        keyDates: ["Training – inaccurate inventory: TBD"],
        nextSteps: ["Update quote.", "Update interface document.", "Confirm PT functions that must be supported in S9."],
      },
    ],
  },
];
