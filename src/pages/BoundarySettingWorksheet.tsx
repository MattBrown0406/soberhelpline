import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import BoundaryWorksheet from "@/components/BoundaryWorksheet";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const BoundarySettingWorksheet = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <>
      <SEOHead
        title="Boundary Setting Worksheet | Sober Helpline"
        description="A free, interactive worksheet to help families set healthy boundaries with loved ones struggling with addiction."
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Boundary Setting Worksheet
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Use this interactive worksheet to identify, define, and strengthen healthy boundaries with your loved one.
            </p>
          </div>
          {user ? (
            <BoundaryWorksheet user={user} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sign in to save your worksheet progress.</p>
              <BoundaryWorksheet user={{ id: "anonymous" } as User} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BoundarySettingWorksheet;
