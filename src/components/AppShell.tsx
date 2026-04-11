import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, Calendar, RefreshCw, AlertTriangle,
  MessageSquare, ClipboardList, ChevronLeft, ChevronRight, Download,
  Search, FileDown, Wrench
} from "lucide-react";

const NAV = [
  { to: "/portfolio", label: "Portfolio Dashboard", icon: LayoutDashboard },
  { to: "/customer-summary", label: "Customer Summary", icon: Users },
  { to: "/tracker", label: "Issue Tracker", icon: ClipboardList },
  { to: "/rm-issues", label: "RM / Redmine Center", icon: AlertTriangle },
  { to: "/rm-report-builder", label: "RM Report Builder", icon: Wrench },
  { to: "/action-items", label: "Action Center", icon: FileText },
  { to: "/key-dates", label: "Key Dates", icon: Calendar },
  { to: "/renewals", label: "Renewals", icon: RefreshCw },
  { to: "/meeting-minutes", label: "Meeting Minutes", icon: MessageSquare },
  { to: "/reports", label: "Report & Export Center", icon: FileDown },
];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  actions?: React.ReactNode;
}

export default function AppShell({ children, title, subtitle, onExportExcel, onExportPdf, actions }: Props) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  return (
    <div className="min-h-screen flex bg-background print:bg-white">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-14" : "w-56"} bg-card border-r border-border flex-shrink-0 transition-all duration-200 print:hidden sticky top-0 h-screen overflow-y-auto`}>
        <div className="p-3 flex items-center justify-between border-b border-border">
          {!collapsed && <span className="font-semibold text-sm text-foreground">CFS Command Center</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-muted">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && (
          <div className="px-2 pt-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search pages..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-background pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
        <nav className="p-2 space-y-0.5">
          {NAV.filter((item) => !globalSearch || item.label.toLowerCase().includes(globalSearch.toLowerCase())).map((item) => {
            const active = location.pathname === item.to || (item.to !== "/portfolio" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={item.label}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 print:static print:border-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2 print:hidden">
              {actions}
              {onExportExcel && (
                <button onClick={onExportExcel} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                  <Download className="h-3.5 w-3.5" /> Excel
                </button>
              )}
              {onExportPdf && (
                <button onClick={onExportPdf} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="p-6 space-y-5">{children}</main>
      </div>
    </div>
  );
}