import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertTriangle, Heart, Lightbulb, Target, CheckCircle2, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import { Helmet } from "react-helmet-async";
import RelatedResources from "@/components/RelatedResources";
import ToolBrandHeader from "@/components/ToolBrandHeader";

interface Fear {
  id: string;
  category: string;
  fear: string;
  reality: string;
}

const commonFears: Fear[] = [
  // Boundaries fears
  {
    id: "b1",
    category: "Setting Boundaries",
    fear: "If I set a boundary, they'll never speak to me again.",
    reality: "Boundaries often improve relationships over time by establishing mutual respect. The temporary distance can lead to healthier connection."
  },
  {
    id: "b2",
    category: "Setting Boundaries",
    fear: "They'll overdose or die if I stop helping.",
    reality: "Continuing to shield someone from consequences often prolongs addiction. Recovery frequently begins when natural consequences are felt."
  },
  {
    id: "b3",
    category: "Setting Boundaries",
    fear: "I'll be seen as heartless or uncaring by other family members.",
    reality: "Setting boundaries is an act of love, not abandonment. Those who understand addiction will recognize this—and others may eventually learn."
  },
  {
    id: "b4",
    category: "Setting Boundaries",
    fear: "They'll become homeless and it will be my fault.",
    reality: "Adults make their own choices. Your boundary doesn't cause homelessness—their choices do. Homelessness is sometimes the reality check needed."
  },
  // Communication fears
  {
    id: "c1",
    category: "Talking Differently About Addiction",
    fear: "If I name it as addiction, they'll shut down completely.",
    reality: "Avoiding the truth keeps everyone stuck. Naming addiction clearly and compassionately can open doors to honest conversation."
  },
  {
    id: "c2",
    category: "Talking Differently About Addiction",
    fear: "Saying I'm worried will push them away.",
    reality: "Expressing genuine concern from a place of love, not control, often lands more softly than we expect."
  },
  {
    id: "c3",
    category: "Talking Differently About Addiction",
    fear: "They'll use what I say against me later.",
    reality: "Manipulation may happen, but honest communication plants seeds. Truth spoken in love is never wasted—even if not immediately received."
  },
  // Treatment fears
  {
    id: "t1",
    category: "Offering Treatment",
    fear: "Treatment won't work—they've failed before.",
    reality: "Relapse is common in recovery. Multiple treatment attempts are often part of the journey. Each attempt builds awareness and skills."
  },
  {
    id: "t2",
    category: "Offering Treatment",
    fear: "We can't afford treatment.",
    reality: "Many options exist: insurance coverage, state-funded programs, sliding scale fees, scholarships. The path may require research, but options exist."
  },
  {
    id: "t3",
    category: "Offering Treatment",
    fear: "They'll refuse and I'll feel like I failed.",
    reality: "Offering help is not a failure. Your job is to present options, not force outcomes. Planting the seed matters."
  },
  {
    id: "t4",
    category: "Offering Treatment",
    fear: "Treatment will change them into someone I don't recognize.",
    reality: "Recovery often restores the person you knew before addiction took hold. The change you fear may be the return you've been hoping for."
  },
  // Intervention fears
  {
    id: "i1",
    category: "Considering an Intervention",
    fear: "An intervention will destroy our relationship forever.",
    reality: "Interventions done with love and professional guidance often strengthen relationships by breaking denial and creating a path forward."
  },
  {
    id: "i2",
    category: "Considering an Intervention",
    fear: "They'll feel ambushed and hate everyone involved.",
    reality: "Initial anger is common but usually temporary. Most people in recovery later express gratitude for the intervention."
  },
  {
    id: "i3",
    category: "Considering an Intervention",
    fear: "What if the intervention doesn't work?",
    reality: "No single action guarantees recovery, but intervention breaks through denial. Even if they don't accept help immediately, a seed is planted."
  },
  {
    id: "i4",
    category: "Considering an Intervention",
    fear: "Other family members won't participate and it will cause a family rift.",
    reality: "You cannot control others' participation. Moving forward with those who are willing models healthy action and may inspire others later."
  },
];

const categories = ["Setting Boundaries", "Talking Differently About Addiction", "Offering Treatment", "Considering an Intervention"];

