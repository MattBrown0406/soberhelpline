import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";
import { searchForumMembers, type ForumMemberMatch } from "@/lib/publicProfiles";

interface MemberPickerProps {
  value: ForumMemberMatch | null;
  onChange: (member: ForumMemberMatch | null) => void;
  placeholder?: string;
  id?: string;
}

/**
 * Pick a member by username (search_forum_members RPC). Members without a
 * username cannot be found here; we never search by real name.
 */
export function MemberPicker({ value, onChange, placeholder = "Type a username…", id }: MemberPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ForumMemberMatch[]>([]);
  const [searching, setSearching] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }
    const current = ++requestId.current;
    setSearching(true);
    const timer = setTimeout(async () => {
      const found = await searchForumMembers(q);
      if (current === requestId.current) {
        setResults(found);
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (value) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
        <span className="font-medium truncate">{value.username}</span>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onChange(null)} aria-label="Choose someone else">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          autoComplete="off"
          maxLength={50}
        />
        {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      {query.trim() && !searching && results.length === 0 && (
        <p className="text-xs text-muted-foreground px-1">No member with that username.</p>
      )}
      {results.length > 0 && (
        <ul className="rounded-md border border-border bg-popover text-popover-foreground divide-y divide-border max-h-48 overflow-y-auto">
          {results.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                onClick={() => {
                  onChange(member);
                  setQuery("");
                  setResults([]);
                }}
              >
                {member.username}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
