import { useState, useMemo } from "react";
import { projects, upcomingDates, renewals, internalInitiatives } from "@/data/sampleData";
import { getCustomerGroups } from "@/lib/projectUtils";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import StatusCharts from "@/components/StatusCharts";
import UpcomingDatesTable from "@/components/UpcomingDatesTable";
import CustomerProjectSection from "@/components/CustomerProjectSection";
import RenewalTable from "@/components/RenewalTable";
import InternalInitiativesTable from "@/components/InternalInitiativesTable";
import { Search, Download, Eye, List, ChevronRight, Copy, Check } from "lucide-react";

type ViewMode = "executive" | "detailed";

function buildConfluenceHtmlReport(filteredProjects: typeof projects) {
  const grouped = getCustomerGroups(filteredProjects);

  const rows = grouped
    .map((group) => {
      const projectRows = group.projects
        .map((p) => {
          const issues = p.openIssues.length > 0 ? `<ul>${p.openIssues.map((i) => `<li>${i}</li>`).join("")}</ul>` : "No open issues";
          const plant = p.site ? `${p.customer} - ${p.site}` : p.customer;

          return `
            <tr>
              <td><strong>${plant}</strong></td>
              <td>${p.project}</td>
              <td><span>${p.phase}</span></td>
              <td>${p.health}</td>
              <td>${p.summary}</td>
              <td>${issues}</td>
            </tr>`;
        })
        .join("");

      return `<h3>${group.name}</h3><table><tbody>${projectRows}</tbody></table>`;
    })
    .join("");

  return `
    <h1>CFS Projects Team | Initiatives &amp; Status Tracker</h1>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
    <h2>Portfolio Overview</h2>
    <ul>
      <li>Total Projects: ${filteredProjects.length}</li>
      <li>Needs Attention / At Risk: ${filteredProjects.filter((p) => p.health !== "On Track").length}</li>
      <li>Projects with Open Issues: ${filteredProjects.filter((p) => p.openIssues.length > 0).length}</li>
    </ul>
    <h2>Customer &amp; Plant Drill-down</h2>
    ${rows}
  `;
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("detailed");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterHealth, setFilterHealth] = useState("All");
  const [copied, setCopied] = useState(false);

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

  const plantDrilldowns = useMemo(
    () =>
      filteredProjects.map((p) => ({
        plant: p.site ? `${p.customer} - ${p.site}` : p.customer,
        project: p.project,
        phase: p.phase,
        health: p.health,
        nextMilestone: p.keyDates[0] ?? "TBD",
      })),
    [filteredProjects],
  );

  const issueDrilldowns = useMemo(
    () =>
      filteredProjects.flatMap((p) => {
        const plant = p.site ? `${p.customer} - ${p.site}` : p.customer;
        const issues = p.openIssues.map((issue) => ({ plant, project: p.project, issue, owner: p.owner ?? "TBD" }));
        const rmIssues = p.rmTickets.map((ticket) => ({
          plant,
          project: p.project,
          issue: `${ticket.id}: ${ticket.description} (${ticket.status})`,
          owner: p.owner ?? "TBD",
        }));

        return [...issues, ...rmIssues];
      }),
    [filteredProjects],
  );

  const handleExportPDF = () => {
    window.print();
  };

  const handleCopyConfluence = async () => {
    const html = buildConfluenceHtmlReport(filteredProjects);
    const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    try {
      if ("ClipboardItem" in window) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(plain);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Unable to copy report", error);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50 no-print">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">CFS Project Status Command Center</h1>
              <p className="text-xs text-muted-foreground">Computerway Food Systems — Internal Status Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyConfluence}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border bg-card text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied for Confluence" : "Copy to Confluence"}
              </button>
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

      <div className="hidden print:block px-6 pt-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-foreground">CFS Project Status Command Center</h1>
        <p className="text-sm text-muted-foreground">Computerway Food Systems — Generated {new Date().toLocaleDateString()}</p>
      </div>

      <div className="max-w-[1400px] mx-auto flex">
        <aside className="w-52 shrink-0 no-print hidden lg:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r bg-card p-3">
          <nav className="space-y-1 text-sm">
            <button onClick={() => scrollToSection("executive")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Overview</button>
            <button onClick={() => scrollToSection("plant-drilldown")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Plant Drill-down</button>
            <button onClick={() => scrollToSection("issue-drilldown")} className="w-full text-left px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Issue Drill-down</button>
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

        <main className="flex-1 min-w-0 p-6 space-y-8">
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
          <div id="charts" className="no-print"><StatusCharts /></div>

          <section id="plant-drilldown" className="bg-card rounded-lg border p-4 print-avoid-break">
            <h2 className="text-lg font-semibold mb-3">Plant-Level Drill-down</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-2">Plant</th>
                    <th className="py-2 pr-2">Project</th>
                    <th className="py-2 pr-2">Phase</th>
                    <th className="py-2 pr-2">Health</th>
                    <th className="py-2">Next Milestone</th>
                  </tr>
                </thead>
                <tbody>
                  {plantDrilldowns.map((item, idx) => (
                    <tr key={`${item.plant}-${item.project}-${idx}`} className="border-b last:border-none">
                      <td className="py-2 pr-2">{item.plant}</td>
                      <td className="py-2 pr-2">{item.project}</td>
                      <td className="py-2 pr-2">{item.phase}</td>
                      <td className="py-2 pr-2">{item.health}</td>
                      <td className="py-2">{item.nextMilestone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="issue-drilldown" className="bg-card rounded-lg border p-4 print-avoid-break">
            <h2 className="text-lg font-semibold mb-3">Issue-Level Drill-down</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-2">Plant</th>
                    <th className="py-2 pr-2">Project</th>
                    <th className="py-2 pr-2">Issue</th>
                    <th className="py-2">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {issueDrilldowns.length > 0 ? (
                    issueDrilldowns.map((item, idx) => (
                      <tr key={`${item.plant}-${item.project}-${idx}`} className="border-b last:border-none">
                        <td className="py-2 pr-2">{item.plant}</td>
                        <td className="py-2 pr-2">{item.project}</td>
                        <td className="py-2 pr-2">{item.issue}</td>
                        <td className="py-2">{item.owner}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 text-muted-foreground" colSpan={4}>No open issues in current filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div id="dates"><UpcomingDatesTable dates={upcomingDates} /></div>
          <CustomerProjectSection projects={filteredProjects} isExecutiveView={viewMode === "executive"} />
          <div id="renewals"><RenewalTable renewals={renewals} /></div>
          <div id="internal" className="no-print"><InternalInitiativesTable initiatives={internalInitiatives} /></div>

          <footer className="pt-6 border-t text-center text-xs text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()} — Prepared by CFS Projects Team</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
