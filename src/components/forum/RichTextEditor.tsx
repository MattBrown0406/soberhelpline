import { useCallback, useRef, type ReactNode } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, List } from "lucide-react";
import { MentionSuggestionList, useMentionSuggestions } from "./MentionInput";

/**
 * Plain-text editor with a light markdown toolbar (**bold**, *italic*, bullet
 * lines) and @mention autocomplete. Content is stored as plain text and
 * rendered with parseRichText, which escapes everything and only emits
 * <strong>, <em> and safe <a> tags (sanitised again with DOMPurify).
 */
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
  maxLength?: number;
  id?: string;
  /** Hide the @mention hint (e.g. when posting anonymously). */
  mentionsDisabled?: boolean;
  "aria-label"?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  minHeight = "120px",
  maxLength = 5000,
  id,
  mentionsDisabled,
  "aria-label": ariaLabel,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mention = useMentionSuggestions(value, onChange, textareaRef);

  const wrapSelection = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      onChange(value.substring(0, start) + before + selected + after + value.substring(end));
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    },
    [value, onChange],
  );

  const handleList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    onChange(value.substring(0, lineStart) + "• " + value.substring(lineStart));
    setTimeout(() => textarea.focus(), 0);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1 rounded-t-xl border border-b-0 border-input bg-muted/40 p-1">
        <Button type="button" variant="ghost" size="sm" className="h-11 w-11 rounded-lg p-0" onClick={() => wrapSelection("**", "**")} disabled={disabled} title="Bold" aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-11 w-11 rounded-lg p-0" onClick={() => wrapSelection("*", "*")} disabled={disabled} title="Italic" aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-11 w-11 rounded-lg p-0" onClick={handleList} disabled={disabled} title="Bullet point" aria-label="Bullet point">
          <List className="h-4 w-4" />
        </Button>
        {!mentionsDisabled && (
          <span className="ml-2 min-w-0 truncate text-xs text-slate-600 dark:text-slate-300">Type @ and a username to mention someone</span>
        )}
      </div>

      <Textarea
        id={id}
        ref={textareaRef}
        value={value}
        onChange={mention.handleChange}
        onKeyDown={mention.handleKeyDown}
        placeholder={placeholder}
        className={`rounded-b-xl rounded-t-none text-base leading-relaxed ${className ?? ""}`}
        style={{ minHeight }}
        disabled={disabled}
        maxLength={maxLength}
        aria-label={ariaLabel}
      />

      {!mentionsDisabled && (
        <MentionSuggestionList
          suggestions={mention.suggestions}
          selectedIndex={mention.selectedIndex}
          onPick={mention.insertMention}
        />
      )}
    </div>
  );
}

// Escape HTML so user-supplied text cannot inject tags before we apply our
// own markdown-like transformations.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function unescapeHtml(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Only allow http(s) and mailto links — reject javascript:, data:, vbscript:, etc.
function safeUrl(raw: string): string {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed, "https://soberhelpline.com");
    if (!["http:", "https:", "mailto:"].includes(url.protocol)) return "#";
    return url.toString();
  } catch {
    return "#";
  }
}

function anchor(rawUrl: string, labelHtml: string): string {
  const url = escapeHtml(safeUrl(unescapeHtml(rawUrl)));
  return `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline break-words">${labelHtml}</a>`;
}

function renderSegment(part: string): string {
  let html = escapeHtml(part);
  const tokens: string[] = [];
  const keep = (s: string) => {
    tokens.push(s);
    return `\u0000${tokens.length - 1}\u0000`;
  };

  // [label](url)
  html = html.replace(/\[([^\]\n]+?)\]\(([^)\s]+?)\)/g, (_m, label: string, url: string) => keep(anchor(url, label)));
  // Bare links
  html = html.replace(/\bhttps?:\/\/(?:(?!&quot;|&#039;)[^\s<>])+/g, (match: string) => {
    const trailing = /[.,;:!?)]+$/.exec(match)?.[0] ?? "";
    const url = trailing ? match.slice(0, -trailing.length) : match;
    return keep(anchor(url, url)) + trailing;
  });
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
  // eslint-disable-next-line no-control-regex
  html = html.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => tokens[Number(i)] ?? "");

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["strong", "em", "a", "br"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|#)/i,
  });
}

// Parse markdown-like syntax to React elements, sanitizing all HTML output.
export function parseRichText(content: string): ReactNode {
  const parts = (content ?? "").split(/(@\w+)/g);
  return parts.map((part, index) => {
    if (/^@\w+$/.test(part)) {
      return (
        <span key={index} className="text-primary font-medium">
          {part}
        </span>
      );
    }
    if (!part) return null;
    return <span key={index} dangerouslySetInnerHTML={{ __html: renderSegment(part) }} />;
  });
}

/** Renders stored forum post text safely, keeping line breaks. */
export function ForumContent({ content, className }: { content: string; className?: string }) {
  return <div className={`whitespace-pre-wrap break-words ${className ?? ""}`}>{parseRichText(content)}</div>;
}
