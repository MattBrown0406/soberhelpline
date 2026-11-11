// Where a blog post lives. Post ids are not unique (several posts share one,
// a few have none), so links must use the same slug BlogArticle resolves and
// publishes as the canonical URL: explicit slug, else the image-file slug,
// else a slug made from the title.

interface BlogPostLike {
  id?: number | string | null;
  slug?: string | null;
  title?: string | null;
  image?: string | null;
}

export const slugFromTitle = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// e.g. /assets/blog-rock-bottom-myth-a1b2c3d4.png -> rock-bottom-myth
export const slugFromImage = (image?: string | null) => {
  if (!image) return "";
  const fileName = image.split("/").pop()?.toLowerCase() || "";
  const noExt = fileName.replace(/\.[a-z0-9]+$/i, "");
  if (!noExt.startsWith("blog-")) return "";
  const segments = noExt.replace(/^blog-/, "").split("-");
  const last = segments[segments.length - 1];
  // Drop a build hash (8+ characters containing a digit).
  if (last && last.length >= 8 && /\d/.test(last)) segments.pop();
  return segments.join("-");
};

export const blogPostSlug = (post: BlogPostLike) =>
  (post.slug || slugFromImage(post.image) || slugFromTitle(post.title || "") || (post.id != null ? String(post.id) : "")).toLowerCase();

export const blogPostPath = (post: BlogPostLike) => `/blog/${blogPostSlug(post)}`;
