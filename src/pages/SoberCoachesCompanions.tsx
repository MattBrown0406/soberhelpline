import { UserCheck } from "lucide-react";

const SoberCoachesCompanions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <UserCheck className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Sober Coaches/Companions</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Find qualified sober coaches and companions to support your recovery journey.
        </p>
        {/* Provider listings will be added here */}
      </div>
    </div>
  );
};

export default SoberCoachesCompanions;
