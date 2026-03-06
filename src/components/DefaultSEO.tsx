import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteMetadata } from "@/data/routeMetadata";

const BASE_URL = "https://soberhelpline.com";

/**
 * DefaultSEO provides fallback <head> metadata for every page.
 * Pages with their own SEOHead or Helmet will override these defaults
 * (react-helmet-async uses last-rendered-wins for each tag).
 */
export default function DefaultSEO() {
  const { pathname } = useLocation();
  const { title, description } = getRouteMetadata(pathname);
  const canonicalUrl = `${BASE_URL}${pathname === '/' ? '' : pathname}`;
  const ogType = pathname.startsWith('/blog/') ? 'article' : 'website';

  return (
    <Helmet defaultTitle="Sober Helpline" prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:site_name" content="Sober Helpline" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoberHelpline" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
    </Helmet>
  );
}
