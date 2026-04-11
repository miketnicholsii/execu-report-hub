import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, FileText, Calendar, RefreshCw, AlertTriangle,
  MessageSquare, ClipboardList, ChevronLeft, ChevronRight, Download,
  Search, FileDown, Wrench, TrendingUp, Target, Layers, Settings, BookOpen,
  Upload, FolderOpen, MoonStar, SunMedium
} from "lucide-react";

const NAV = [
  { to: "/", label: "Executive Dashboard", icon: LayoutDashboard, group: "Overview" },
  { to: "/portfolio", label: "Portfolio", icon: Target, group: "Overview" },
  { to: "/customer-summary", label: "Customers", icon: Users, group: "Portfolio" },
  { to: "/tracker", label: "Issue Tracker", icon: ClipboardList, group: "Portfolio" },
  { to: "/rm-issues", label: "Redmine / RMs", icon: AlertTriangle, group: "Portfolio" },
  { to: "/specs", label: "Specs Workspace", icon: Layers, group: "Portfolio" },
  { to: "/action-items", label: "Action Center", icon: FileText, group: "Operations" },
  { to: "/key-dates", label: "Key Dates & Installs", icon: Calendar, group: "Operations" },
  { to: "/renewals", label: "Renewals", icon: RefreshCw, group: "Operations" },
  { to: "/meeting-minutes", label: "Meeting Minutes", icon: MessageSquare, group: "Operations" },
  { to: "/documents", label: "Document Intelligence", icon: Upload, group: "Knowledge" },
  { to: "/wiki", label: "Project Wiki", icon: BookOpen, group: "Knowledge" },
  { to: "/rm-report-builder", label: "RM Report Builder", icon: Wrench, group: "Reports" },
  { to: "/reports", label: "Export Center", icon: FileDown, group: "Reports" },
  { to: "/setup", label: "Setup Wizard", icon: Target, group: "System" },
  { to: "/settings", label: "Settings", icon: Settings, group: "System" },
];

const GROUPS = ["Overview", "Portfolio", "Operations", "Knowledge", "Reports", "System"];

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}

export default function AppShell({ children, title, subtitle, onExportExcel, onExportPdf, actions, breadcrumbs }: Props) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("cfs-theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("cfs-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex bg-background print:bg-white">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-14" : "w-56"} bg-sidebar border-r border-sidebar-border flex-shrink-0 transition-all duration-200 print:hidden sticky top-0 h-screen overflow-y-auto`}>
        <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
          {!collapsed && (
            <div>
            <span className="font-bold text-sm text-sidebar-foreground tracking-tight">NÈKO</span>
              <span className="font-light text-[10px] text-muted-foreground ml-1.5">Project Intelligence</span>
            </div>
          )}
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
                placeholder="Search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-background pl-8 pr-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
        <nav className="p-2">
          {GROUPS.map((group) => {
            const items = NAV.filter((item) => item.group === group && (!globalSearch || item.label.toLowerCase().includes(globalSearch.toLowerCase())));
            if (!items.length) return null;
            return (
              <div key={group} className="mb-1">
                {!collapsed && <p className="px-2.5 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{group}</p>}
                {items.map((item) => {
                  const active = location.pathname === item.to || (item.to !== "/" && item.to !== "/portfolio" && location.pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                        active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border bg-sidebar">
            <p className="text-[10px] text-muted-foreground text-center">NÈKO · Mike Nichols · v3.0</p>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-card/90 backdrop-blur border-b border-border px-6 py-3 print:static print:border-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 print:hidden">
              <Link to="/" className="hover:text-foreground">Dashboard</Link>
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span>/</span>
                  {bc.to ? <Link to={bc.to} className="hover:text-foreground">{bc.label}</Link> : <span className="text-foreground">{bc.label}</span>}
                </span>
              ))}
            </nav>
          )}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <SunMedium className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
                {isDarkMode ? "Light" : "Dark"}
              </button>
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
