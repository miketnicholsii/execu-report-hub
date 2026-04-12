import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, FileText, Calendar, RefreshCw, AlertTriangle,
  MessageSquare, ClipboardList, ChevronLeft, ChevronRight, Download,
  Search, FileDown, Wrench, Target, Layers, Settings, BookOpen,
  Upload, MoonStar, SunMedium
} from "lucide-react";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, group: "Command" },
  { to: "/portfolio", label: "Portfolio", icon: Target, group: "Command" },
  { to: "/customer-summary", label: "Customers", icon: Users, group: "Portfolio" },
  { to: "/tracker", label: "Issue Tracker", icon: ClipboardList, group: "Portfolio" },
  { to: "/rm-issues", label: "RM Issues", icon: AlertTriangle, group: "Portfolio" },
  { to: "/specs", label: "Specs & Deliverables", icon: Layers, group: "Portfolio" },
  { to: "/action-items", label: "Action Center", icon: FileText, group: "Operations" },
  { to: "/key-dates", label: "Key Dates", icon: Calendar, group: "Operations" },
  { to: "/renewals", label: "Renewals", icon: RefreshCw, group: "Operations" },
  { to: "/meeting-minutes", label: "Meetings", icon: MessageSquare, group: "Operations" },
  { to: "/documents", label: "Documents", icon: Upload, group: "Knowledge" },
  { to: "/wiki", label: "Wiki", icon: BookOpen, group: "Knowledge" },
  { to: "/rm-report-builder", label: "Report Builder", icon: Wrench, group: "Reports" },
  { to: "/reports", label: "Export Center", icon: FileDown, group: "Reports" },
  { to: "/settings", label: "Settings", icon: Settings, group: "System" },
];

const GROUPS = ["Command", "Portfolio", "Operations", "Knowledge", "Reports", "System"];

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
      {/* Sidebar — deep forest */}
      <aside className={`${collapsed ? "w-14" : "w-56"} bg-sidebar border-r border-sidebar-border flex-shrink-0 transition-all duration-200 print:hidden sticky top-0 h-screen overflow-y-auto`}>
        <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-1.5">
              <span className="heading-display font-semibold text-base text-sidebar-foreground tracking-tight">NÈKO</span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-sidebar-foreground/50 font-medium mt-0.5">Command</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && (
          <div className="px-2 pt-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/40" />
              <input
                type="text"
                placeholder="Search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-md border border-sidebar-border bg-sidebar-accent/50 pl-8 pr-2 py-1.5 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:ring-1 focus:ring-sidebar-primary/50 transition-colors"
              />
            </div>
          </div>
        )}
        <nav className="p-2">
          {GROUPS.map((group) => {
            const items = NAV.filter((item) => item.group === group && (!globalSearch || item.label.toLowerCase().includes(globalSearch.toLowerCase())));
            if (!items.length) return null;
            return (
              <div key={group} className="mb-0.5">
                {!collapsed && <p className="px-2.5 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/30">{group}</p>}
                {items.map((item) => {
                  const active = location.pathname === item.to || (item.to !== "/" && item.to !== "/portfolio" && location.pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] transition-all ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-[15px] w-[15px] flex-shrink-0" />
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
            <p className="text-[9px] text-sidebar-foreground/30 text-center uppercase tracking-[0.15em]">NÈKO · Mike Nichols · v4.0</p>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-3 print:static print:border-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1 print:hidden">
              <Link to="/" className="hover:text-foreground transition-colors">Overview</Link>
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/40">/</span>
                  {bc.to ? <Link to={bc.to} className="hover:text-foreground transition-colors">{bc.label}</Link> : <span className="text-foreground font-medium">{bc.label}</span>}
                </span>
              ))}
            </nav>
          )}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-1.5 print:hidden">
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium hover:bg-muted transition-colors"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <SunMedium className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
              </button>
              {actions}
              {onExportExcel && (
                <button onClick={onExportExcel} className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium hover:bg-muted transition-colors">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              )}
              {onExportPdf && (
                <button onClick={onExportPdf} className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium hover:bg-muted transition-colors">
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