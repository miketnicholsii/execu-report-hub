import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PortfolioPage from "@/pages/PortfolioPage";
import CustomerPage from "@/pages/CustomerPage";
import NotFound from "@/pages/NotFound";
import CustomerSummaryPage from "@/pages/CustomerSummaryPage";
import ActionItemsPage from "@/pages/ActionItemsPage";
import KeyDatesPage from "@/pages/KeyDatesPage";
import RenewalsPage from "@/pages/RenewalsPage";
import RmIssueCenterPage from "@/pages/RmIssueCenterPage";
import MeetingMinutesPage from "@/pages/MeetingMinutesPage";
import TrackerPage from "@/pages/TrackerPage";
import RedmineReportBuilderPage from "@/pages/RedmineReportBuilderPage";
import ReportCenterPage from "@/pages/ReportCenterPage";
import InitiativeDetailPage from "@/pages/InitiativeDetailPage";
import WeeklySummaryPage from "@/pages/WeeklySummaryPage";
import WikiPage from "@/pages/WikiPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/portfolio" replace />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/weekly-summaries" element={<WeeklySummaryPage />} />
          <Route path="/customer-summary" element={<CustomerSummaryPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/rm-issues" element={<RmIssueCenterPage />} />
          <Route path="/rm-report-builder" element={<RedmineReportBuilderPage />} />
          <Route path="/action-items" element={<ActionItemsPage />} />
          <Route path="/key-dates" element={<KeyDatesPage />} />
          <Route path="/renewals" element={<RenewalsPage />} />
          <Route path="/meeting-minutes" element={<MeetingMinutesPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/reports" element={<ReportCenterPage />} />
          <Route path="/customers/:customerSlug" element={<CustomerPage />} />
          <Route path="/initiatives/:projectId" element={<InitiativeDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
