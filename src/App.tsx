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
import FamilyEducation from "./pages/FamilyEducation";
import FamilyForum from "./pages/FamilyForum";
import FamilyConsultation from "./pages/FamilyConsultation";
import FamilyWebinars from "./pages/FamilyWebinars";
import ForumTopic from "./pages/ForumTopic";
import TreatmentQuestions from "./pages/TreatmentQuestions";
import RecoveryRequirements from "./pages/RecoveryRequirements";
import FamilyActionPlan from "./pages/FamilyActionPlan";
import ScenarioExercise from "./pages/ScenarioExercise";
import CrisisChaos from "./pages/CrisisChaos";
import EmotionalRegulation from "./pages/EmotionalRegulation";
import ValuesExercise from "./pages/ValuesExercise";
import TalkingAboutTreatment from "./pages/TalkingAboutTreatment";
import ReadinessChecklist from "./pages/ReadinessChecklist";
import RelapseWarningSignsTracker from "./pages/RelapseWarningSignsTracker";
import CommunicationGuide from "./pages/CommunicationGuide";
import AftercareChecklist from "./pages/AftercareChecklist";
import TreatmentRedFlags from "./pages/TreatmentRedFlags";
import FamilyAdvocacyToolkit from "./pages/FamilyAdvocacyToolkit";
import WhyChangeDoesntHappen from "./pages/WhyChangeDoesntHappen";
import TreatmentIndustryGuide from "./pages/TreatmentIndustryGuide";
import DrugInducedPsychosis from "./pages/DrugInducedPsychosis";
import MultipleTreatmentEpisodes from "./pages/MultipleTreatmentEpisodes";
import LegalIssuesGuide from "./pages/LegalIssuesGuide";
import DiseaseChoiceRealityMap from "./pages/DiseaseChoiceRealityMap";
import WhyWillpowerFails from "./pages/WhyWillpowerFails";
import AddictionProgressionTimeline from "./pages/AddictionProgressionTimeline";
import MentalHealthVsSubstanceInduced from "./pages/MentalHealthVsSubstanceInduced";
import MisunderstoodDiagnoses from "./pages/MisunderstoodDiagnoses";
import MentalHealthDelaysRecovery from "./pages/MentalHealthDelaysRecovery";
import TraumaVsExcuses from "./pages/TraumaVsExcuses";
import HowTraumaShapesAddiction from "./pages/HowTraumaShapesAddiction";
import TreatmentModalities from "./pages/TreatmentModalities";
import MatchingModality from "./pages/MatchingModality";
import TherapyTimingGuide from "./pages/TherapyTimingGuide";
import FamilyInterferenceGuide from "./pages/FamilyInterferenceGuide";
import BoundariesUltimatumsGuide from "./pages/BoundariesUltimatumsGuide";
import WhatChangesWhenFamiliesChange from "./pages/WhatChangesWhenFamiliesChange";
import InsightBehaviorTracker from "./pages/InsightBehaviorTracker";
import ValuesAlignedDecisions from "./pages/ValuesAlignedDecisions";
import LivingWellRegardless from "./pages/LivingWellRegardless";
import BrainSpiritualRecovery from "./pages/BrainSpiritualRecovery";
import TwelveStepsExplained from "./pages/TwelveStepsExplained";
import NonTwelveStepModalities from "./pages/NonTwelveStepModalities";
import NoNegotiationGuide from "./pages/NoNegotiationGuide";
import StrongOneGuide from "./pages/StrongOneGuide";
import GuiltReliefResentmentCycle from "./pages/GuiltReliefResentmentCycle";
import SiblingExperience from "./pages/SiblingExperience";
import GrowingUpShadowAddiction from "./pages/GrowingUpShadowAddiction";
import SiblingGuiltAngerLoyalty from "./pages/SiblingGuiltAngerLoyalty";
import RebuildingSiblingRelationships from "./pages/RebuilingSiblingRelationships";
import ParentsRepairingSiblingSystem from "./pages/ParentsRepairingSiblingSystem";
import FamilyRolesAddiction from "./pages/FamilyRolesAddiction";
import AddictionRewritesFamilyRules from "./pages/AddictionRewritesFamilyRules";
import CostOfSecrecy from "./pages/CostOfSecrecy";
import BoundaryDrift from "./pages/BoundaryDrift";
import AngerAndBoundaries from "./pages/AngerAndBoundaries";
import FlexibilityVsInstability from "./pages/FlexibilityVsInstability";
import AddictionAttachmentStyles from "./pages/AddictionAttachmentStyles";
import GriefForFamily from "./pages/GriefForFamily";
import EnablingLanguageTranslator from "./pages/EnablingLanguageTranslator";
import IntergenerationalEnabling from "./pages/IntergenerationalEnabling";
import WhoBenefitsFilter from "./pages/WhoBenefitsFilter";
import FamilyUnityLiability from "./pages/FamilyUnityLiability";
import SafeToOpenUp from "./pages/SafeToOpenUp";
import AddictionAsStressDisorder from "./pages/AddictionAsStressDisorder";
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
            <Route path="/addiction-grandchildren-boundaries" element={<BlogArticle />} />
            <Route path="/addiction-assessment" element={<AddictionAssessment />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/family-support" element={<FamilySupport />} />
            <Route path="/family-membership" element={<FamilyMembership />} />
            <Route path="/family-education" element={<FamilyEducation />} />
            <Route path="/family-forum" element={<FamilyForum />} />
            <Route path="/family-forum/:topicId" element={<ForumTopic />} />
            <Route path="/family-consultation" element={<FamilyConsultation />} />
            <Route path="/family-webinars" element={<FamilyWebinars />} />
            <Route path="/treatment-questions" element={<TreatmentQuestions />} />
            <Route path="/recovery-requirements" element={<RecoveryRequirements />} />
            <Route path="/family-action-plan" element={<FamilyActionPlan />} />
            <Route path="/scenario-exercise" element={<ScenarioExercise />} />
            <Route path="/crisis-chaos" element={<CrisisChaos />} />
            <Route path="/emotional-regulation" element={<EmotionalRegulation />} />
            <Route path="/values-exercise" element={<ValuesExercise />} />
            <Route path="/talking-about-treatment" element={<TalkingAboutTreatment />} />
            <Route path="/readiness-checklist" element={<ReadinessChecklist />} />
            <Route path="/relapse-warning-signs" element={<RelapseWarningSignsTracker />} />
            <Route path="/communication-guide" element={<CommunicationGuide />} />
            <Route path="/aftercare-checklist" element={<AftercareChecklist />} />
            <Route path="/treatment-red-flags" element={<TreatmentRedFlags />} />
            <Route path="/family-advocacy-toolkit" element={<FamilyAdvocacyToolkit />} />
            <Route path="/understanding-addiction" element={<UnderstandingAddiction />} />
            <Route path="/why-change-doesnt-happen" element={<WhyChangeDoesntHappen />} />
            <Route path="/treatment-industry-guide" element={<TreatmentIndustryGuide />} />
            <Route path="/drug-induced-psychosis" element={<DrugInducedPsychosis />} />
            <Route path="/multiple-treatment-episodes" element={<MultipleTreatmentEpisodes />} />
            <Route path="/legal-issues-guide" element={<LegalIssuesGuide />} />
            <Route path="/disease-choice-reality-map" element={<DiseaseChoiceRealityMap />} />
            <Route path="/why-willpower-fails" element={<WhyWillpowerFails />} />
            <Route path="/addiction-progression-timeline" element={<AddictionProgressionTimeline />} />
            <Route path="/mental-health-vs-substance-induced" element={<MentalHealthVsSubstanceInduced />} />
            <Route path="/misunderstood-diagnoses" element={<MisunderstoodDiagnoses />} />
            <Route path="/mental-health-delays-recovery" element={<MentalHealthDelaysRecovery />} />
            <Route path="/trauma-vs-excuses" element={<TraumaVsExcuses />} />
            <Route path="/how-trauma-shapes-addiction" element={<HowTraumaShapesAddiction />} />
            <Route path="/treatment-modalities" element={<TreatmentModalities />} />
            <Route path="/matching-modality" element={<MatchingModality />} />
            <Route path="/therapy-timing" element={<TherapyTimingGuide />} />
            <Route path="/family-interference" element={<FamilyInterferenceGuide />} />
            <Route path="/boundaries-ultimatums" element={<BoundariesUltimatumsGuide />} />
            <Route path="/what-changes-when-families-change" element={<WhatChangesWhenFamiliesChange />} />
            <Route path="/insight-behavior-tracker" element={<InsightBehaviorTracker />} />
            <Route path="/values-aligned-decisions" element={<ValuesAlignedDecisions />} />
            <Route path="/living-well-regardless" element={<LivingWellRegardless />} />
            <Route path="/brain-spiritual-recovery" element={<BrainSpiritualRecovery />} />
            <Route path="/twelve-steps-explained" element={<TwelveStepsExplained />} />
            <Route path="/non-twelve-step-modalities" element={<NonTwelveStepModalities />} />
            <Route path="/no-negotiation" element={<NoNegotiationGuide />} />
            <Route path="/strong-one" element={<StrongOneGuide />} />
            <Route path="/guilt-relief-resentment" element={<GuiltReliefResentmentCycle />} />
            <Route path="/sibling-experience" element={<SiblingExperience />} />
            <Route path="/growing-up-shadow" element={<GrowingUpShadowAddiction />} />
            <Route path="/sibling-guilt-anger-loyalty" element={<SiblingGuiltAngerLoyalty />} />
            <Route path="/rebuilding-sibling-relationships" element={<RebuildingSiblingRelationships />} />
            <Route path="/parents-repairing-sibling-system" element={<ParentsRepairingSiblingSystem />} />
            <Route path="/family-roles-addiction" element={<FamilyRolesAddiction />} />
            <Route path="/addiction-rewrites-family-rules" element={<AddictionRewritesFamilyRules />} />
            <Route path="/cost-of-secrecy" element={<CostOfSecrecy />} />
            <Route path="/boundary-drift" element={<BoundaryDrift />} />
            <Route path="/anger-and-boundaries" element={<AngerAndBoundaries />} />
            <Route path="/flexibility-vs-instability" element={<FlexibilityVsInstability />} />
            <Route path="/addiction-attachment-styles" element={<AddictionAttachmentStyles />} />
            <Route path="/grief-for-family" element={<GriefForFamily />} />
            <Route path="/enabling-language-translator" element={<EnablingLanguageTranslator />} />
            <Route path="/intergenerational-enabling" element={<IntergenerationalEnabling />} />
            <Route path="/who-benefits-filter" element={<WhoBenefitsFilter />} />
            <Route path="/family-unity-liability" element={<FamilyUnityLiability />} />
            <Route path="/safe-to-open-up" element={<SafeToOpenUp />} />
            <Route path="/addiction-as-stress-disorder" element={<AddictionAsStressDisorder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
