import { renderToStaticMarkup } from 'react-dom/server';
import ArticleContent from '../components/ArticleContent';
import { blogPosts, imageMap } from '../data/blogPosts';

// Explicit public-only allowlist: never render application/auth providers here.
export const pilotSlugs = ['first-al-anon-meeting-what-to-expect', 'alcohol-blackouts-explained-family-guide'];
export function renderArticlePilot(slug: string) {
  if (!pilotSlugs.includes(slug)) throw new Error(`Not an approved article pilot: ${slug}`);
  const posts = blogPosts.filter(post => post.slug === slug);
  if (posts.length !== 1 || !posts[0].content || !posts[0].author) throw new Error(`Invalid pilot source: ${slug}`);
  const post = posts[0];
  return renderToStaticMarkup(<main className="container mx-auto px-4 py-8"><article className="max-w-3xl mx-auto"><div className="text-sm text-primary font-medium mb-2">{post.category}</div><h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{post.title}</h1><p className="text-muted-foreground mb-6">{post.author}</p><div className="prose prose-sm sm:prose-lg max-w-none"><ArticleContent content={post.content} images={imageMap} /></div></article></main>);
}
