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
          <Route path="/customer-summary" element={<CustomerSummaryPage />} />
          <Route path="/rm-issues" element={<RmIssueCenterPage />} />
          <Route path="/action-items" element={<ActionItemsPage />} />
          <Route path="/key-dates" element={<KeyDatesPage />} />
          <Route path="/renewals" element={<RenewalsPage />} />
          <Route path="/customers/:customerSlug" element={<CustomerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
