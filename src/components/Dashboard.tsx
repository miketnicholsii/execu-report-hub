import { useState, useMemo } from "react";
import { projects, upcomingDates, renewals, internalInitiatives } from "@/data/sampleData";
import { getCustomerGroups } from "@/lib/projectUtils";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import StatusCharts from "@/components/StatusCharts";
import UpcomingDatesTable from "@/components/UpcomingDatesTable";
import CustomerProjectSection from "@/components/CustomerProjectSection";
import RenewalTable from "@/components/RenewalTable";
import InternalInitiativesTable from "@/components/InternalInitiativesTable";
import { Search, Download, Eye, List, ChevronRight } from "lucide-react";

type ViewMode = "executive" | "detailed";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterHealth, setFilterHealth] = useState("All");

  const customerGroups = useMemo(() => getCustomerGroups(projects), []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.customer.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.rmTickets.some((t) => t.id.toLowerCase().includes(q)) ||
        (p.site && p.site.toLowerCase().includes(q));

      const matchesStatus = filterStatus === "All" || p.phase.includes(filterStatus);
      const matchesHealth = filterHealth === "All" || p.health === filterHealth;

      return matchesSearch && matchesStatus && matchesHealth;
    });
  }, [searchQuery, filterStatus, filterHealth]);

  const handleExportPDF = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 no-print">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">CFS Project Status Command Center</h1>
              <p className="text-xs text-muted-foreground">Computerway Food Systems — Internal Status Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "executive" ? "detailed" : "executive")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border bg-card text-foreground hover:bg-muted transition-colors"
              >
                {viewMode === "executive" ? <List className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {viewMode === "executive" ? "Detailed" : "Executive"}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block px-6 pt-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-foreground">CFS Project Status Command Center</h1>
        <p className="text-sm text-muted-foreground">Computerway Food Systems — Generated {new Date().toLocaleDateString()}</p>
      </div>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Side Nav */}
        <aside className="w-52 shrink-0 no-print hidden lg:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r bg-card p-3">
          <nav className="space-y-1 text-sm">
            <button onClick={() => scrollToSection("executive")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Overview</button>
            <button onClick={() => scrollToSection("charts")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Charts</button>
            <button onClick={() => scrollToSection("dates")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Key Dates</button>
            <div className="pt-2 pb-1 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customers</div>
            {customerGroups.map((g) => (
              <button
                key={g.name}
                onClick={() => scrollToSection(`customer-${g.name.replace(/\s+/g, "-").toLowerCase()}`)}
                className="w-full text-left px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
              >
                <ChevronRight className="h-3 w-3" />
                <span className="truncate">{g.name}</span>
              </button>
            ))}
            <button onClick={() => scrollToSection("renewals")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Renewals</button>
            <button onClick={() => scrollToSection("internal")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Internal</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 space-y-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center no-print">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers, projects, RM numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border bg-card text-foreground"
            >
              <option value="All">All Phases</option>
              <option value="Planning">Planning</option>
              <option value="Research">Research</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Go-Live">Go-Live</option>
              <option value="Live">Live</option>
              <option value="Post">Post-Implementation</option>
            </select>
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border bg-card text-foreground"
            >
              <option value="All">All Health</option>
              <option value="On Track">On Track</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="At Risk">At Risk</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div id="executive"><ExecutiveSummary /></div>
          <div id="charts"><StatusCharts /></div>
          <div id="dates"><UpcomingDatesTable dates={upcomingDates} /></div>
          <CustomerProjectSection projects={filteredProjects} isExecutiveView={viewMode === "executive"} />
          <div id="renewals"><RenewalTable renewals={renewals} /></div>
          <div id="internal"><InternalInitiativesTable initiatives={internalInitiatives} /></div>

          {/* Footer */}
          <footer className="pt-6 border-t text-center text-xs text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()} — Prepared by CFS Projects Team</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
