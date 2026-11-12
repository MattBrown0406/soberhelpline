import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPostPath, blogPostSlug } from "@/lib/blogPaths";

type PostLike = {
  id?: number | string;
  slug?: string;
  title?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  content?: string;
};

/**
 * Three more articles to read after this one: the closest by shared tags,
 * then by category, then the newest. The list is the same on every visit.
 */
function pickReadNext(current: PostLike, posts: PostLike[], count = 3): PostLike[] {
  const currentSlug = blogPostSlug(current);
  const tags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));
  const seen = new Set<string>([currentSlug]);
  const scored: { post: PostLike; score: number; order: number }[] = [];
  posts.forEach((post, order) => {
    if (!post.content || !post.title) return;
    const slug = blogPostSlug(post);
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    const shared = (post.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length;
    const sameCategory = post.category && post.category === current.category ? 1 : 0;
    scored.push({ post, score: shared * 2 + sameCategory, order });
  });
  // Posts are listed newest first, so list order breaks ties toward newer posts.
  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.slice(0, count).map((s) => s.post);
}

const ReadNextArticles = ({ current, posts }: { current: PostLike; posts: PostLike[] }) => {
  const next = useMemo(() => pickReadNext(current, posts), [current, posts]);
  if (next.length === 0) return null;

  return (
    <section className="mt-10 print:hidden" aria-labelledby="read-next-heading">
      <h2 id="read-next-heading" className="mb-4 text-lg font-bold text-foreground sm:text-xl">
        Read next
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {next.map((post) => (
          <Link
            key={blogPostSlug(post)}
            to={blogPostPath(post)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.image && (
              <img
                src={post.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-32 w-full object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-4">
              {post.category && <p className="mb-1 text-xs font-medium text-primary">{post.category}</p>}
              <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-primary">
                Read article
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-sm">
        <Link to="/blog" className="font-medium text-primary hover:underline">
          See all articles
        </Link>
      </p>
    </section>
  );
};

export default ReadNextArticles;
