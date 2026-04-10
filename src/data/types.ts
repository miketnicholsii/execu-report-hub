export type ProjectPhase =
  | "Planning"
  | "Research"
  | "Development"
  | "Testing"
  | "Go-Live"
  | "Live"
  | "Post-Implementation"
  | "On Hold"
  | "At Risk"
  | "SIT 3 Testing"
  | "Development / Testing";

export type HealthStatus = "On Track" | "Needs Attention" | "At Risk" | "Blocked";

export type DateType = "Go-Live" | "Training" | "Install" | "Milestone" | "Deployment" | "Renewal";

export interface RMTicket {
  id: string;
  description: string;
  status: string;
}

export interface ProjectCard {
  id: string;
  customer: string;
  site?: string;
  project: string;
  system?: string;
  phase: ProjectPhase;
  health: HealthStatus;
  priority?: "High" | "Medium" | "Low";
  keyDates: string[];
  summary: string;
  openIssues: string[];
  nextSteps: string[];
  recentHighlights: string[];
  recentDeployments?: string[];
  rmTickets: RMTicket[];
  owner?: string;
  dependencies?: string[];
  lastUpdated: string;
}

export interface UpcomingDate {
  customer: string;
  topic: string;
  date: string;
  type: DateType;
  owner?: string;
  notes?: string;
  status?: string;
}

export interface Renewal {
  customer: string;
  renewalDate: string;
  status: string;
  notes?: string;
  quoteStatus?: string;
  owner?: string;
  nextAction?: string;
}

export interface InternalInitiative {
  customer?: string;
  owner: string;
  deliverable: string;
  status: string;
  notes?: string;
  nextStep?: string;
  rmRef?: string;
}

export interface CustomerGroup {
  name: string;
  projects: ProjectCard[];
}
