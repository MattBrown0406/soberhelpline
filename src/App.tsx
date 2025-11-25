import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProviderInfo from "./pages/ProviderInfo";
import RecoveryPodcasts from "./pages/RecoveryPodcasts";
import InpatientTreatment from "./pages/InpatientTreatment";
import OutpatientTreatment from "./pages/OutpatientTreatment";
import Interventionists from "./pages/Interventionists";
import SoberCoachesCompanions from "./pages/SoberCoachesCompanions";
import SoberLiving from "./pages/SoberLiving";
import Therapists from "./pages/Therapists";
import Psychiatrists from "./pages/Psychiatrists";
import Attorneys from "./pages/Attorneys";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/provider-info" element={<ProviderInfo />} />
          <Route path="/recovery-podcasts" element={<RecoveryPodcasts />} />
          <Route path="/inpatient-treatment" element={<InpatientTreatment />} />
          <Route path="/outpatient-treatment" element={<OutpatientTreatment />} />
          <Route path="/interventionists" element={<Interventionists />} />
          <Route path="/sober-coaches-companions" element={<SoberCoachesCompanions />} />
          <Route path="/sober-living" element={<SoberLiving />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/psychiatrists" element={<Psychiatrists />} />
          <Route path="/attorneys" element={<Attorneys />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
