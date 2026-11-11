import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { fetchUsernames } from "@/lib/publicProfiles";
import { forumDisplayName, forumPostLink, getForumTopic } from "@/lib/forumTopics";

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
      // Strip characters that have meaning in PostgREST filters / LIKE patterns.
      const term = query.replace(/[,()%*\\_:"']/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
      if (!term) {
        setResults([]);
        return;
      }
      const { data: posts, error } = await supabase
        .from('forum_posts_secure')
        .select('id, title, content, topic_id, created_at, user_id, is_anonymous')
        .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
        .is('parent_post_id', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const rows = (posts || []).filter((p) => p.id && p.topic_id);
      const names = await fetchUsernames(rows.filter((p) => !p.is_anonymous).map((p) => p.user_id));
      setResults(
        rows.map((post) => {
          const text = (post.content || "").replace(/\s+/g, " ").trim();
          return {
            id: post.id as string,
            title: post.title,
            content: text.length > 150 ? `${text.substring(0, 150)}…` : text,
            topic_id: post.topic_id as string,
            created_at: post.created_at as string,
            author_name: forumDisplayName(post.user_id ? names.get(post.user_id) : null, !!post.is_anonymous),
          };
        }),
      );
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
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search posts..."
            aria-label="Search the forum"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-11 rounded-xl pl-10 pr-11"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 h-11 w-11 -translate-y-1/2 rounded-xl p-0 text-muted-foreground"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
        <Button className="h-11 shrink-0 rounded-xl px-4" onClick={handleSearch} disabled={isSearching || !query.trim()}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {hasSearched && (
        <div className="space-y-3">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">{results.length} {results.length === 1 ? "conversation" : "conversations"} found</p>
              {results.map(result => (
                <Link
                  key={result.id}
                  to={forumPostLink(result.topic_id, result.id)}
                  className="block rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <h3 className="mb-1 break-words text-sm font-semibold leading-snug text-foreground">
                    {result.title || 'Untitled Post'}
                  </h3>
                  <p className="mb-2 break-words text-sm leading-relaxed text-muted-foreground">{result.content}</p>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span>{result.author_name}</span>
                    <span aria-hidden="true">•</span>
                    <span>{getForumTopic(result.topic_id)?.title ?? "Forum"}</span>
                    <span aria-hidden="true">•</span>
                    <span>{new Date(result.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <p className="break-words py-4 text-center text-sm text-muted-foreground">
              No posts found matching "{query}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
