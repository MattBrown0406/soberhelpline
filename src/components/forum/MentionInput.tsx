import { useEffect, useRef, useState, type KeyboardEvent, type ChangeEvent, type RefObject } from "react";
import { Textarea } from "@/components/ui/textarea";
import { searchForumMembers, type ForumMemberMatch } from "@/lib/publicProfiles";

/**
 * @mention autocomplete for a textarea. Suggestions come from the
 * search_forum_members RPC, which only returns members' usernames (never real
 * names) and only to members and staff.
 */
export function useMentionSuggestions(
  value: string,
  onChange: (value: string) => void,
  textareaRef: RefObject<HTMLTextAreaElement>,
) {
  const [suggestions, setSuggestions] = useState<ForumMemberMatch[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    if (!mentionQuery) {
      setSuggestions([]);
      return;
    }
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      const results = await searchForumMembers(mentionQuery);
      // Only usernames that the @word syntax can actually reference.
      if (id === requestId.current) {
        setSuggestions(results.filter((r) => /^\w+$/.test(r.username)));
        setSelectedIndex(0);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [mentionQuery]);

  const close = () => {
    setSuggestions([]);
    setMentionQuery("");
    setMentionStart(-1);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart ?? newValue.length;
    onChange(newValue);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const match = /(^|\s)@(\w{1,30})$/.exec(textBeforeCursor);
    if (match) {
      setMentionStart(cursorPos - match[2].length - 1);
      setMentionQuery(match[2]);
      return;
    }
    close();
  };

  const insertMention = (member: ForumMemberMatch) => {
    if (mentionStart === -1) return;
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + mentionQuery.length + 1);
    onChange(`${before}@${member.username} ${after}`);
    close();
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insertMention(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return { suggestions, selectedIndex, handleChange, handleKeyDown, insertMention };
}

export function MentionSuggestionList({
  suggestions,
  selectedIndex,
  onPick,
}: {
  suggestions: ForumMemberMatch[];
  selectedIndex: number;
  onPick: (member: ForumMemberMatch) => void;
}) {
  if (suggestions.length === 0) return null;
  return (
    <div
      role="listbox"
      className="absolute z-50 mt-1 w-64 max-w-full bg-popover text-popover-foreground border border-border rounded-md shadow-lg overflow-hidden"
    >
      {suggestions.map((member, index) => (
        <button
          key={member.id}
          type="button"
          role="option"
          aria-selected={index === selectedIndex}
          className={`w-full px-3 py-2 text-left text-sm hover:bg-accent ${index === selectedIndex ? "bg-accent" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(member)}
        >
          <span className="font-medium">@{member.username}</span>
        </button>
      ))}
    </div>
  );
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MentionInput({ value, onChange, placeholder, className, disabled }: MentionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mention = useMentionSuggestions(value, onChange, textareaRef);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={mention.handleChange}
        onKeyDown={mention.handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      <MentionSuggestionList
        suggestions={mention.suggestions}
        selectedIndex={mention.selectedIndex}
        onPick={mention.insertMention}
      />
    </div>
  );
}
