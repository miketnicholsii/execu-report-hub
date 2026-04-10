import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PortfolioPage from "@/pages/PortfolioPage";
import ExecutiveStatusPage from "@/pages/ExecutiveStatusPage";
import ExecutiveStatusPrintPage from "@/pages/ExecutiveStatusPrintPage";
import CustomerPage from "@/pages/CustomerPage";
import CustomerTrackerPage from "@/pages/CustomerTrackerPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/status" replace />} />
          <Route path="/status" element={<ExecutiveStatusPage />} />
          <Route path="/status/print" element={<ExecutiveStatusPrintPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/customers/:customerSlug" element={<CustomerPage />} />
          <Route path="/customers/:customerSlug/tracker" element={<CustomerTrackerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
