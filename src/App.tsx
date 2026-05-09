import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import Index from "./pages/Index";
import MondayZoomRegistration from "./pages/MondayZoomRegistration";
import FamilySupport from "./pages/FamilySupport";
import StartHere from "./pages/StartHere";
import FamilyMembership from "./pages/FamilyMembership";
import FamilyConsultation from "./pages/FamilyConsultation";
import BookConsultation from "./pages/BookConsultation";
import FamilyCoaching from "./pages/FamilyCoaching";
import FamilyReadinessIntensive from "./pages/FamilyReadinessIntensive";
import InterventionHelp from "./pages/InterventionHelp";
import FromNoMoreEnabling from "./pages/FromNoMoreEnabling";
import FamilySquaresNextStep from "./pages/FamilySquaresNextStep";
import IntentLandingPage from "./pages/IntentLandingPage";
import PartnerWithSoberHelpline from "./pages/PartnerWithSoberHelpline";
import FamilyAddictionAnswers from "./pages/FamilyAddictionAnswers";

type RouteErrorBoundaryProps = {
  children: React.ReactNode;
};

type RouteErrorBoundaryState = {
  hasError: boolean;
};

class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const message = error?.message || "";
    const isPageLoadError =
      message.includes("Failed to fetch dynamically imported module") ||
      message.includes("Importing a module script failed") ||
      message.includes("Loading chunk") ||
      message.includes("ChunkLoadError");

    if (isPageLoadError && sessionStorage.getItem("route-reload-attempted") !== "true") {
      sessionStorage.setItem("route-reload-attempted", "true");
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <h1 className="mb-3 text-2xl font-semibold text-foreground">This page needs a quick refresh</h1>
          <p className="mb-6 text-muted-foreground">
            We updated the site and your browser may still be holding an older version.
          </p>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => {
              sessionStorage.removeItem("route-reload-attempted");
              window.location.reload();
            }}
          >
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy-loaded page components
const ProviderLanding = React.lazy(() => import("./pages/ProviderLanding"));
const ProviderApplication = React.lazy(() => import("./pages/ProviderApplication"));
const RecoveryPodcasts = React.lazy(() => import("./pages/RecoveryPodcasts"));
const InpatientTreatment = React.lazy(() => import("./pages/InpatientTreatment"));
const OutpatientTreatment = React.lazy(() => import("./pages/OutpatientTreatment"));
const MedicalDetox = React.lazy(() => import("./pages/MedicalDetox"));
const Interventionists = React.lazy(() => import("./pages/Interventionists"));
const SoberCoachesCompanions = React.lazy(() => import("./pages/SoberCoachesCompanions"));
const SoberLiving = React.lazy(() => import("./pages/SoberLiving"));
const Therapists = React.lazy(() => import("./pages/Therapists"));
const Psychiatrists = React.lazy(() => import("./pages/Psychiatrists"));
const Auth = React.lazy(() => import("./pages/Auth"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Admin = React.lazy(() => import("./pages/Admin"));
const SubscriptionSuccess = React.lazy(() => import("./pages/SubscriptionSuccess"));
const SubscriptionCancel = React.lazy(() => import("./pages/SubscriptionCancel"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogArticle = React.lazy(() => import("./pages/BlogArticle"));
const AddictionAssessment = React.lazy(() => import("./pages/AddictionAssessment"));
const FamilySituationAssessment = React.lazy(() => import("./pages/FamilySituationAssessment"));
const FAQs = React.lazy(() => import("./pages/FAQs"));
const FamilySupportPage = FamilySupport;
const StartHerePage = StartHere;
const UnderstandingAddiction = React.lazy(() => import("./pages/UnderstandingAddiction"));
const FamilyMembershipPage = FamilyMembership;
const FamilyEducation = React.lazy(() => import("./pages/FamilyEducation"));
const FamilyEducationTracks = React.lazy(() => import("./pages/FamilyEducationTracks"));
const FamilyForum = React.lazy(() => import("./pages/FamilyForum"));
const FamilyForumLanding = React.lazy(() => import("./pages/FamilyForumLanding"));
const FamilyConsultationPage = FamilyConsultation;
const FamilyWebinars = React.lazy(() => import("./pages/FamilyWebinars"));
const ForumTopic = React.lazy(() => import("./pages/ForumTopic"));
const TreatmentQuestions = React.lazy(() => import("./pages/TreatmentQuestions"));
const RecoveryRequirements = React.lazy(() => import("./pages/RecoveryRequirements"));
const FamilyActionPlan = React.lazy(() => import("./pages/FamilyActionPlan"));
const ScenarioExercise = React.lazy(() => import("./pages/ScenarioExercise"));
const CrisisChaos = React.lazy(() => import("./pages/CrisisChaos"));
const EmotionalRegulation = React.lazy(() => import("./pages/EmotionalRegulation"));
const ValuesExercise = React.lazy(() => import("./pages/ValuesExercise"));
const TalkingAboutTreatment = React.lazy(() => import("./pages/TalkingAboutTreatment"));
const ReadinessChecklist = React.lazy(() => import("./pages/ReadinessChecklist"));
const RelapseWarningSignsTracker = React.lazy(() => import("./pages/RelapseWarningSignsTracker"));
const CommunicationGuide = React.lazy(() => import("./pages/CommunicationGuide"));
const AftercareChecklist = React.lazy(() => import("./pages/AftercareChecklist"));
const TreatmentRedFlags = React.lazy(() => import("./pages/TreatmentRedFlags"));
const FamilyAdvocacyToolkit = React.lazy(() => import("./pages/FamilyAdvocacyToolkit"));
const WhyChangeDoesntHappen = React.lazy(() => import("./pages/WhyChangeDoesntHappen"));
const TreatmentIndustryGuide = React.lazy(() => import("./pages/TreatmentIndustryGuide"));
const DrugInducedPsychosis = React.lazy(() => import("./pages/DrugInducedPsychosis"));
const MultipleTreatmentEpisodes = React.lazy(() => import("./pages/MultipleTreatmentEpisodes"));
const LegalIssuesGuide = React.lazy(() => import("./pages/LegalIssuesGuide"));
const DiseaseChoiceRealityMap = React.lazy(() => import("./pages/DiseaseChoiceRealityMap"));
const WhyWillpowerFails = React.lazy(() => import("./pages/WhyWillpowerFails"));
const AddictionProgressionTimeline = React.lazy(() => import("./pages/AddictionProgressionTimeline"));
const MentalHealthVsSubstanceInduced = React.lazy(() => import("./pages/MentalHealthVsSubstanceInduced"));
const MisunderstoodDiagnoses = React.lazy(() => import("./pages/MisunderstoodDiagnoses"));
const MentalHealthDelaysRecovery = React.lazy(() => import("./pages/MentalHealthDelaysRecovery"));
const TraumaVsExcuses = React.lazy(() => import("./pages/TraumaVsExcuses"));
const HowTraumaShapesAddiction = React.lazy(() => import("./pages/HowTraumaShapesAddiction"));
const TreatmentModalities = React.lazy(() => import("./pages/TreatmentModalities"));
const MatchingModality = React.lazy(() => import("./pages/MatchingModality"));
const TherapyTimingGuide = React.lazy(() => import("./pages/TherapyTimingGuide"));
const FamilyInterferenceGuide = React.lazy(() => import("./pages/FamilyInterferenceGuide"));
const BoundariesUltimatumsGuide = React.lazy(() => import("./pages/BoundariesUltimatumsGuide"));
const WhatChangesWhenFamiliesChange = React.lazy(() => import("./pages/WhatChangesWhenFamiliesChange"));
const InsightBehaviorTracker = React.lazy(() => import("./pages/InsightBehaviorTracker"));
const ValuesAlignedDecisions = React.lazy(() => import("./pages/ValuesAlignedDecisions"));
const LivingWellRegardless = React.lazy(() => import("./pages/LivingWellRegardless"));
const BrainSpiritualRecovery = React.lazy(() => import("./pages/BrainSpiritualRecovery"));
const TwelveStepsExplained = React.lazy(() => import("./pages/TwelveStepsExplained"));
const NonTwelveStepModalities = React.lazy(() => import("./pages/NonTwelveStepModalities"));
const NoNegotiationGuide = React.lazy(() => import("./pages/NoNegotiationGuide"));
const StrongOneGuide = React.lazy(() => import("./pages/StrongOneGuide"));
const GuiltReliefResentmentCycle = React.lazy(() => import("./pages/GuiltReliefResentmentCycle"));
const SiblingExperience = React.lazy(() => import("./pages/SiblingExperience"));
const GrowingUpShadowAddiction = React.lazy(() => import("./pages/GrowingUpShadowAddiction"));
const SiblingGuiltAngerLoyalty = React.lazy(() => import("./pages/SiblingGuiltAngerLoyalty"));
const RebuildingSiblingRelationships = React.lazy(() => import("./pages/RebuilingSiblingRelationships"));
const ParentsRepairingSiblingSystem = React.lazy(() => import("./pages/ParentsRepairingSiblingSystem"));
const SiblingSupport = React.lazy(() => import("./pages/SiblingSupport"));
const FamilyRolesAddiction = React.lazy(() => import("./pages/FamilyRolesAddiction"));
const AddictionRewritesFamilyRules = React.lazy(() => import("./pages/AddictionRewritesFamilyRules"));
const CostOfSecrecy = React.lazy(() => import("./pages/CostOfSecrecy"));
const BoundaryDrift = React.lazy(() => import("./pages/BoundaryDrift"));
const AngerAndBoundaries = React.lazy(() => import("./pages/AngerAndBoundaries"));
const FlexibilityVsInstability = React.lazy(() => import("./pages/FlexibilityVsInstability"));
const AddictionAttachmentStyles = React.lazy(() => import("./pages/AddictionAttachmentStyles"));
const GriefForFamily = React.lazy(() => import("./pages/GriefForFamily"));
const EnablingLanguageTranslator = React.lazy(() => import("./pages/EnablingLanguageTranslator"));
const IntergenerationalEnabling = React.lazy(() => import("./pages/IntergenerationalEnabling"));
const WhoBenefitsFilter = React.lazy(() => import("./pages/WhoBenefitsFilter"));
const FamilyUnityLiability = React.lazy(() => import("./pages/FamilyUnityLiability"));
const SafeToOpenUp = React.lazy(() => import("./pages/SafeToOpenUp"));
const AddictionAsStressDisorder = React.lazy(() => import("./pages/AddictionAsStressDisorder"));
const FearInventoryExercise = React.lazy(() => import("./pages/FearInventoryExercise"));
const ConversationStartersGuide = React.lazy(() => import("./pages/ConversationStartersGuide"));
const AILifeCoach = React.lazy(() => import("./pages/AILifeCoach"));
const AIEnablingDecisionCoach = React.lazy(() => import("./pages/AIEnablingDecisionCoach"));
const AIBoundaryBuilderCoach = React.lazy(() => import("./pages/AIBoundaryBuilderCoach"));
const AITreatmentNavigator = React.lazy(() => import("./pages/AITreatmentNavigator"));
const AIRelapseResponseGuide = React.lazy(() => import("./pages/AIRelapseResponseGuide"));
const AIAddictionRealityTranslator = React.lazy(() => import("./pages/AIAddictionRealityTranslator"));
const EatingDisordersGuide = React.lazy(() => import("./pages/EatingDisordersGuide"));
const FreeGuide = React.lazy(() => import("./pages/FreeGuide"));
const ConsultationProviderDashboard = React.lazy(() => import("./pages/ConsultationProviderDashboard"));
const ForProviders = React.lazy(() => import("./pages/ForProviders"));
const BookConsultationPage = BookConsultation;
const JoinMeeting = React.lazy(() => import("./pages/JoinMeeting"));
const FamilyCoachingPage = FamilyCoaching;
const FamilyReadinessIntensivePage = FamilyReadinessIntensive;
const InterventionHelpPage = InterventionHelp;
const FromNoMoreEnablingPage = FromNoMoreEnabling;
const FamilySquaresNextStepPage = FamilySquaresNextStep;
const IntentLandingPageComponent = IntentLandingPage;
const PartnerWithSoberHelplinePage = PartnerWithSoberHelpline;
const CoachingOnboarding = React.lazy(() => import("./pages/CoachingOnboarding"));
const Testimonials = React.lazy(() => import("./pages/Testimonials"));
const RecoveryResources = React.lazy(() => import("./pages/RecoveryResources"));
const OnboardingQuiz = React.lazy(() => import("./pages/OnboardingQuiz"));
const BoundarySettingWorksheet = React.lazy(() => import("./pages/BoundarySettingWorksheet"));
const ZoomRecordings = React.lazy(() => import("./pages/ZoomRecordings"));
const RoadmapLanding = React.lazy(() => import("./pages/RoadmapLanding"));
const RoadmapAssessment = React.lazy(() => import("./pages/RoadmapAssessment"));
const RoadmapConfirmation = React.lazy(() => import("./pages/RoadmapConfirmation"));
const RoadmapCrisis = React.lazy(() => import("./pages/RoadmapCrisis"));
const RoadmapSuspicion = React.lazy(() => import("./pages/RoadmapSuspicion"));
const RoadmapPreIntervention = React.lazy(() => import("./pages/RoadmapPreIntervention"));
const RoadmapTreatment = React.lazy(() => import("./pages/RoadmapTreatment"));
const RoadmapEarlyRecovery = React.lazy(() => import("./pages/RoadmapEarlyRecovery"));
const RoadmapLongTermRecovery = React.lazy(() => import("./pages/RoadmapLongTermRecovery"));
const RoadmapRelapse = React.lazy(() => import("./pages/RoadmapRelapse"));
const RelapseRadar = React.lazy(() => import("./pages/RelapseRadar"));
const Survey = React.lazy(() => import("./pages/Survey"));
const OregonFamilySupport = React.lazy(() => import("./pages/OregonFamilySupport"));
const OregonPortlandFamilySupport = React.lazy(() => import("./pages/OregonPortlandFamilySupport"));
const WashingtonFamilySupport = React.lazy(() => import("./pages/WashingtonFamilySupport"));
const WashingtonSeattleFamilySupport = React.lazy(() => import("./pages/WashingtonSeattleFamilySupport"));
const WashingtonTacomaFamilySupport = React.lazy(() => import("./pages/WashingtonTacomaFamilySupport"));
const WashingtonSpokaneFamilySupport = React.lazy(() => import("./pages/WashingtonSpokaneFamilySupport"));
const WashingtonBellevueFamilySupport = React.lazy(() => import("./pages/WashingtonBellevueFamilySupport"));
const WashingtonEverettFamilySupport = React.lazy(() => import("./pages/WashingtonEverettFamilySupport"));
const WashingtonOlympiaFamilySupport = React.lazy(() => import("./pages/WashingtonOlympiaFamilySupport"));
const WashingtonVancouverFamilySupport = React.lazy(() => import("./pages/WashingtonVancouverFamilySupport"));
const OregonSalemFamilySupport = React.lazy(() => import("./pages/OregonSalemFamilySupport"));
const OregonEugeneFamilySupport = React.lazy(() => import("./pages/OregonEugeneFamilySupport"));
const OregonBendFamilySupport = React.lazy(() => import("./pages/OregonBendFamilySupport"));
const OregonMedfordFamilySupport = React.lazy(() => import("./pages/OregonMedfordFamilySupport"));
const OregonGreshamFamilySupport = React.lazy(() => import("./pages/OregonGreshamFamilySupport"));
const OregonHillsboroFamilySupport = React.lazy(() => import("./pages/OregonHillsboroFamilySupport"));
const CaliforniaFamilySupport = React.lazy(() => import("./pages/CaliforniaFamilySupport"));
const CaliforniaSacramentoFamilySupport = React.lazy(() => import("./pages/CaliforniaSacramentoFamilySupport"));
const CaliforniaSanFranciscoFamilySupport = React.lazy(() => import("./pages/CaliforniaSanFranciscoFamilySupport"));
const CaliforniaOaklandFamilySupport = React.lazy(() => import("./pages/CaliforniaOaklandFamilySupport"));
const CaliforniaSanJoseFamilySupport = React.lazy(() => import("./pages/CaliforniaSanJoseFamilySupport"));
const CaliforniaLosAngelesFamilySupport = React.lazy(() => import("./pages/CaliforniaLosAngelesFamilySupport"));
const CaliforniaLongBeachFamilySupport = React.lazy(() => import("./pages/CaliforniaLongBeachFamilySupport"));
const CaliforniaOrangeCountyFamilySupport = React.lazy(() => import("./pages/CaliforniaOrangeCountyFamilySupport"));
const IdahoFamilySupport = React.lazy(() => import("./pages/IdahoFamilySupport"));
const IdahoBoiseFamilySupport = React.lazy(() => import("./pages/IdahoBoiseFamilySupport"));
const IdahoNampaFamilySupport = React.lazy(() => import("./pages/IdahoNampaFamilySupport"));
const IdahoMeridianFamilySupport = React.lazy(() => import("./pages/IdahoMeridianFamilySupport"));
const UtahFamilySupport = React.lazy(() => import("./pages/UtahFamilySupport"));
const UtahSaltLakeCityFamilySupport = React.lazy(() => import("./pages/UtahSaltLakeCityFamilySupport"));
const UtahProvoFamilySupport = React.lazy(() => import("./pages/UtahProvoFamilySupport"));
const UtahOgdenFamilySupport = React.lazy(() => import("./pages/UtahOgdenFamilySupport"));
const NevadaFamilySupport = React.lazy(() => import("./pages/NevadaFamilySupport"));
const NevadaLasVegasFamilySupport = React.lazy(() => import("./pages/NevadaLasVegasFamilySupport"));
const NevadaHendersonFamilySupport = React.lazy(() => import("./pages/NevadaHendersonFamilySupport"));
const NevadaRenoFamilySupport = React.lazy(() => import("./pages/NevadaRenoFamilySupport"));
const ArizonaFamilySupport = React.lazy(() => import("./pages/ArizonaFamilySupport"));
const ArizonaPhoenixFamilySupport = React.lazy(() => import("./pages/ArizonaPhoenixFamilySupport"));
const ArizonaTucsonFamilySupport = React.lazy(() => import("./pages/ArizonaTucsonFamilySupport"));
const ArizonaScottsdaleFamilySupport = React.lazy(() => import("./pages/ArizonaScottsdaleFamilySupport"));
const ColoradoFamilySupport = React.lazy(() => import("./pages/ColoradoFamilySupport"));
const ColoradoDenverFamilySupport = React.lazy(() => import("./pages/ColoradoDenverFamilySupport"));
const ColoradoColoradoSpringsFamilySupport = React.lazy(() => import("./pages/ColoradoColoradoSpringsFamilySupport"));
const ColoradoFortCollinsFamilySupport = React.lazy(() => import("./pages/ColoradoFortCollinsFamilySupport"));
const NewMexicoFamilySupport = React.lazy(() => import("./pages/NewMexicoFamilySupport"));
const NewMexicoAlbuquerqueFamilySupport = React.lazy(() => import("./pages/NewMexicoAlbuquerqueFamilySupport"));
const NewMexicoSantaFeFamilySupport = React.lazy(() => import("./pages/NewMexicoSantaFeFamilySupport"));
const NewMexicoLasCrucesFamilySupport = React.lazy(() => import("./pages/NewMexicoLasCrucesFamilySupport"));
const TexasFamilySupport = React.lazy(() => import("./pages/TexasFamilySupport"));
const TexasHoustonFamilySupport = React.lazy(() => import("./pages/TexasHoustonFamilySupport"));
const TexasDallasFamilySupport = React.lazy(() => import("./pages/TexasDallasFamilySupport"));
const TexasAustinFamilySupport = React.lazy(() => import("./pages/TexasAustinFamilySupport"));
const TexasSanAntonioFamilySupport = React.lazy(() => import("./pages/TexasSanAntonioFamilySupport"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <RouteErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/for-providers" element={<ForProviders />} />
              <Route path="/provider-info" element={<ProviderLanding />} />
              <Route path="/provider-application" element={<ProviderApplication />} />
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
              <Route path="/how-addiction-affects-the-brain" element={<BlogArticle />} />
              <Route path="/addiction-and-mental-health" element={<BlogArticle />} />
              <Route path="/relapse-process-addiction" element={<BlogArticle />} />
              <Route path="/relapse-warning-signs-family-education" element={<BlogArticle />} />
              <Route path="/early-recovery-symptoms-family-education" element={<BlogArticle />} />
              <Route path="/treatment-to-home-transition-family-education" element={<BlogArticle />} />
              <Route path="/motivation-vs-capacity-addiction-family-education" element={<BlogArticle />} />
              <Route path="/stability-vs-recovery-families-healing" element={<BlogArticle />} />
              <Route path="/readiness-for-addiction-treatment-families" element={<BlogArticle />} />
              <Route path="/emotional-whiplash-addiction-families" element={<BlogArticle />} />
              <Route path="/sobriety-vs-recovery-families" element={<BlogArticle />} />
              <Route path="/understanding-relapse-process-not-event" element={<BlogArticle />} />
              <Route path="/personality-changes-in-addiction" element={<BlogArticle />} />
              <Route path="/triggers-explained-addiction" element={<BlogArticle />} />
              <Route path="/addiction-triggers-and-cravings-family-guide" element={<BlogArticle />} />
              <Route path="/sleep-and-addiction-recovery" element={<BlogArticle />} />
              <Route path="/attachment-styles-and-addiction" element={<BlogArticle />} />
              <Route path="/shame-and-addiction-secrecy-resistance" element={<BlogArticle />} />
              <Route path="/healing-circle-families-support-addiction-recovery" element={<BlogArticle />} />
              <Route path="/cross-addiction-substance-substitution-recovery" element={<BlogArticle />} />
              <Route path="/family-roles-addiction-divided-dynamics" element={<BlogArticle />} />
              <Route path="/holding-boundaries-addiction-families" element={<BlogArticle />} />
              <Route path="/detach-with-love-addiction-families" element={<BlogArticle />} />
              <Route path="/conflicting-professional-advice-addiction" element={<BlogArticle />} />
              <Route path="/addiction-mental-health-treatment-separation" element={<BlogArticle />} />
              <Route path="/addiction-treatment-relapse" element={<BlogArticle />} />
              <Route path="/levels-of-care-addiction-treatment" element={<BlogArticle />} />
              <Route path="/addiction-mental-health-or-both" element={<BlogArticle />} />
              <Route path="/understanding-addiction-in-families" element={<BlogArticle />} />
              <Route path="/bipolar-disorder-and-substance-use" element={<BlogArticle />} />
              <Route path="/depression-and-addiction-family-confusion" element={<BlogArticle />} />
              <Route path="/understanding-addiction-confusion-families" element={<BlogArticle />} />
              <Route path="/early-intervention-reducing-family-damage" element={<BlogArticle />} />
              <Route path="/early-intervention-family-changes-first" element={<BlogArticle />} />
              <Route path="/early-intervention-family-skill-not-crisis-response" element={<BlogArticle />} />
              <Route path="/early-intervention-stabilizing-family-first" element={<BlogArticle />} />
              <Route path="/early-intervention-families-waiting-for-crisis-weakens-everyone" element={<BlogArticle />} />
              <Route path="/early-intervention-starts-with-family" element={<BlogArticle />} />
              <Route path="/early-intervention-strengthening-family-before-crisis" element={<BlogArticle />} />
              <Route path="/alcoholism-in-the-home-why-children-adapt-long-before-adults-notice" element={<BlogArticle />} />
              <Route path="/why-families-need-support-even-when-loved-one-refuses-help" element={<BlogArticle />} />
              <Route path="/why-families-struggle-to-trust-change-after-repeated-relapses" element={<BlogArticle />} />
              <Route path="/why-families-feel-guilty-for-being-angry" element={<BlogArticle />} />
              <Route path="/why-alcohol-problems-confusing-social-drinking" element={<BlogArticle />} />
              <Route path="/why-education-not-urgency-first-thing-families-need" element={<BlogArticle />} />
              <Route path="/quiet-grief-families-experience-before-addiction-acknowledged" element={<BlogArticle />} />
              <Route path="/why-families-need-education-before-answers" element={<BlogArticle />} />
              <Route path="/mental-health-cost-families-pay-waiting-for-change" element={<BlogArticle />} />
              <Route path="/what-families-need-understand-addiction-before-crisis" element={<BlogArticle />} />
              <Route path="/families-sense-trouble-before-addiction-obvious" element={<BlogArticle />} />
              <Route path="/understanding-addiction-without-crisis-education-matters" element={<BlogArticle />} />
              <Route path="/reiner-family-tragedy-addiction-intervention" element={<BlogArticle />} />
              <Route path="/addiction-anxiety-family-burnout" element={<BlogArticle />} />
              <Route path="/tms-depression-addiction-recovery" element={<BlogArticle />} />
              <Route path="/addiction-marriage-family-protection" element={<BlogArticle />} />
              <Route path="/help-family-member-addiction" element={<BlogArticle />} />
              <Route path="/sober-helpline-free-confidential-support" element={<BlogArticle />} />
              <Route path="/genetic-risk-factors-for-addiction" element={<BlogArticle />} />
              <Route path="/how-to-talk-to-loved-one-about-addiction" element={<BlogArticle />} />
              <Route path="/addiction-assessment" element={<AddictionAssessment />} />
              <Route path="/family-situation-assessment" element={<FamilySituationAssessment />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/family-support" element={<FamilySupportPage />} />
              <Route path="/start-here" element={<StartHerePage />} />
              <Route path="/family-addiction-answers" element={<FamilyAddictionAnswers />} />
              <Route path="/family-membership" element={<FamilyMembershipPage />} />
              <Route path="/family-education" element={<FamilyEducation />} />
              <Route path="/family-education/tracks" element={<FamilyEducationTracks />} />
              <Route path="/family-forum" element={<FamilyForum />} />
              <Route path="/family-support-forum" element={<FamilyForumLanding />} />
              <Route path="/family-forum/:topicId" element={<ForumTopic />} />
              <Route path="/family-consultation" element={<FamilyConsultationPage />} />
              <Route path="/from-no-more-enabling" element={<FromNoMoreEnablingPage />} />
              <Route path="/family-squares-next-step" element={<FamilySquaresNextStepPage />} />
              <Route path="/family-addiction-consult" element={<IntentLandingPageComponent />} />
              <Route path="/intervention-readiness-consult" element={<IntentLandingPageComponent />} />
              <Route path="/addiction-family-coaching" element={<IntentLandingPageComponent />} />
              <Route path="/partner-with-sober-helpline" element={<PartnerWithSoberHelplinePage />} />
              <Route path="/family-squares" element={<MondayZoomRegistration />} />
              <Route path="/monday-zoom-registration" element={<MondayZoomRegistration />} />
              <Route path="/monday-zoom" element={<MondayZoomRegistration />} />
              <Route path="/monday-night-zoom" element={<MondayZoomRegistration />} />
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
              <Route path="/sibling-support" element={<SiblingSupport />} />
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
              <Route path="/fear-inventory-exercise" element={<FearInventoryExercise />} />
              <Route path="/conversation-starters" element={<ConversationStartersGuide />} />
              <Route path="/ai-life-coach" element={<AILifeCoach />} />
              <Route path="/ai-enabling-decision-coach" element={<AIEnablingDecisionCoach />} />
              <Route path="/ai-boundary-builder-coach" element={<AIBoundaryBuilderCoach />} />
              <Route path="/ai-treatment-navigator" element={<AITreatmentNavigator />} />
              <Route path="/ai-relapse-response-guide" element={<AIRelapseResponseGuide />} />
              <Route path="/ai-addiction-reality-translator" element={<AIAddictionRealityTranslator />} />
              <Route path="/eating-disorders-guide" element={<EatingDisordersGuide />} />
              <Route path="/free-guide" element={<FreeGuide />} />
              <Route path="/consultation-provider-dashboard" element={<ConsultationProviderDashboard />} />
              <Route path="/book-consultation" element={<BookConsultationPage />} />
              <Route path="/join-meeting" element={<JoinMeeting />} />
              <Route path="/family-coaching" element={<FamilyCoachingPage />} />
              <Route path="/family-readiness-intensive" element={<FamilyReadinessIntensivePage />} />
              <Route path="/intervention-help" element={<InterventionHelpPage />} />
              <Route path="/coaching-onboarding" element={<CoachingOnboarding />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/recovery-resources" element={<RecoveryResources />} />
              <Route path="/onboarding-quiz" element={<OnboardingQuiz />} />
              <Route path="/boundary-setting-worksheet" element={<BoundarySettingWorksheet />} />
              <Route path="/zoom-recordings" element={<ZoomRecordings />} />
              <Route path="/roadmap" element={<RoadmapLanding />} />
              <Route path="/roadmap/assessment" element={<RoadmapAssessment />} />
              <Route path="/roadmap/confirmation" element={<RoadmapConfirmation />} />
              <Route path="/roadmap/crisis" element={<RoadmapCrisis />} />
              <Route path="/roadmap/suspicion" element={<RoadmapSuspicion />} />
              <Route path="/roadmap/pre-intervention" element={<RoadmapPreIntervention />} />
              <Route path="/roadmap/treatment" element={<RoadmapTreatment />} />
              <Route path="/roadmap/early-recovery" element={<RoadmapEarlyRecovery />} />
              <Route path="/roadmap/long-term-recovery" element={<RoadmapLongTermRecovery />} />
              <Route path="/roadmap/relapse" element={<RoadmapRelapse />} />
              <Route path="/relapse-radar" element={<RelapseRadar />} />
              <Route path="/survey" element={<Survey />} />
              {/* Washington Family Support SEO Pages */}
              <Route path="/washington-family-support" element={<WashingtonFamilySupport />} />
              <Route path="/washington/seattle" element={<WashingtonSeattleFamilySupport />} />
              <Route path="/washington/tacoma" element={<WashingtonTacomaFamilySupport />} />
              <Route path="/washington/spokane" element={<WashingtonSpokaneFamilySupport />} />
              <Route path="/washington/bellevue" element={<WashingtonBellevueFamilySupport />} />
              <Route path="/washington/everett" element={<WashingtonEverettFamilySupport />} />
              <Route path="/washington/olympia" element={<WashingtonOlympiaFamilySupport />} />
              <Route path="/washington/vancouver" element={<WashingtonVancouverFamilySupport />} />
              {/* California Family Support SEO Pages */}
              <Route path="/california-family-support" element={<CaliforniaFamilySupport />} />
              <Route path="/california/sacramento" element={<CaliforniaSacramentoFamilySupport />} />
              <Route path="/california/san-francisco" element={<CaliforniaSanFranciscoFamilySupport />} />
              <Route path="/california/oakland" element={<CaliforniaOaklandFamilySupport />} />
              <Route path="/california/san-jose" element={<CaliforniaSanJoseFamilySupport />} />
              <Route path="/california/los-angeles" element={<CaliforniaLosAngelesFamilySupport />} />
              <Route path="/california/long-beach" element={<CaliforniaLongBeachFamilySupport />} />
              <Route path="/california/orange-county" element={<CaliforniaOrangeCountyFamilySupport />} />
              {/* Idaho Family Support SEO Pages */}
              <Route path="/idaho-family-support" element={<IdahoFamilySupport />} />
              <Route path="/idaho/boise" element={<IdahoBoiseFamilySupport />} />
              <Route path="/idaho/nampa" element={<IdahoNampaFamilySupport />} />
              <Route path="/idaho/meridian" element={<IdahoMeridianFamilySupport />} />
              {/* Utah Family Support SEO Pages */}
              <Route path="/utah-family-support" element={<UtahFamilySupport />} />
              <Route path="/utah/salt-lake-city" element={<UtahSaltLakeCityFamilySupport />} />
              <Route path="/utah/provo" element={<UtahProvoFamilySupport />} />
              <Route path="/utah/ogden" element={<UtahOgdenFamilySupport />} />
              {/* Nevada Family Support SEO Pages */}
              <Route path="/nevada-family-support" element={<NevadaFamilySupport />} />
              <Route path="/nevada/las-vegas" element={<NevadaLasVegasFamilySupport />} />
              <Route path="/nevada/henderson" element={<NevadaHendersonFamilySupport />} />
              <Route path="/nevada/reno" element={<NevadaRenoFamilySupport />} />
              {/* Arizona Family Support SEO Pages */}
              <Route path="/arizona-family-support" element={<ArizonaFamilySupport />} />
              <Route path="/arizona/phoenix" element={<ArizonaPhoenixFamilySupport />} />
              <Route path="/arizona/tucson" element={<ArizonaTucsonFamilySupport />} />
              <Route path="/arizona/scottsdale" element={<ArizonaScottsdaleFamilySupport />} />
              {/* Colorado Family Support SEO Pages */}
              <Route path="/colorado-family-support" element={<ColoradoFamilySupport />} />
              <Route path="/colorado/denver" element={<ColoradoDenverFamilySupport />} />
              <Route path="/colorado/colorado-springs" element={<ColoradoColoradoSpringsFamilySupport />} />
              <Route path="/colorado/fort-collins" element={<ColoradoFortCollinsFamilySupport />} />
              {/* New Mexico Family Support SEO Pages */}
              <Route path="/new-mexico-family-support" element={<NewMexicoFamilySupport />} />
              <Route path="/new-mexico/albuquerque" element={<NewMexicoAlbuquerqueFamilySupport />} />
              <Route path="/new-mexico/santa-fe" element={<NewMexicoSantaFeFamilySupport />} />
              <Route path="/new-mexico/las-cruces" element={<NewMexicoLasCrucesFamilySupport />} />
              {/* Texas Family Support SEO Pages */}
              <Route path="/texas-family-support" element={<TexasFamilySupport />} />
              <Route path="/texas/houston" element={<TexasHoustonFamilySupport />} />
              <Route path="/texas/dallas" element={<TexasDallasFamilySupport />} />
              <Route path="/texas/austin" element={<TexasAustinFamilySupport />} />
              <Route path="/texas/san-antonio" element={<TexasSanAntonioFamilySupport />} />
              {/* Oregon Family Support SEO Pages */}
              <Route path="/oregon-family-support" element={<OregonFamilySupport />} />
              <Route path="/oregon/portland" element={<OregonPortlandFamilySupport />} />
              <Route path="/oregon/salem" element={<OregonSalemFamilySupport />} />
              <Route path="/oregon/eugene" element={<OregonEugeneFamilySupport />} />
              <Route path="/oregon/bend" element={<OregonBendFamilySupport />} />
              <Route path="/oregon/medford" element={<OregonMedfordFamilySupport />} />
              <Route path="/oregon/gresham" element={<OregonGreshamFamilySupport />} />
              <Route path="/oregon/hillsboro" element={<OregonHillsboroFamilySupport />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
