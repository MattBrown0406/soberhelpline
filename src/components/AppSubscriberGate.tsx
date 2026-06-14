import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

export default function AppSubscriberGate() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-logo-blue/10">
            <Smartphone className="h-7 w-7 text-logo-blue" />
          </div>
          <CardTitle className="text-2xl">This content is for SoberHelpline app subscribers</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Open the SoberHelpline app and tap <strong>Learn</strong> to access over 60 educational exercises.
        </CardContent>
      </Card>
    </div>
  );
}
