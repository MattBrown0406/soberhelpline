import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, ArrowLeft, ExternalLink, Play, Clock, Calendar, Mic2, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import partyWreckersLogo from "@/assets/party-wreckers-logo.png";
import whenGodIntervenesLogo from "@/assets/when-god-intervenes-logo.jpeg";
import unbrokenPodcastLogo from "@/assets/unbroken-podcast-logo.png";
import logo from "@/assets/logo.png";

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
    description: "A podcast for families of addicted loved ones who are resistant to getting the help they need.",
    host: "Matt Brown",
    link: "https://partywreckers.com",
    rssFeed: "https://feeds.buzzsprout.com/1941777.rss",
    logo: partyWreckersLogo,
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    accentColor: "bg-purple-500",
    applePodcastsUrl: "https://podcasts.apple.com/us/podcast/the-party-wreckers/id1611904917",
  },
  {
    name: "The Unbroken with Sam Davis",
    description: "Inspiring stories and conversations about recovery, personal growth, and overcoming life's challenges.",
    host: "Sam Davis",
    link: "https://manroadmedia.com/",
    rssFeed: "https://feed.podbean.com/Manroadmedia/feed.xml",
    logo: unbrokenPodcastLogo,
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    accentColor: "bg-cyan-500",
  },
  {
    name: "When God Intervenes",
    description: "Stories and insights from the recovery community to inspire and support your journey.",
    host: "Darryl Rodgers",
    link: "https://thefamilyrecoverycoach.com/Podcast",
    rssFeed: "https://anchor.fm/s/fccf0970/podcast/rss",
    logo: whenGodIntervenesLogo,
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    accentColor: "bg-emerald-500",
  },
];

const RecoveryPodcasts = () => {
  const [podcastEpisodes, setPodcastEpisodes] = useState<Record<string, Episode[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAllEpisodes = async () => {
      const initialLoading: Record<string, boolean> = {};
      podcasts.forEach(podcast => {
        initialLoading[podcast.name] = true;
      });
      setLoading(initialLoading);

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
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          {/* Sound Wave Decorations */}
          <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center gap-1 opacity-20">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-white rounded-full animate-pulse"
                style={{ 
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${Math.random() * 0.5 + 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <img src={logo} alt="Sober Helpline" className="h-16 w-auto" />
          </div>

        <div className="text-center py-6">
            <div className="inline-flex items-center justify-center gap-3 mb-4 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <Radio className="w-6 h-6 text-pink-400 animate-pulse" />
              <span className="text-pink-300 font-medium">Now Streaming</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl shadow-purple-500/30">
                <Headphones className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Recovery Podcasts
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Curated podcasts featuring inspiring stories, expert advice, and support for those on their recovery journey.
            </p>
          </div>
        </div>
      </div>

      {/* Podcasts Grid */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {podcasts.map((podcast) => {
            const episodes = podcastEpisodes[podcast.name] || [];
            const isLoading = loading[podcast.name];

            return (
              <Card key={podcast.name} className="overflow-hidden border-0 shadow-2xl bg-card">
                {/* Podcast Header with Gradient */}
                <div className={`relative p-6 bg-gradient-to-r ${podcast.gradient}`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex items-center gap-4">
                    {podcast.logo ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-xl flex-shrink-0">
                        <img src={podcast.logo} alt={`${podcast.name} logo`} className="w-full h-full object-contain p-2" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0">
                        <Mic2 className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{podcast.name}</h3>
                        <div className="flex items-center gap-2">
                          {podcast.applePodcastsUrl && (
                            <a 
                              href={podcast.applePodcastsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              title="Listen on Apple Podcasts"
                            >
                            <Button size="sm" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-2">
                                <svg className="w-5 h-5" viewBox="0 0 50 50" fill="currentColor">
                                  <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 4c10.5 0 19 8.5 19 19s-8.5 19-19 19S6 35.5 6 25 14.5 6 25 6zm0 5c-4.4 0-8.3 2-11 5-.4.4-.3 1.1.1 1.4.4.4 1.1.3 1.4-.1C17.8 14.5 21.2 13 25 13s7.2 1.5 9.5 4.3c.2.2.5.4.8.4.2 0 .5-.1.7-.2.4-.4.5-1 .1-1.4-2.7-3.1-6.6-5.1-11.1-5.1zm0 6c-2.8 0-5.2 1.2-7 3.2-.4.4-.3 1 .1 1.4.4.4 1 .3 1.4-.1 1.4-1.5 3.3-2.4 5.5-2.4s4.1.9 5.5 2.4c.2.2.5.4.8.4.2 0 .5-.1.7-.2.4-.4.5-1 .1-1.4-1.8-2-4.3-3.3-7.1-3.3zm0 6c-2.2 0-4 1.8-4 4 0 1.5.8 2.7 2 3.4v9.1c0 1.1.9 2 2 2s2-.9 2-2v-9.1c1.2-.7 2-2 2-3.4 0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                                </svg>
                              </Button>
                            </a>
                          )}
                          {podcast.name !== "The Unbroken with Sam Davis" && (
                            <a 
                              href={podcast.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                                Visit Website
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-white/80 flex items-center gap-2">
                        <Mic2 className="w-4 h-4" />
                        Hosted by {podcast.host}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-muted-foreground mb-4 text-lg">{podcast.description}</p>

                  {/* Episodes Section */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Play className={`w-5 h-5 ${podcast.accentColor.replace('bg-', 'text-')}`} />
                      <h4 className="text-lg font-bold text-foreground">Recent Episodes</h4>
                    </div>
                    
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-24 bg-muted rounded-xl" />
                          </div>
                        ))}
                      </div>
                    ) : episodes.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">No episodes available</p>
                    ) : (
                      <div className="space-y-4">
                        {episodes.map((episode, index) => (
                          <div 
                            key={index} 
                            className="group relative rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 p-4 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                          >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${podcast.accentColor} rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                            
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${podcast.gradient} flex items-center justify-center shadow-md`}>
                                <Play className="w-4 h-4 text-white ml-0.5" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h5 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                  {episode.title}
                                </h5>
                                {episode.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {episode.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  {episode.pubDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(episode.pubDate).toLocaleDateString()}
                                    </span>
                                  )}
                                  {episode.duration > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {Math.floor(episode.duration / 60)} min
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <audio controls className="w-full h-10" preload="none" style={{ filter: 'hue-rotate(0deg)' }}>
                                <source src={episode.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20">
            <Headphones className="w-10 h-10 text-purple-500" />
            <p className="text-lg text-muted-foreground max-w-md">
              Listen to inspiring stories and expert advice to support your recovery journey.
            </p>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                Explore More Resources
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPodcasts;
