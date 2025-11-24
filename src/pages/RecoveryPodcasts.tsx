import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import partyWreckersLogo from "@/assets/party-wreckers-logo.png";

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
    host: "Matt Brown",
    link: "https://partywreckers.com",
    rssFeed: "https://feeds.buzzsprout.com/1941777.rss",
    logo: partyWreckersLogo,
  },
  {
    name: "The Unbroken with Sam Davis",
    description: "Inspiring stories and conversations about recovery, personal growth, and overcoming life's challenges.",
    host: "Sam Davis",
    link: "https://manroadmedia.com/",
    rssFeed: "https://feed.podbean.com/Manroadmedia/feed.xml",
  },
];

const RecoveryPodcasts = () => {
  const [podcastEpisodes, setPodcastEpisodes] = useState<Record<string, Episode[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAllEpisodes = async () => {
      // Initialize loading state for all podcasts
      const initialLoading: Record<string, boolean> = {};
      podcasts.forEach(podcast => {
        initialLoading[podcast.name] = true;
      });
      setLoading(initialLoading);

      // Fetch episodes for each podcast
      for (const podcast of podcasts) {
        try {
          const { data, error } = await supabase.functions.invoke('fetch-podcast-feed', {
            body: { feedUrl: podcast.rssFeed }
          });
          
          if (error) {
            console.error(`Error fetching episodes for ${podcast.name}:`, error);
          } else if (data?.episodes) {
            setPodcastEpisodes(prev => ({
              ...prev,
              [podcast.name]: data.episodes
            }));
          }
        } catch (error) {
          console.error(`Error fetching ${podcast.name}:`, error);
        } finally {
          setLoading(prev => ({
            ...prev,
            [podcast.name]: false
          }));
        }
      }
    };

    fetchAllEpisodes();
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

        <div className="grid grid-cols-1 gap-8">
          {podcasts.map((podcast) => {
            const episodes = podcastEpisodes[podcast.name] || [];
            const isLoading = loading[podcast.name];

            return (
              <Card key={podcast.name} className="p-6 hover:shadow-lg transition-shadow">
                {podcast.logo && (
                  <div className="mb-4 flex justify-center">
                    <img src={podcast.logo} alt={`${podcast.name} logo`} className="h-32 w-32 object-contain rounded-lg" />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-4">
                  {!podcast.logo && <Headphones className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-foreground">{podcast.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium">Host:</span> {podcast.host}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{podcast.description}</p>
                
                {podcast.name !== "The Unbroken with Sam Davis" && (
                  <a 
                    href={podcast.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mb-6"
                  >
                    <Button variant="outline" className="gap-2">
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold mb-4">Recent Episodes</h4>
                  
                  {isLoading ? (
                    <p className="text-muted-foreground">Loading episodes...</p>
                  ) : episodes.length === 0 ? (
                    <p className="text-muted-foreground">No episodes available</p>
                  ) : (
                    <div className="space-y-4">
                      {episodes.map((episode, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3 bg-card">
                          <h5 className="font-medium text-foreground">{episode.title}</h5>
                          {episode.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {episode.description}
                            </p>
                          )}
                          <audio controls className="w-full" preload="none">
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecoveryPodcasts;
