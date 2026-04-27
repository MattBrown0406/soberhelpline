import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Link, List } from "lucide-react";
import { extractMentions } from "./MentionInput";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  className,
  disabled,
  minHeight = "120px"
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{id: string; username: string | null; first_name: string}>>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = 
      value.substring(0, start) + 
      before + selectedText + after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        end + before.length
      );
    }, 0);
  }, [value, onChange]);

  const handleBold = () => wrapSelection('**', '**');
  const handleItalic = () => wrapSelection('*', '*');
  const handleLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText) {
      const newValue = 
        value.substring(0, start) + 
        `[${selectedText}](url)` + 
        value.substring(end);
      onChange(newValue);
    } else {
      const newValue = 
        value.substring(0, start) + 
        '[link text](url)' + 
        value.substring(end);
      onChange(newValue);
    }
  };
  
  const handleList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    
    const newValue = 
      value.substring(0, lineStart) + 
      '• ' + 
      value.substring(lineStart);
    
    onChange(newValue);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    
    // Check for @ symbol for mentions
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(atIndex + 1);
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionStart(atIndex);
        setMentionQuery(textAfterAt);
        
        // Fetch suggestions
        if (textAfterAt.length >= 1) {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data } = await supabase
            .from('profiles')
            .select('id, username, first_name')
            .or(`username.ilike.%${textAfterAt}%,first_name.ilike.%${textAfterAt}%`)
            .limit(5);
          
          if (data) {
            setSuggestions(data);
            setShowSuggestions(true);
            setSelectedIndex(0);
          }
        }
        return;
      }
    }
    
    setShowSuggestions(false);
    setMentionQuery("");
    setMentionStart(-1);
  };

  const insertMention = (user: {id: string; username: string | null; first_name: string}) => {
    if (mentionStart === -1) return;
    
    const displayName = user.username || user.first_name;
    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(mentionStart + mentionQuery.length + 1);
    const newValue = `${beforeMention}@${displayName} ${afterMention}`;
    
    onChange(newValue);
    setShowSuggestions(false);
    setMentionQuery("");
    setMentionStart(-1);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      <div className="flex items-center gap-1 p-1 border border-b-0 rounded-t-md bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleBold}
          disabled={disabled}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleItalic}
          disabled={disabled}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleLink}
          disabled={disabled}
          title="Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={handleList}
          disabled={disabled}
          title="List"
        >
          <List className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          Use @username to mention someone
        </span>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`rounded-t-none ${className}`}
        style={{ minHeight }}
        disabled={disabled}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
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

// Parse markdown-like syntax to React elements
export function parseRichText(content: string): React.ReactNode {
  // First handle mentions
  const parts = content.split(/(@\w+)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="text-primary font-medium">
          {part}
        </span>
      );
    }
    
    // Handle bold
    part = part.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Handle italic
    part = part.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Handle links
    part = part.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
    // Handle bullet points
    part = part.replace(/^• /gm, '• ');
    
    return (
      <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
    );
  });
}
