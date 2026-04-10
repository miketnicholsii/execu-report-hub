import { customers, type ExecutiveStatus } from "@/content/customers";

export interface UpcomingDate {
  customer: string;
  topic: string;
  date: string;
  notes?: string;
  status: ExecutiveStatus;
}

export interface Renewal {
  customer: string;
  renewalDate: string;
  notes?: string;
  status: ExecutiveStatus;
}

export const lastUpdated = "April 10, 2026";

export const upcomingDates: UpcomingDate[] = [
  { customer: "MarJac – Phase II & III", topic: "Estimated go-live", date: "Week of April 6, 2026", notes: "Continued testing date TBD", status: "Testing" },
  { customer: "Braswell", topic: "Go-live", date: "Mid to late April 2026", notes: "Testing FG product codes", status: "Testing" },
  { customer: "Gold Creek", topic: "BarTender Training", date: "TBD", notes: "BS quoting S9", status: "Planning" },
  { customer: "Wayne-Sanderson – Laurel", topic: "Onsite Training", date: "May 11, 2026", notes: "Go-live May 25, 2026", status: "In Progress" },
  { customer: "Wayne-Sanderson – Laurel", topic: "Onsite End Date", date: "May 25, 2026", status: "In Progress" },
  { customer: "VPGC", topic: "Training – Inaccurate Inventory", date: "TBD", notes: "Quote TBD", status: "Planning" },
  { customer: "Case Farms – Morganton", topic: "Zone Install", date: "June 1, 2026", notes: "Quote #17609A", status: "In Progress" },
  { customer: "Case Farms – Winesburg", topic: "Zone Install", date: "Travel 4/15/26, Install 4/16/26, Go-Live 5/11/26", notes: "Quote #17608A", status: "In Progress" },
  { customer: "US Cold Storage", topic: "RoboScan", date: "November 2026", status: "TBD" },
];

export const renewals: Renewal[] = [
  { customer: "All American Pet Protein", renewalDate: "April 13, 2026", notes: "Quote Sent", status: "In Review" },
  { customer: "Banks Cold Storage", renewalDate: "April 15, 2026", status: "TBD" },
];

export const pmNotes = [
  {
    customer: "Tip Top",
    updates: [
      "COA questions remain open and a QC meeting is scheduled.",
      "Inventory sync confirmed; cleanup and monitoring continue before June.",
      "Q6 COA verification is WIP; EnviroMap transfer is In-Spec.",
      "Manual COA statement removal is In-Spec; MN S9 trailer report is In-Spec.",
    ],
  },
  { customer: "Randolph Packing / Harpley’s", updates: ["Hardware assessment quote sent."] },
  {
    customer: "Farbest",
    updates: [
      "Training requested for Q6, R8, and Nimbus.",
      "Request submitted to keep InvStatCode unchanged.",
      "Spec drafted and in review (RM 13656).",
    ],
  },
];

export const portfolioItems = customers.flatMap((customer) =>
  customer.initiatives.map((initiative) => ({
    customer: customer.customerName + (initiative.siteName ? ` – ${initiative.siteName}` : ""),
    deliverable: initiative.projectName,
    phase: initiative.phase,
    status: initiative.status,
    summary: initiative.summary,
  })),
);

export { customers };
