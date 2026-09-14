import { Fragment, type ReactNode } from "react";

// Deliberately small text-only Markdown dialect. Never interpret source HTML.
const safeHref = (value: string) => {
  if ([...value].some(char => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127 || char === '\\')) return undefined;
  if (/^(?:\/(?!\/)|#)/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:', 'tel:', 'mailto:'].includes(url.protocol) ? value : undefined;
  } catch { return undefined; }
};

const inline = (text: string): ReactNode[] => {
  // Custom labels may contain [1], but not colons; URLs retain their colon.
  const tokens = /\[LINK:([^:]+):([^\]]+)\]|\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*/g;
  const parts: ReactNode[] = [];
  let end = 0;
  for (const match of text.matchAll(tokens)) {
    parts.push(text.slice(end, match.index));
    const label = match[1] ?? match[3];
    const href = safeHref(match[2] ?? match[4] ?? '');
    parts.push(match[5] ? <strong key={match.index}>{match[5]}</strong> : href ?
      <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{label}</a> :
      <Fragment key={match.index}>{label}</Fragment>);
    end = match.index! + match[0].length;
  }
  parts.push(text.slice(end));
  return parts;
};

export default function ArticleContent({ content, images = {} }: { content: string; images?: Record<string, string> }) {
  const blocks: ReactNode[] = [];
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    const key = i++;
    if (!line) continue;
    const image = line.match(/^\[IMAGE:(\w+)\]$/);
    if (image) {
      if (images[image[1]]) blocks.push(<div key={key} className="my-6 rounded-lg overflow-hidden shadow-lg"><img src={images[image[1]]} alt="Article illustration" className="w-full h-auto" /></div>);
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    // Preserve the historical standalone **heading** convention as H3.
    const legacy = line.match(/^\*\*([^*]+)\*\*$/);
    if (heading || legacy) {
      const Heading = heading?.[1] === '##' ? 'h2' : 'h3';
      blocks.push(<Heading key={key} className="text-xl font-semibold text-foreground mt-6 mb-3">{inline(heading?.[2] ?? legacy![1])}</Heading>);
      continue;
    }
    const list = line.match(/^(?:([-*])|\d+\.)\s+(.+)$/);
    if (list) {
      const ordered = !list[1];
      const pattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
      const items = [list[2]];
      while (i < lines.length && pattern.test(lines[i].trim())) items.push(lines[i++].trim().replace(pattern, '$1'));
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={key} className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 mb-4 text-muted-foreground space-y-2`}>{items.map((item, j) => <li key={j}>{inline(item)}</li>)}</List>);
      continue;
    }
    const paragraph = [line];
    while (i < lines.length && lines[i].trim() && !/^(?:#{2,3}\s|[-*]\s|\d+\.\s|\[IMAGE:)/.test(lines[i].trim())) paragraph.push(lines[i++].trim());
    blocks.push(<p key={key} className="text-muted-foreground mb-4 leading-relaxed">{inline(paragraph.join('\n'))}</p>);
  }
  return <div data-article-content="true">{blocks}</div>;
}
