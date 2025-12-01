import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

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
];

const AddictionAssessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <img src={logo} alt="Sober Helpline" className="mx-auto mb-6 w-48 md:w-64 h-auto" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Addiction Assessment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the signs of addiction is the first step toward recovery. 
            Use the questions below to assess whether your loved one may be struggling with substance use disorder.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-lg mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 text-center">
              10 Key Questions to Ask Yourself
            </h2>
            
            <ol className="space-y-4">
              {questions.map((question, index) => (
                <li key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-foreground leading-relaxed pt-1">{question}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-accent rounded-lg p-6 md:p-8 text-center">
            <p className="text-foreground font-medium mb-4 text-lg">
              Answering "yes" to several of these questions suggests addiction may be present.
            </p>
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
