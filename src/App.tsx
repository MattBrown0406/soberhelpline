import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ProviderInfo from "./pages/ProviderInfo";
import RecoveryPodcasts from "./pages/RecoveryPodcasts";
import InpatientTreatment from "./pages/InpatientTreatment";
import OutpatientTreatment from "./pages/OutpatientTreatment";
import MedicalDetox from "./pages/MedicalDetox";
import Interventionists from "./pages/Interventionists";
import SoberCoachesCompanions from "./pages/SoberCoachesCompanions";
import SoberLiving from "./pages/SoberLiving";
import Therapists from "./pages/Therapists";
import Psychiatrists from "./pages/Psychiatrists";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import AddictionAssessment from "./pages/AddictionAssessment";
import FAQs from "./pages/FAQs";
import FamilySupport from "./pages/FamilySupport";
import UnderstandingAddiction from "./pages/UnderstandingAddiction";
import FamilyMembership from "./pages/FamilyMembership";
import FamilyVideos from "./pages/FamilyVideos";
import FamilyForum from "./pages/FamilyForum";
import FamilyConsultation from "./pages/FamilyConsultation";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/provider-info" element={<ProviderInfo />} />
            <Route path="/recovery-podcasts" element={<RecoveryPodcasts />} />
            <Route path="/inpatient-treatment" element={<InpatientTreatment />} />
            <Route path="/outpatient-treatment" element={<OutpatientTreatment />} />
            <Route path="/medical-detox" element={<MedicalDetox />} />
            <Route path="/interventionists" element={<Interventionists />} />
            <Route path="/sober-coaches-companions" element={<SoberCoachesCompanions />} />
            <Route path="/sober-living" element={<SoberLiving />} />
            <Route path="/therapists" element={<Therapists />} />
            <Route path="/psychiatrists" element={<Psychiatrists />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogArticle />} />
            <Route path="/fentanyl-overdose-signs-safety-plan" element={<BlogArticle />} />
            <Route path="/parents-addicted-adult-children" element={<BlogArticle />} />
            <Route path="/addiction-assessment" element={<AddictionAssessment />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/family-support" element={<FamilySupport />} />
            <Route path="/family-membership" element={<FamilyMembership />} />
            <Route path="/family-videos" element={<FamilyVideos />} />
            <Route path="/family-forum" element={<FamilyForum />} />
            <Route path="/family-consultation" element={<FamilyConsultation />} />
            <Route path="/understanding-addiction" element={<UnderstandingAddiction />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
