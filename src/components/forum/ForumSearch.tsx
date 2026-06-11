import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { fetchPublicProfiles } from "@/lib/publicProfiles";

interface SearchResult {
  id: string;
  title: string | null;
  content: string;
  topic_id: string;
  created_at: string;
  author_name: string;
}

export function ForumSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data: posts, error } = await supabase
        .from('forum_posts')
        .select('id, title, content, topic_id, created_at, user_id')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .is('parent_post_id', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (posts && posts.length > 0) {
        const userIds = [...new Set(posts.map(p => p.user_id))];
        const profiles = await fetchPublicProfiles(userIds);

        const enrichedResults = posts.map(post => {
          const profile = profiles?.find(p => p.id === post.user_id);
          return {
            id: post.id,
            title: post.title,
            content: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : ''),
            topic_id: post.topic_id,
            created_at: post.created_at,
            author_name: profile?.username || profile?.first_name || 'Anonymous'
          };
        });

        setResults(enrichedResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {hasSearched && (
        <div className="space-y-3">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">{results.length} results found</p>
              {results.map(result => (
                <Link key={result.id} to={`/family-forum/${result.topic_id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-logo-blue mb-1">
                        {result.title || 'Untitled Post'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{result.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{result.author_name}</span>
                        <span>•</span>
                        <span>{new Date(result.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No posts found matching "{query}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
