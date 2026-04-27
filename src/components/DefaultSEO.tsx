import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteMetadata } from "@/data/routeMetadata";
import { useSEOOverride } from "@/contexts/SEOOverrideContext";

const BASE_URL = "https://soberhelpline.com";

/**
 * DefaultSEO provides fallback <head> metadata for every page.
 * When a page (e.g. BlogArticle) sets the SEO override flag,
 * DefaultSEO skips rendering to avoid conflicts.
 */
export default function DefaultSEO() {
  const { pathname } = useLocation();
  const { isOverridden } = useSEOOverride();

  if (isOverridden) return null;

  const { title, description } = getRouteMetadata(pathname);
  const canonicalUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
  const ogType = pathname.startsWith('/blog/') ? 'article' : 'website';

  return (
    <Helmet defaultTitle="Sober Helpline">
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Sober Helpline family addiction support resources" />
      <meta property="og:site_name" content="Sober Helpline" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoberHelpline" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      <meta name="twitter:image:alt" content="Sober Helpline family addiction support resources" />
    </Helmet>
  );
}
