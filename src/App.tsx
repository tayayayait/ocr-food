import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import OcrResultPage from "@/pages/OcrResultPage";
import AnalysisPage from "@/pages/AnalysisPage";
import HistoryPage from "@/pages/HistoryPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOcrPage from "@/pages/admin/AdminOcrPage";
import AdminKeywordsPage from "@/pages/admin/AdminKeywordsPage";
import AdminStatsPage from "@/pages/admin/AdminStatsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result/:id" element={<OcrResultPage />} />
            <Route path="/analysis/:id" element={<AnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ocr" element={<AdminOcrPage />} />
            <Route path="/admin/keywords" element={<AdminKeywordsPage />} />
            <Route path="/admin/stats" element={<AdminStatsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
