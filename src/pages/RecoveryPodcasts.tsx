import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const podcasts: any[] = [];

const RecoveryPodcasts = () => {
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
            <Headphones className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Recovery Podcasts</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated podcasts featuring inspiring stories, expert advice, and support for those on their recovery journey.
          </p>
        </div>

        {podcasts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No podcasts yet. Add your own podcasts here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <Card key={podcast.name} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <Headphones className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold text-foreground">{podcast.name}</h3>
                </div>
                <p className="text-muted-foreground mb-3 flex-grow">{podcast.description}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Host:</span> {podcast.host}
                </p>
                <a 
                  href={podcast.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <Button variant="outline" className="w-full gap-2">
                    Listen Now
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryPodcasts;
