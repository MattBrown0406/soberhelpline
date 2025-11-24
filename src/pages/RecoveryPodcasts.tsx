import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Episode {
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  pubDate: string;
}

const podcasts = [
  {
    name: "The Party Wreckers Podcast",
    description: "Real conversations about recovery, sobriety, and living life beyond addiction.",
    host: "The Party Wreckers",
    link: "https://www.thepartywreckerspodcast.com/",
  },
];

const RecoveryPodcasts = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-podcast-feed');
        
        if (error) {
          console.error('Error fetching episodes:', error);
        } else if (data?.episodes) {
          setEpisodes(data.episodes);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);
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
          <>
            {podcasts.map((podcast) => (
              <Card key={podcast.name} className="p-6 hover:shadow-lg transition-shadow flex flex-col mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <Headphones className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-semibold text-foreground">{podcast.name}</h3>
                </div>
                <p className="text-muted-foreground mb-3">{podcast.description}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">Host:</span> {podcast.host}
                </p>
                <a 
                  href={podcast.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mb-6"
                >
                  <Button variant="outline" className="w-full gap-2">
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold mb-4">Recent Episodes</h4>
                  
                  {loading ? (
                    <p className="text-muted-foreground">Loading episodes...</p>
                  ) : episodes.length === 0 ? (
                    <p className="text-muted-foreground">No episodes available</p>
                  ) : (
                    <div className="space-y-4">
                      {episodes.map((episode, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <h5 className="font-medium text-foreground">{episode.title}</h5>
                          {episode.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {episode.description}
                            </p>
                          )}
                          <audio controls className="w-full">
                            <source src={episode.audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                          {episode.pubDate && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(episode.pubDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RecoveryPodcasts;
