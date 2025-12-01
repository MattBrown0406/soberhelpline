import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

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
            Use the resources below to assess whether you or a loved one may be struggling with substance use disorder.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              We are currently developing comprehensive addiction assessment tools and resources. 
              Check back soon for self-assessment questionnaires, educational materials, and guidance 
              on understanding the signs of substance use disorder.
            </p>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              In the meantime, if you or a loved one is struggling, please reach out for help.
            </p>
            <a href="tel:5412415886">
              <Button size="lg" className="font-semibold">
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
