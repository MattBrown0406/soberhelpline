import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface UserSuggestion {
  id: string;
  username: string | null;
  first_name: string;
}

export function MentionInput({ value, onChange, placeholder, className, disabled }: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!mentionQuery || mentionQuery.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        // Search for users by username or first name
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, first_name')
          .or(`username.ilike.%${mentionQuery}%,first_name.ilike.%${mentionQuery}%`)
          .limit(5);

        if (!error && data) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    if (mentionQuery) {
      fetchSuggestions();
    }
  }, [mentionQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    
    // Check for @ symbol
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(atIndex + 1);
      // Check if we're still in a mention (no spaces after @)
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionStart(atIndex);
        setMentionQuery(textAfterAt);
        setShowSuggestions(true);
        setSelectedIndex(0);
        return;
      }
    }
    
    setShowSuggestions(false);
    setMentionQuery("");
    setMentionStart(-1);
  };

  const insertMention = (user: UserSuggestion) => {
    if (mentionStart === -1) return;
    
    const displayName = user.username || user.first_name;
    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(mentionStart + mentionQuery.length + 1);
    const newValue = `${beforeMention}@${displayName} ${afterMention}`;
    
    onChange(newValue);
    setShowSuggestions(false);
    setMentionQuery("");
    setMentionStart(-1);
    
    // Focus back on textarea
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      insertMention(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg overflow-hidden"
        >
          {suggestions.map((user, index) => (
            <button
              key={user.id}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
              onClick={() => insertMention(user)}
            >
              <span className="font-medium">
                {user.username || user.first_name}
              </span>
              {user.username && (
                <span className="text-muted-foreground text-xs">
                  ({user.first_name})
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to extract mentions from content
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

// Helper function to render content with styled mentions
export function renderContentWithMentions(content: string): React.ReactNode {
  const parts = content.split(/(@\w+)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-primary font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
}
