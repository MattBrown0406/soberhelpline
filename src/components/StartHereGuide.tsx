import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Shield, Heart, Scale, TreePine, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEducationProgress } from "@/hooks/useEducationProgress";

const startingPath = [
  {
    step: 1,
    title: "Understand What You're Dealing With",
    description: "Learn the science behind addiction — why your loved one acts the way they do.",
    icon: Brain,
    color: "emerald",
    resources: [
      { name: "Understanding Addiction", path: "/understanding-addiction" },
      { name: "Why Willpower Fails", path: "/why-willpower-fails" },
      { name: "Disease vs Choice Reality Map", path: "/disease-choice-reality-map" },
    ]
  },
  {
    step: 2,
    title: "Recognize Your Own Patterns",
    description: "Discover how addiction has changed YOUR behavior without you realizing it.",
    icon: Heart,
    color: "rose",
    resources: [
      { name: "Enabling vs Helping Decision Tree", path: "/family-action-plan" },
      { name: "Enabling Self-Assessment", path: "/enabling-language-translator" },
      { name: "What Changes When Families Change", path: "/what-changes-when-families-change" },
    ]
  },
  {
    step: 3,
    title: "Set Your First Boundaries",
    description: "Learn the difference between boundaries and ultimatums — and how to enforce them.",
    icon: Shield,
    color: "blue",
    resources: [
      { name: "Boundaries vs Ultimatums", path: "/boundaries-ultimatums" },
      { name: "Boundary Setting Worksheet", path: "/family-action-plan" },
      { name: "Anger & Boundaries", path: "/anger-and-boundaries" },
    ]
  },
  {
    step: 4,
    title: "Take Care of Yourself",
    description: "You can't pour from an empty cup. Start your own healing journey.",
    icon: TreePine,
    color: "amber",
    resources: [
      { name: "Living Well Regardless", path: "/living-well-regardless" },
      { name: "Self-Care Worksheet", path: "/emotional-regulation" },
      { name: "Grief for Families", path: "/grief-for-family" },
    ]
  },
];

const StartHereGuide = () => {
  const { isCompleted } = useEducationProgress();

  return (
    <div className="bg-gradient-to-br from-logo-green/5 via-white to-emerald-50 rounded-2xl border border-logo-green/20 p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-logo-green/10">
          <BookOpen className="w-5 h-5 text-logo-blue" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">New Here? Start With This Path</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6 ml-12">
        Don't know where to begin? Follow these 4 steps in order. Each builds on the last.
      </p>

      <div className="space-y-4">
        {startingPath.map((step) => (
          <div key={step.step} className="flex gap-4">
            {/* Step Number */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full bg-logo-green text-white text-sm font-bold flex items-center justify-center`}>
                {step.step}
              </div>
              {step.step < startingPath.length && (
                <div className="w-0.5 flex-1 bg-logo-green/20 mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <step.icon className="w-4 h-4 text-logo-blue" />
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{step.description}</p>
              <div className="flex flex-wrap gap-2">
                {step.resources.map((resource) => {
                  const completed = isCompleted(resource.path);
                  return (
                    <Link key={resource.path} to={resource.path}>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                        completed
                          ? "bg-emerald-100 text-emerald-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}>
                        {completed && <CheckCircle className="w-3 h-3" />}
                        {resource.name}
                        {!completed && <ArrowRight className="w-3 h-3" />}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz banner */}
      <Link to="/onboarding-quiz" className="block mt-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-800/40 hover:border-emerald-600/60 transition-colors">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-gray-200">
              Want a more personalized path? <span className="font-semibold text-emerald-400">Take our 2-minute quiz →</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StartHereGuide;
