import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { useGuideTracking } from "@/hooks/useGuideTracking";
import SEOHead from "@/components/SEOHead";

const questions = [
  "Has my loved one tried to cut back or stop using substances but failed repeatedly?",
  "Do they use more of the substance than intended or spend excessive time obtaining, using, or recovering from it?",
  "Have they become moody, irritable, anxious, or shown sudden personality changes?",
  "Are they neglecting work, school, family duties, or hobbies they once enjoyed?",
  "Have their relationships with family and friends deteriorated, with increased isolation or secrecy?",
  "Do they engage in risky behaviors, like driving under the influence or legal/financial troubles?",
  "Have I noticed physical signs such as weight changes, bloodshot eyes, tremors, or frequent illness?",
  "Does their substance use continue despite causing health issues, arguments, or other clear harm?",
  "Are they defensive, in denial, or making excuses when confronted about their use?",
  "Have I been covering for them, paying bills, or shielding them from consequences of their actions?",
  "Have they experienced withdrawal symptoms (shaking, sweating, nausea, anxiety, insomnia) when not using?",
];

const AddictionAssessment = () => {
  useGuideTracking("Addiction Assessment", "/addiction-assessment");
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(questions.length).fill(false));

  const handleCheckChange = (index: number, checked: boolean) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = checked;
    setCheckedItems(newCheckedItems);
  };

  const totalChecked = checkedItems.filter(Boolean).length;
  const isDefensiveOrInDenial = checkedItems[8]; // Question 9: defensive/denial question
  const hasWithdrawalSymptoms = checkedItems[10]; // Question 11: withdrawal symptoms

  const getCareLevelWithDetox = (baseLevel: string) => {
    if (hasWithdrawalSymptoms && !baseLevel.includes("Medical Detox")) {
      return `Medical Detox / ${baseLevel}`;
    }
    return baseLevel;
  };

  const getSeverity = (count: number) => {
    if (count >= 6) return { 
      label: "Severe", 
      color: "text-red-600",
      careLevel: "Interventionist / Medical Detox / Inpatient Treatment"
    };
    if (count >= 4) return { 
      label: "Moderate", 
      color: "text-orange-500",
      careLevel: getCareLevelWithDetox(isDefensiveOrInDenial ? "Interventionist / Inpatient Treatment" : "Outpatient Treatment")
    };
    if (count >= 2) return { 
      label: "Mild", 
      color: "text-yellow-600",
      careLevel: getCareLevelWithDetox(isDefensiveOrInDenial ? "Interventionist / Therapists / Outpatient Treatment" : "Therapists / Outpatient Treatment")
    };
    return { 
      label: "Below threshold", 
      color: "text-muted-foreground",
      careLevel: hasWithdrawalSymptoms ? "Medical Detox / Education & Support Groups" : "Education & Support Groups"
    };
  };

  const severity = getSeverity(totalChecked);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Addiction Assessment Tool | Sober Helpline"
        description="Use our free addiction assessment tool to evaluate if your loved one may be struggling with substance use disorder. Get personalized care level recommendations."
      />
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <img src={logo} alt="Sober Helpline" className="w-24 md:w-32 h-auto" />
        </div>

        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Addiction Assessment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            In the United States, about 54.2 million people needed treatment for a substance use disorder in 2023, but only about 23% (12.5 million) of those received treatment during the past year. This gap (41.7 million) demonstrates how most people struggling with addiction do not get the help they need.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base mt-4">
            Use the questions below to assess whether your loved one may be struggling with substance use disorder.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 text-center">
              10 Key Questions to Ask Yourself
            </h2>
            
            <ol className="space-y-4">
              {questions.map((question, index) => (
                <li key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-foreground leading-relaxed flex-1">{question}</p>
                  <Checkbox
                    checked={checkedItems[index]}
                    onCheckedChange={(checked) => handleCheckChange(index, checked as boolean)}
                    className="w-6 h-6 flex-shrink-0"
                  />
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-accent rounded-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 text-sm md:text-base text-foreground">
                <p className="leading-relaxed">
                  According to the DSM (Diagnostic and Statistical Manual) answering "yes" to several suggests addiction may be present. Over a 12-month period, a person qualifies for an SUD (substance use disorder) diagnosis by meeting at least 2 of the 10 criteria, with severity graded as <strong>mild (2-3 criteria)</strong>, <strong>moderate (4-5)</strong>, or <strong>severe (6+)</strong>.
                </p>
              </div>
              <div className="flex-shrink-0 bg-card rounded-lg p-6 shadow-md text-center min-w-[200px]">
                <p className="text-sm text-muted-foreground mb-2">Questions Checked</p>
                <p className="text-4xl font-bold text-primary mb-2">{totalChecked}</p>
                <p className={`text-sm font-semibold ${severity.color}`}>
                  {severity.label}
                </p>
                {totalChecked >= 2 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Recommended Level of Care</p>
                    <p className="text-sm font-semibold text-primary">{severity.careLevel}</p>
                  </div>
                )}
              </div>
            </div>
            {totalChecked >= 2 && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  <strong>Recommendation:</strong>{" "}
                  {totalChecked >= 6 && (
                    <>A professional interventionist is strongly recommended to help your loved one accept treatment. Medical detox with 24/7 supervision followed by inpatient treatment is appropriate for this level of severity.</>
                  )}
                  {totalChecked >= 4 && totalChecked < 6 && (
                    <>
                      {isDefensiveOrInDenial 
                        ? `Because your loved one appears defensive or in denial about their use, a professional interventionist and inpatient treatment are recommended.${hasWithdrawalSymptoms ? " Medical detox is also strongly recommended due to the presence of withdrawal symptoms." : ""}`
                        : `Outpatient treatment or intensive outpatient (IOP) is recommended. Structured therapy and support are important at this stage.${hasWithdrawalSymptoms ? " Medical detox is strongly recommended due to the presence of withdrawal symptoms." : ""}`}
                    </>
                  )}
                  {totalChecked >= 2 && totalChecked < 4 && (
                    <>
                      {isDefensiveOrInDenial
                        ? `Because your loved one appears defensive or in denial, consulting with a professional interventionist may help. Individual therapy and/or outpatient treatment is also recommended.${hasWithdrawalSymptoms ? " Medical detox is strongly recommended due to the presence of withdrawal symptoms." : ""}`
                        : `Individual therapy with a licensed therapist experienced in substance use disorders and/or outpatient treatment may be beneficial.${hasWithdrawalSymptoms ? " Medical detox is strongly recommended due to the presence of withdrawal symptoms." : ""}`}
                    </>
                  )}
                </p>
                {totalChecked < 6 && (
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>Recovery Support:</strong> Participation in recovery fellowships can provide ongoing peer support:{" "}
                    <a href="https://www.aa.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AA</a>,{" "}
                    <a href="https://na.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NA</a>,{" "}
                    <a href="https://www.smartrecovery.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SMART Recovery</a>, or{" "}
                    <a href="https://www.refugerecovery.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Refuge Recovery</a>.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg p-6 md:p-8 text-center shadow-lg">
            <p className="text-muted-foreground mb-6">
              Professional assessment is the next step for intervention and support.
            </p>
            <a href="tel:5412415886">
              <Button size="lg" className="font-semibold flex items-center gap-2 mx-auto">
                <Phone className="w-4 h-4" />
                Call Us: (541) 241-5886
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddictionAssessment;
