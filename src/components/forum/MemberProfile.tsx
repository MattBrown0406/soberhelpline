import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserBadges } from "./UserBadges";
import { Calendar, MessageCircle, Award, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface MemberProfileProps {
  userId: string;
  displayName: string;
  children?: React.ReactNode;
}

interface ProfileData {
  id: string;
  username: string | null;
  first_name: string;
  created_at: string | null;
}

interface UserPost {
  id: string;
  topic_id: string;
  title: string | null;
  content: string;
  created_at: string;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  awarded_at: string;
}

export function MemberProfile({ userId, displayName, children }: MemberProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, username, first_name, created_at')
          .eq('id', userId)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }

        // Fetch post count and recent posts
        const { data: postsData, count } = await supabase
          .from('forum_posts')
          .select('id, topic_id, title, content, created_at', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (postsData) {
          setPosts(postsData);
        }
        if (count !== null) {
          setPostCount(count);
        }

        // Fetch badges
        const { data: badgesData } = await supabase
          .from('user_forum_badges')
          .select(`
            awarded_at,
            forum_badges (
              id,
              name,
              description,
              icon,
              color
            )
          `)
          .eq('user_id', userId);
        
        if (badgesData) {
          setBadges(badgesData.map(b => ({
            ...b.forum_badges as any,
            awarded_at: b.awarded_at
          })));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, isOpen]);

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="text-primary hover:underline font-medium">
            {displayName}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-xl">{displayName}</span>
              <UserBadges userId={userId} />
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-5 w-5 mx-auto text-primary mb-1" />
                  <div className="text-2xl font-bold">{postCount}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                  <div className="text-2xl font-bold">{badges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                  <div className="text-sm font-medium">
                    {profile?.created_at 
                      ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })
                      : 'N/A'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">Joined</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="posts">
              <TabsList className="w-full">
                <TabsTrigger value="posts" className="flex-1">Recent Posts</TabsTrigger>
                <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <ScrollArea className="h-[300px]">
                  {posts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No posts yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {posts.map(post => (
                        <Link 
                          key={post.id} 
                          to={`/family-forum/${post.topic_id}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                            <CardContent className="p-3">
                              {post.title && (
                                <div className="font-medium text-sm mb-1">{post.title}</div>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {truncateContent(post.content)}
                              </p>
                              <div className="text-xs text-muted-foreground mt-2">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="badges">
                <ScrollArea className="h-[300px]">
                  {badges.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No badges earned yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {badges.map(badge => (
                        <Card key={badge.id}>
                          <CardContent className="p-3 flex items-start gap-3">
                            <div 
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-lg"
                              style={{ backgroundColor: badge.color }}
                            >
                              {badge.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{badge.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {badge.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Earned {formatDistanceToNow(new Date(badge.awarded_at), { addSuffix: true })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
