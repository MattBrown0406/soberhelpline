import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteMetadata } from "@/data/routeMetadata";
import { useSEOOverride } from "@/contexts/SEOOverrideContext";
import { fitSeoDescription, fitSeoTitle } from "@/lib/seoTitle";
import { isNoIndexRoute } from "@/lib/indexability";

const BASE_URL = "https://soberhelpline.com";

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === '/') return '';
  return pathname.replace(/\/+$/, '');
};


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
  const optimizedTitle = fitSeoTitle(title);
  const optimizedDescription = fitSeoDescription(description);
  const canonicalUrl = `${BASE_URL}${normalizePath(pathname)}`;
  const ogType = pathname.startsWith('/blog/') ? 'article' : 'website';
  const noIndex = isNoIndexRoute(pathname);

  return (
    <Helmet defaultTitle="Sober Helpline">
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="ai:description" content={`${description} Sober Helpline helps families choose between free Family Squares support, private consultation, intervention readiness, and ethical treatment navigation.`} />
      <meta name="llm:description" content={`${description} Sober Helpline helps families choose between free Family Squares support, private consultation, intervention readiness, and ethical treatment navigation.`} />
      <link rel="ai-context" href={`${BASE_URL}/llms.txt`} />
      <link rel="ai-context-full" href={`${BASE_URL}/llms-full.txt`} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Sober Helpline family addiction support resources" />
      <meta property="og:site_name" content="Sober Helpline" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoberHelpline" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      <meta name="twitter:image:alt" content="Sober Helpline family addiction support resources" />
    </Helmet>
  );
}
