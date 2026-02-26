import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Command } from "lucide-react";
import Fuse from "fuse.js";
import { searchIndex, categoryLabels, categoryOrder, type SearchEntry } from "@/data/searchIndex";

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "keywords", weight: 0.3 },
    { name: "description", weight: 0.2 },
    { name: "category", weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
});

const categoryColors: Record<string, string> = {
  guide: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  tool: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  ai: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  community: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  blog: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  provider: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  page: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 20 }).map((r) => r.item);
  }, [query]);

  // Flatten grouped results for keyboard nav
  const grouped = useMemo(() => {
    const groups: Record<string, SearchEntry[]> = {};
    for (const item of results) {
      (groups[item.category] ??= []).push(item);
    }
    const ordered: { category: string; items: SearchEntry[] }[] = [];
    for (const cat of categoryOrder) {
      if (groups[cat]) ordered.push({ category: cat, items: groups[cat] });
    }
    return ordered;
  }, [results]);

  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  const openSearch = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    // Restore focus to the trigger button
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const selectItem = useCallback(
    (item: SearchEntry) => {
      closeSearch();
      navigate(item.path);
    },
    [closeSearch, navigate]
  );

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) closeSearch();
        else openSearch();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, openSearch, closeSearch]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Keyboard nav
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      e.preventDefault();
      selectItem(flatResults[selectedIndex]);
    }
  };

  // Scroll selected into view
  useEffect(() => {
    const el = resultsRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Reset selection on query change
  useEffect(() => setSelectedIndex(0), [query]);

  // Focus trap: keep focus within the dialog when open
  useEffect(() => {
    if (!open) return;
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleFocusTrap);
    return () => document.removeEventListener("keydown", handleFocusTrap);
  }, [open]);

  let flatIdx = -1;

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={openSearch}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
        aria-label="Search site"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
          onClick={closeSearch}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-label="Site search"
            aria-modal="true"
            className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search guides, tools, AI coaches, blog..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                autoComplete="off"
              />
              <button
                onClick={closeSearch}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim() && results.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No results found for "{query}"
                </p>
              )}

              {!query.trim() && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start typing to search across all resources...
                </p>
              )}

              {grouped.map((group) => (
                <div key={group.category} className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {categoryLabels[group.category] || group.category}
                  </div>
                  {group.items.map((item) => {
                    flatIdx++;
                    const idx = flatIdx;
                    return (
                      <button
                        key={item.path}
                        data-index={idx}
                        onClick={() => selectItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                          idx === selectedIndex
                            ? "bg-emerald-500/10 border border-emerald-500/20"
                            : "hover:bg-accent border border-transparent"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground truncate">
                              {item.title}
                            </span>
                            <span
                              className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                                categoryColors[item.category] || ""
                              }`}
                            >
                              {categoryLabels[item.category] || item.category}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
