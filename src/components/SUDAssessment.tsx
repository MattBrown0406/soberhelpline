import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ClipboardList, ChevronRight, RotateCcw, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Link } from "react-router-dom";

const timeframeOptions = [
  { value: "never", label: "Never", score: 0 },
  { value: "past", label: "In the past, but not in the last 12 months", score: 0 },
  { value: "sometimes", label: "Sometimes in the last 12 months", score: 1 },
  { value: "often", label: "Often in the last 12 months", score: 1 },
];

// DSM-5 criteria organized by category
const criteriaCategories = [
  {
    name: "Impaired Control",
    description: "These criteria relate to the inability to control substance use.",
    criteria: [
      {
        id: 1,
        question: "Has your loved one taken the substance in larger amounts or over a longer period than was intended?",
        example: "For example: They planned to have 'just one drink' but ended up drinking all night, or they intended to use for a weekend but continued for weeks."
      },
      {
        id: 2,
        question: "Has your loved one expressed a persistent desire or made unsuccessful efforts to cut down or control substance use?",
        example: "For example: They've said they want to quit or cut back multiple times, made promises to stop, or tried to set rules for themselves that they couldn't follow."
      },
      {
        id: 3,
        question: "Does your loved one spend a great deal of time obtaining, using, or recovering from the substance?",
        example: "For example: Significant time spent finding dealers, drinking/using, being hungover, or recovering from the effects of use."
      },
      {
        id: 4,
        question: "Has your loved one experienced cravings or a strong desire or urge to use the substance?",
        example: "For example: They talk about needing to use, seem preoccupied with when they can use next, or become agitated when they can't use."
      }
    ]
  },
  {
    name: "Social Impairment",
    description: "These criteria relate to how substance use affects relationships and responsibilities.",
    criteria: [
      {
        id: 5,
        question: "Has substance use resulted in failure to fulfill major role obligations at work, school, or home?",
        example: "For example: Missing work, poor performance, suspensions, neglecting children or household responsibilities, failing classes."
      },
      {
        id: 6,
        question: "Has your loved one continued using despite having persistent social or relationship problems caused or worsened by the substance?",
        example: "For example: Continuing to drink despite arguments with spouse about drinking, or using despite losing friends or damaging family relationships."
      },
      {
        id: 7,
        question: "Has your loved one given up or reduced important social, occupational, or recreational activities because of substance use?",
        example: "For example: No longer participating in hobbies, sports, spending time with family, or activities they used to enjoy."
      }
    ]
  },
  {
    name: "Risky Use",
    description: "These criteria relate to dangerous patterns of use.",
    criteria: [
      {
        id: 8,
        question: "Has your loved one used the substance in situations where it is physically hazardous?",
        example: "For example: Driving while intoxicated, operating machinery while impaired, using in dangerous locations, or mixing substances dangerously."
      },
      {
        id: 9,
        question: "Has your loved one continued use despite knowing they have a physical or psychological problem likely caused or worsened by the substance?",
        example: "For example: Continuing to drink despite liver problems, using despite worsening depression or anxiety, or ignoring health warnings from doctors."
      }
    ]
  },
  {
    name: "Pharmacological Indicators",
    description: "These criteria relate to physical dependence on the substance.",
    criteria: [
      {
        id: 10,
        question: "Has your loved one developed tolerance (needing more of the substance to achieve the same effect, or diminished effect with the same amount)?",
        example: "For example: They need to drink much more than before to feel drunk, or their usual amount no longer has the same effect."
      },
      {
        id: 11,
        question: "Has your loved one experienced withdrawal symptoms when not using, or used the substance to relieve or avoid withdrawal?",
        example: "For example: Shaking, sweating, nausea, anxiety, insomnia when not using, or drinking/using first thing in the morning to 'feel normal.'"
      }
    ]
  }
];

const allCriteria = criteriaCategories.flatMap(cat => cat.criteria);

