export interface WeeklySummaryEntry {
  id: string;
  week: string; // ISO week label e.g. "2026-W15"
  period: "BOW" | "MOW" | "EOW";
  level: "portfolio" | "customer" | "initiative";
  customer_id?: string;
  project_id?: string;
  highlights: string[];
  progress: string[];
  openQuestions: string[];
  blockers: string[];
  nextSteps: string[];
  dateChanges: string[];
  deploymentUpdates: string[];
  rmUpdates: string[];
  owner: string;
  lastUpdated: string;
}

export const weeklySummaries: WeeklySummaryEntry[] = [
  {
    id: "ws-portfolio-w15-bow",
    week: "2026-W15",
    period: "BOW",
    level: "portfolio",
    highlights: [
      "Braswell S9 go-live window approaching mid-late April",
      "MarJac Phase II/III onsite testing complete – go-live week of 4/6",
      "6 items testing-complete at Consolidated Catfish ready for batch deploy",
      "All American Pet Protein renewal quote sent",
    ],
    progress: [
      "SSCC18 full suite passed EK testing at Braswell",
      "Case Farms Winesburg zone install confirmed April 16",
      "Wayne-Sanderson Laurel training/go-live dates published",
    ],
    openQuestions: [
      "Braswell SSCC18 barcode content – awaiting customer confirmation",
      "Case Farms node core fix – 1.5 day downtime scheduling needed",
      "Consolidated Catfish ASN requirements for Costco – waiting on customer",
    ],
    blockers: [
      "Case Farms Winesburg VRT box orientation issue unresolved",
      "Consolidated Catfish Nimbus stalls recurring",
      "Tip Top open COA questions pending QC resolution",
    ],
    nextSteps: [
      "Schedule Braswell go-live readiness review",
      "Deploy Catfish batch of 6 testing-complete items",
      "Confirm Case Farms Morganton maintenance window",
    ],
    dateChanges: [],
    deploymentUpdates: [
      "Braswell: SSS upgrade required before full go-live",
      "Catfish: Batch deployment of 6 items pending scheduling",
    ],
    rmUpdates: [
      "RM-13634: Secondary label – Nimbus done, Printer Service pending",
      "RM-13480: Nimbus stalls – recurred 3/19, escalated",
      "RM-13661: Order LPQ – reviewing database snapshots",
    ],
    owner: "WJ",
    lastUpdated: "2026-04-07",
  },
  {
    id: "ws-portfolio-w15-mow",
    week: "2026-W15",
    period: "MOW",
    level: "portfolio",
    highlights: [
      "MarJac RoboScan go-live successfully launched week of 4/6",
      "Banks Cold Storage recall report deployed to test server",
      "Case Farms Winesburg zone install execution began April 16",
    ],
    progress: [
      "Braswell cancel/reprint + secondary label release in final testing",
      "Wayne-Sanderson SIT 3 issues progressing toward closure",
    ],
    openQuestions: [
      "Braswell manifest auto-number – dev estimate still pending",
      "Case Farms Goldsboro VRT VM coordination with customer",
    ],
    blockers: [],
    nextSteps: [
      "Finalize Braswell go-live checklist",
      "Complete Case Farms ASN receiving use case documentation",
    ],
    dateChanges: [],
    deploymentUpdates: [],
    rmUpdates: [],
    owner: "WJ",
    lastUpdated: "2026-04-09",
  },
  {
    id: "ws-portfolio-w15-eow",
    week: "2026-W15",
    period: "EOW",
    level: "portfolio",
    highlights: [
      "Case Farms Winesburg zone install on track",
      "Banks Cold Storage Josh testing recall report fix",
      "Farbest training scheduling poll sent for Q6/R8/Nimbus",
    ],
    progress: [
      "Braswell S9 go-live target firming up for late April",
      "Gold Creek BarTender DB provisioning in progress",
    ],
    openQuestions: [
      "Consolidated Catfish slow report loading – RM needed?",
    ],
    blockers: [
      "Case Farms node core fix still needs downtime window",
    ],
    nextSteps: [
      "Prepare weekly customer status emails",
      "Update initiative percentages across portfolio",
    ],
    dateChanges: [],
    deploymentUpdates: [],
    rmUpdates: [],
    owner: "WJ",
    lastUpdated: "2026-04-11",
  },
  {
    id: "ws-braswell-w15-bow",
    week: "2026-W15",
    period: "BOW",
    level: "customer",
    customer_id: "braswell",
    highlights: [
      "SSCC18 full suite (Q6, Interface, Plant Messenger, Q Listener) passed testing",
      "QERP Cases Per Pallet fix tested and passed",
      "SSS testing with Tom complete",
    ],
    progress: [
      "Cancel/Reprint and Secondary Label in active testing",
      "6 of 15 tracker items complete",
    ],
    openQuestions: [
      "SSCC18 barcode content confirmation from customer",
      "Master pallet function scope",
    ],
    blockers: [],
    nextSteps: [
      "Complete Printer Service development for secondary label",
      "Plan SSS upgrade timeline",
      "Obtain UnCombine dev estimate",
    ],
    dateChanges: [],
    deploymentUpdates: ["SSS upgrade required before full S9 go-live"],
    rmUpdates: [
      "RM-13634: Nimbus done, Printer Service pending",
      "RM-13421: In testing, will bundle with secondary label",
    ],
    owner: "WJ",
    lastUpdated: "2026-04-07",
  },
  {
    id: "ws-casefarms-w15-bow",
    week: "2026-W15",
    period: "BOW",
    level: "customer",
    customer_id: "case-farms",
    highlights: [
      "Winesburg zone install confirmed for April 16",
      "Morganton zone install confirmed for June 1",
      "Farmerville live with active open issues being worked",
    ],
    progress: [
      "Order LPQ investigation ongoing with database snapshots",
      "ASN receiving flow documentation in progress",
    ],
    openQuestions: [
      "Node core fix downtime scheduling",
      "Goldsboro VRT VM coordination",
      "SD cards for ACS upgrade – how many needed?",
    ],
    blockers: [
      "VRT box orientation issue for Winesburg unresolved",
      "Node core fix requires 1.5 days downtime",
    ],
    nextSteps: [
      "Schedule downtime for RM-13572 fix",
      "Gather ASN receiving use cases from Farmerville",
      "Resolve box orientation for Winesburg VRT",
    ],
    dateChanges: [],
    deploymentUpdates: [],
    rmUpdates: [
      "RM-13661: Order LPQ – cannot replicate, reviewing DB snapshots",
      "RM-13600: ASN fails to load – finishing dev changes",
      "RM-13572: Node core failure – fix ready, needs downtime",
    ],
    owner: "WJ",
    lastUpdated: "2026-04-10",
  },
  {
    id: "ws-catfish-w15-bow",
    week: "2026-W15",
    period: "BOW",
    level: "customer",
    customer_id: "consolidated-catfish",
    highlights: [
      "6 items testing-complete ready for batch deployment",
      "3 replacement scanners and 4 cases shipped for tally scan",
    ],
    progress: [
      "Pick List default filter enhancement in testing",
      "Goal counting fix tested and passed",
    ],
    openQuestions: [
      "Single case credit handling for RF Credit Issue",
      "Costco ASN requirements – waiting on customer",
      "Slow report loading – need to confirm and create RM?",
    ],
    blockers: [
      "Nimbus stalls causing Initializing – recurring issue",
    ],
    nextSteps: [
      "Schedule batch deployment for 6 testing-complete items",
      "Follow up on Cognex warranty for tally scanners",
      "Get ASN requirements from CC for Costco",
    ],
    dateChanges: [],
    deploymentUpdates: ["Batch deployment of 6 items pending scheduling"],
    rmUpdates: [
      "RM-13480: Nimbus stalls – happened again 3/19, escalated",
      "RM-13651: RF Credit 0 lbs – in programming",
      "RM-13647: Goal count fix – testing complete",
    ],
    owner: "WJ",
    lastUpdated: "2026-04-07",
  },
];