const FearInventoryExercise = () => {
  useGuideTracking("/fear-inventory-exercise", "Fear Inventory Exercise");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFears, setSelectedFears] = useState<string[]>([]);
  const [customFears, setCustomFears] = useState<string>("");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const steps = [
    { title: "Introduction", icon: Heart },
    { title: "Identify Your Fears", icon: AlertTriangle },
    { title: "Examine Each Fear", icon: Lightbulb },
    { title: "The Truth About Fear", icon: Target },
    { title: "Your Commitment", icon: CheckCircle2 },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleFearToggle = (fearId: string) => {
    setSelectedFears(prev => 
      prev.includes(fearId) 
        ? prev.filter(id => id !== fearId)
        : [...prev, fearId]
    );
  };

  const getSelectedFearObjects = () => {
    return commonFears.filter(fear => selectedFears.includes(fear.id));
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedFears([]);
    setCustomFears("");
    setReflections({});
    setShowResults(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <ToolBrandHeader
              title="Fear Inventory Exercise"
              subtitle="Identify the fears holding you back, examine whether they're based in reality, and choose courage over fear-driven paralysis."
              clinicalNote="Inspired by the 4th Step inventory process from 12-Step recovery and adapted with CBT fear-hierarchy techniques for family members."
            />
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every family facing a loved one's addiction wrestles with fear. These fears feel protective—they seem to keep us safe from conflict, rejection, or worse outcomes. But too often, <strong>fear becomes the very thing that prevents us from taking actions that could save a life.</strong>
              </p>
              <Card className="border-logo-green/30 bg-logo-green/5 my-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-logo-green" />
                    What This Exercise Will Help You Do
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Identify the specific fears holding you back</li>
                    <li>• Examine whether those fears are based in likely reality</li>
                    <li>• Recognize how fear prevents helpful action</li>
                    <li>• Choose courage over fear-driven paralysis</li>
                  </ul>
                </CardContent>
              </Card>

              <p className="text-muted-foreground">
                This is not about ignoring real risks or being reckless. It's about distinguishing between <em>legitimate caution</em> and <em>fear-based avoidance</em> that keeps everyone stuck.
              </p>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                  <strong>Remember:</strong> The fears that feel most protective are often the ones keeping you from the very actions that could help your loved one find recovery.
                </p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <p className="text-muted-foreground">
              Review the common fears below. Check every fear that resonates with you—even a little. Being honest here is essential.
            </p>

            {categories.map(category => (
              <div key={category} className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2">
                  {category}
                </h3>
                <div className="space-y-3">
                  {commonFears.filter(f => f.category === category).map(fear => (
                    <label 
                      key={fear.id}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-logo-green/50 hover:bg-muted/50 cursor-pointer transition-all"
                    >
                      <Checkbox
                        checked={selectedFears.includes(fear.id)}
                        onCheckedChange={() => handleFearToggle(fear.id)}
                        className="mt-0.5"
                      />
                      <span className="text-foreground">{fear.fear}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="font-semibold text-lg text-foreground">Other Fears</h3>
              <p className="text-sm text-muted-foreground">
                Are there other fears not listed above? Write them here:
              </p>
              <Textarea
                value={customFears}
                onChange={(e) => setCustomFears(e.target.value)}
                placeholder="I'm also afraid that..."
                className="min-h-[100px]"
              />
            </div>

            {selectedFears.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  You've identified <strong className="text-foreground">{selectedFears.length} fear{selectedFears.length !== 1 ? 's' : ''}</strong> to examine. This takes courage—well done.
                </p>
              </div>
            )}
          </div>
        );

      case 2: {
        const selectedFearObjects = getSelectedFearObjects();
        
        if (selectedFearObjects.length === 0) {
          return (
            <div className="text-center py-12 space-y-4">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">No Fears Selected</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Go back and select at least one fear to examine. Being honest about our fears is the first step to moving past them.
              </p>
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          );
        }
        return (
          <div className="space-y-8">
            <p className="text-muted-foreground">
              Now let's examine each fear you identified. For each one, consider the reality check provided and reflect on your own experience.
            </p>

            {selectedFearObjects.map((fear, index) => (
              <Card key={fear.id} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{fear.category}</p>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        "{fear.fear}"
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-logo-green/5 border border-logo-green/20 rounded-lg p-4">
                    <h4 className="font-medium text-logo-green flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      Reality Check
                    </h4>
                    <p className="text-sm text-foreground">{fear.reality}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Your Reflection: What evidence do you have that this fear is likely to come true?
                    </label>
                    <Textarea
                      value={reflections[fear.id] || ""}
                      onChange={(e) => setReflections(prev => ({ ...prev, [fear.id]: e.target.value }))}
                      placeholder="When I think about this fear honestly, I realize..."
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      }

      case 3:
        return (
          <div className="space-y-8">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Truth About Fear</h3>
                    <p className="text-muted-foreground">
                      Most of our fears are about <strong>future events that haven't happened and may never happen</strong>. We create vivid mental movies of worst-case scenarios and then live as if they're certain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-amber-500/30">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Fear Says:
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• "Don't rock the boat"</li>
                    <li>• "You'll make things worse"</li>
                    <li>• "Wait until they're ready"</li>
                    <li>• "Keep the peace at all costs"</li>
                    <li>• "What will people think?"</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-logo-green/30">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-logo-green" />
                    Love Says:
                  </h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• "Speak truth with compassion"</li>
                    <li>• "Take action despite uncertainty"</li>
                    <li>• "Create healthy conditions for change"</li>
                    <li>• "Model recovery-oriented behavior"</li>
                    <li>• "Do what's right, not what's easy"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-foreground">A Critical Question:</h4>
              <p className="text-lg text-foreground italic">
                "What if doing nothing—because of fear—costs your loved one their life?"
              </p>
              <p className="text-muted-foreground">
                The worst-case scenario families fear often isn't the consequence of action—it's the consequence of <em>continued inaction</em>. Addiction is progressive and potentially fatal. The loving action you fear taking today may be the very thing that opens a door tomorrow.
              </p>
            </div>

            <Card className="border-logo-green/30 bg-logo-green/5">
              <CardContent className="p-6">
                <h4 className="font-semibold text-foreground mb-3">The Paradox of Loving Action</h4>
                <p className="text-muted-foreground">
                  Fear tells us that protective inaction keeps our loved one safe. But the opposite is often true: <strong>The actions we avoid because of fear are frequently the very actions that can save a life.</strong>
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                  <li>✓ Setting boundaries creates space for growth</li>
                  <li>✓ Honest conversations break through denial</li>
                  <li>✓ Offering treatment shows you believe in recovery</li>
                  <li>✓ Interventions disrupt the deadly status quo</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center pb-6">
              <div className="w-16 h-16 rounded-full bg-logo-green/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-logo-green" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">Your Commitment</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                You've identified your fears and examined whether they're based in reality. Now it's time to choose courage over fear.
              </p>
            </div>

            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-semibold text-foreground">Reflect and Respond:</h4>
                <p className="text-sm text-muted-foreground">
                  What is ONE action you've been avoiding because of fear? What would it look like to take that step this week?
                </p>
                <Textarea
                  value={reflections["commitment"] || ""}
                  onChange={(e) => setReflections(prev => ({ ...prev, commitment: e.target.value }))}
                  placeholder="The action I've been avoiding is... I could take this step by..."
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-logo-green/10 to-primary/10 rounded-lg p-6 border border-logo-green/20">
              <h4 className="font-semibold text-foreground mb-4 text-center">An Affirmation for Families</h4>
              <p className="text-center text-foreground italic text-lg">
                "I choose to act from love, not fear. I cannot control outcomes, but I can control my willingness to do what's right. I release the need for certainty and embrace the courage to try."
              </p>
            </div>

            {!showResults && (
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-logo-green hover:bg-logo-green/90"
                  onClick={() => setShowResults(true)}
                >
                  Complete Exercise
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {showResults && (
              <Card className="border-logo-green bg-logo-green/5">
                <CardContent className="p-6 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-logo-green mx-auto" />
                  <h4 className="text-xl font-semibold text-foreground">Exercise Complete</h4>
                  <p className="text-muted-foreground">
                    You've taken an important step in understanding how fear affects your decisions. Remember: courage isn't the absence of fear—it's taking action despite fear.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button variant="outline" onClick={handleRestart}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Over
                    </Button>
                    <Button 
                      className="bg-logo-green hover:bg-logo-green/90"
                      onClick={() => window.print()}
                    >
                      Print Your Work
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Fear Inventory Exercise | What Are We Afraid Will Happen? | Sober Helpline</title>
        <meta name="description" content="An interactive exercise helping families identify and examine fears that prevent them from taking action. Discover how fear holds families back from setting boundaries, offering treatment, and considering intervention." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                What Are We Afraid Will Happen?
              </h1>
              <p className="text-muted-foreground">A Fear Inventory Exercise for Families</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-8 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              return (
                <button
                  key={index}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex flex-col items-center gap-2 min-w-[80px] transition-all ${
                    isActive ? 'scale-110' : ''
                  } ${index > currentStep ? 'opacity-40' : 'cursor-pointer'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isComplete ? 'bg-logo-green text-white' :
                    isActive ? 'bg-logo-green/20 text-logo-green border-2 border-logo-green' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium text-center ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          {!showResults && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === steps.length - 1}
                className="bg-logo-green hover:bg-logo-green/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Companion Resources */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Related Resources</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <a href="/boundaries-ultimatums" className="block p-4 rounded-lg border border-border hover:border-logo-green/50 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-foreground">Boundaries vs. Ultimatums</h4>
                <p className="text-sm text-muted-foreground">Learn the difference and how to set healthy limits</p>
              </a>
              <a href="/values-exercise" className="block p-4 rounded-lg border border-border hover:border-logo-green/50 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-foreground">Values Clarification Exercise</h4>
                <p className="text-sm text-muted-foreground">Reconnect with what matters most to guide your decisions</p>
              </a>
              <a href="/enabling-language-translator" className="block p-4 rounded-lg border border-border hover:border-logo-green/50 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-foreground">Enabling Language Translator</h4>
                <p className="text-sm text-muted-foreground">Transform enabling responses into supportive ones</p>
              </a>
              <a href="/what-changes-when-families-change" className="block p-4 rounded-lg border border-border hover:border-logo-green/50 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium text-foreground">What Changes When Families Change</h4>
                <p className="text-sm text-muted-foreground">Understanding the power of family transformation</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <RelatedResources currentPath="/fear-inventory-exercise" />
    </>
  );
};

export default FearInventoryExercise;
