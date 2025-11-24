import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const InpatientTreatment = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Inpatient Treatment</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find comprehensive residential treatment programs offering 24/7 care and support for addiction recovery.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-center">
            Provider listings will appear here once the database is populated.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InpatientTreatment;