export default function SUDAssessment() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0=intro, 1-4=categories, 5=results
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const calculateScore = () => {
    let criteriaMet = 0;
    Object.values(answers).forEach(answer => {
      if (answer === "sometimes" || answer === "often") {
        criteriaMet++;
      }
    });
    return criteriaMet;
  };

  const getSeverity = (score: number) => {
    if (score === 0) return { level: "No Diagnosis", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/30" };
    if (score === 1) return { level: "Subclinical", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/30" };
    if (score >= 2 && score <= 3) return { level: "Mild SUD", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/30" };
    if (score >= 4 && score <= 5) return { level: "Moderate SUD", color: "text-orange-600", bgColor: "bg-orange-50 dark:bg-orange-950/30" };
    return { level: "Severe SUD", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/30" };
  };

  const getRecommendations = (score: number) => {
    if (score === 0) {
      return {
        summary: "Based on your responses, your loved one does not currently meet the DSM-5 criteria for Substance Use Disorder.",
        recommendations: [
          "Continue to maintain open communication about substance use",
          "Stay informed about warning signs of problematic use",
          "Consider whether there are other concerns that brought you here",
          "Trust your instincts—if something feels wrong, it may be worth exploring further"
        ],
        nextSteps: "If you still have concerns despite these results, consider speaking with a professional. Early intervention is always valuable."
      };
    }
    if (score === 1) {
      return {
        summary: "Your loved one shows one criterion, which is subclinical (below the diagnostic threshold). However, this may indicate early warning signs.",
        recommendations: [
          "Monitor the situation closely for any changes or escalation",
          "Have open, non-judgmental conversations about your concerns",
          "Learn more about addiction and enabling behaviors",
          "Consider family education resources to prepare yourself"
        ],
        nextSteps: "Early intervention is often the most effective. Consider exploring our family education resources to learn more."
      };
    }
    if (score >= 2 && score <= 3) {
      return {
        summary: "Your loved one meets criteria for Mild Substance Use Disorder. This is a diagnosable condition that benefits from intervention.",
        recommendations: [
          "Encourage your loved one to speak with a healthcare provider or addiction specialist",
          "Outpatient treatment or counseling may be appropriate at this stage",
          "Mutual support groups (AA, NA, SMART Recovery) can be helpful",
          "Family education and support is crucial—learn about boundaries and enabling",
          "Consider a professional assessment to confirm and guide treatment"
        ],
        nextSteps: "Early treatment at the mild stage has the highest success rates. The condition is likely to progress without intervention."
      };
    }
    if (score >= 4 && score <= 5) {
      return {
        summary: "Your loved one meets criteria for Moderate Substance Use Disorder. This level typically requires professional treatment.",
        recommendations: [
          "A professional assessment by an addiction specialist is strongly recommended",
          "Intensive Outpatient Program (IOP) or Partial Hospitalization may be appropriate",
          "Explore whether medical detox might be needed based on the substance",
          "Family involvement in treatment significantly improves outcomes",
          "Learn about intervention options if your loved one is resistant to help",
          "Establish clear boundaries to avoid enabling the addiction"
        ],
        nextSteps: "Moderate SUD rarely improves without treatment. Consider consulting with an interventionist if your loved one won't seek help voluntarily."
      };
    }
    return {
      summary: "Your loved one meets criteria for Severe Substance Use Disorder. This is a serious medical condition requiring comprehensive treatment.",
      recommendations: [
        "Seek immediate professional help—this level of severity requires treatment",
        "Medical detox may be necessary, especially for alcohol, benzodiazepines, or opioids",
        "Residential/inpatient treatment is often recommended for severe SUD",
        "A professional intervention may be needed if your loved one won't accept help",
        "Family members should seek their own support (Al-Anon, Nar-Anon, therapy)",
        "Safety planning is essential—know the signs of overdose and have Narcan if appropriate",
        "Long-term aftercare and sober living should be part of the treatment plan"
      ],
      nextSteps: "Severe SUD is life-threatening and progressive. Without treatment, the prognosis is poor. Please reach out to a professional interventionist or treatment center as soon as possible."
    };
  };

  const isCurrentCategoryComplete = () => {
    if (currentStep === 0 || currentStep > 4) return true;
    const category = criteriaCategories[currentStep - 1];
    return category.criteria.every(c => answers[c.id] !== undefined);
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
  };

  const renderIntro = () => (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">About This Assessment</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This assessment is based on the <strong>DSM-5 criteria for Substance Use Disorder (SUD)</strong>, 
          the diagnostic standard used by healthcare professionals. It helps families understand whether 
          their loved one's substance use may meet clinical criteria for a diagnosis.
        </p>
        <div className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 p-3 rounded border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Important:</strong> This is a screening tool for family members, not a clinical diagnosis. 
            Only a qualified healthcare professional can provide an official diagnosis. Your observations 
            are valuable, but may not capture the full picture.
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium">What you'll assess:</h4>
        <ul className="space-y-2 text-sm">
          {criteriaCategories.map((cat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong>{cat.name}:</strong> {cat.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">How scoring works:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <strong>0-1 criteria:</strong> No diagnosis / Subclinical</li>
          <li>• <strong>2-3 criteria:</strong> Mild Substance Use Disorder</li>
          <li>• <strong>4-5 criteria:</strong> Moderate Substance Use Disorder</li>
          <li>• <strong>6+ criteria:</strong> Severe Substance Use Disorder</li>
        </ul>
      </div>

      <Button onClick={() => setCurrentStep(1)} className="w-full">
        Begin Assessment <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderCategory = (categoryIndex: number) => {
    const category = criteriaCategories[categoryIndex];
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Section {categoryIndex + 1} of 4
            </span>
          </div>
          <h3 className="text-lg font-semibold text-primary">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>

        <div className="space-y-6">
          {category.criteria.map((criterion) => (
            <div key={criterion.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
              <p className="font-medium">{criterion.question}</p>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 p-2 rounded">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{criterion.example}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeframeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={answers[criterion.id] === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnswers({ ...answers, [criterion.id]: option.value })}
                    className="justify-start text-left h-auto py-2 px-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!isCurrentCategoryComplete()}
            className="flex-1"
          >
            {currentStep === 4 ? "View Results" : "Next Section"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    const severity = getSeverity(score);
    const recommendations = getRecommendations(score);

    // Count criteria met per category
    const categoryResults = criteriaCategories.map(cat => ({
      name: cat.name,
      met: cat.criteria.filter(c => answers[c.id] === "sometimes" || answers[c.id] === "often").length,
      total: cat.criteria.length
    }));

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg text-center ${severity.bgColor}`}>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Assessment Result</h3>
          <p className={`text-2xl font-bold ${severity.color}`}>{severity.level}</p>
          <p className="text-lg mt-1">{score} of 11 criteria met</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryResults.map((cat, idx) => (
            <div key={idx} className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-xs font-medium text-muted-foreground">{cat.name}</p>
              <p className="text-lg font-semibold">{cat.met}/{cat.total}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">What This Means</h4>
            <p className="text-sm">{recommendations.summary}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Recommended Steps</h4>
            <ul className="space-y-2">
              {recommendations.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <p className="text-sm">{recommendations.nextSteps}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Remember:</strong> This assessment reflects your observations as a family member. 
            A professional evaluation is essential for an accurate diagnosis and treatment recommendations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={resetAssessment} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Again
          </Button>
          <Link to="/family-membership" className="flex-1">
            <Button className="w-full">
              Learn About Family Resources
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  if (!isExpanded) {
    return (
      <Card 
        className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent cursor-pointer hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300" 
        onClick={() => setIsExpanded(true)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-lg">Is My Loved One Addicted?</CardTitle>
                <CardDescription>A DSM-5 based assessment for families</CardDescription>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Use this clinical screening tool to understand whether your loved one's substance use meets the 
            diagnostic criteria for Substance Use Disorder. Based on DSM-5 and ASAM guidelines.
          </p>
          <div className="flex flex-wrap gap-4 text-sm mb-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              11 clinical criteria
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Severity scoring
            </span>
          </div>
          <Button className="w-full sm:w-auto">
            Start the Assessment <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg">Is My Loved One Addicted?</CardTitle>
              <CardDescription>A DSM-5 based assessment for families</CardDescription>
            </div>
          </div>
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 0 && renderIntro()}
        {currentStep >= 1 && currentStep <= 4 && renderCategory(currentStep - 1)}
        {currentStep === 5 && renderResults()}
      </CardContent>
    </Card>
  );
}
