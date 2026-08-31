import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSEOOverride } from "@/contexts/SEOOverrideContext";
import { fitSeoDescription, fitSeoTitle } from "@/lib/seoTitle";
import { isNoIndexRoute } from "@/lib/indexability";

interface SEOHeadProps {
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
  };
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** CSS selectors for speakable content (AEO optimization) */
  speakableSelectors?: string[];
  /** FAQ items for automatic FAQPage schema generation */
  faqItems?: Array<{ question: string; answer: string }>;
  /** HowTo steps for automatic HowTo schema generation */
  howToSteps?: Array<{ name: string; text: string }>;
  howToName?: string;
  howToDescription?: string;
  personJsonLd?: Record<string, unknown>;
  /** Override the current route when this page is an intentional alternate of a primary URL. */
  canonicalPath?: string;
}

const BASE_URL = "https://soberhelpline.com";

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "";
  return pathname.replace(/\/+$/, "");
};

// Location landing pages describe a remote/nationwide service, not a staffed
// storefront. Do not publish LocalBusiness markup with a city-only address;
// represent those entries as a Service provided by Sober Helpline instead.
const normalizeJsonLdSchema = (schema: Record<string, unknown>) => {
  if (schema["@type"] !== "LocalBusiness") return schema;
  const address = schema.address as Record<string, unknown> | undefined;
  if (address?.streetAddress) return schema;

  const { address: _address, telephone, ...service } = schema;
  return {
    ...service,
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: "Sober Helpline",
      url: BASE_URL,
      ...(telephone ? { telephone } : {}),
    },
  };
};

export default function SEOHead({
  title,
  description,
  type = "website",
  image = "/og-image.png",
  article,
  noIndex = false,
  jsonLd,
  speakableSelectors,
  faqItems,
  howToSteps,
  howToName,
  howToDescription,
  personJsonLd,
  canonicalPath,
}: SEOHeadProps) {
  const location = useLocation();
  const { setOverridden } = useSEOOverride();
  const canonicalUrl = `${BASE_URL}${normalizePath(canonicalPath ?? location.pathname)}`;
  const optimizedTitle = fitSeoTitle(title);
  const optimizedDescription = fitSeoDescription(description);
  const effectiveNoIndex = noIndex || isNoIndexRoute(location.pathname);

  useEffect(() => {
    setOverridden(true);
    return () => setOverridden(false);
  }, [setOverridden]);
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  // Build speakable schema for voice assistants
  const speakableSchema = speakableSelectors?.length ? {
    "@type": "SpeakableSpecification",
    "cssSelector": speakableSelectors
  } : null;

  // Build FAQPage schema for AEO
  const faqSchema = faqItems?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Build HowTo schema for AEO
  const howToSchema = howToSteps?.length ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howToName || title,
    "description": howToDescription || description,
    "step": howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text
    }))
  } : null;

  // Merge speakable into custom jsonLd if provided
  const enhanceSchema = (schema: Record<string, unknown>) => ({
    ...normalizeJsonLdSchema(schema),
    ...(speakableSchema && { speakable: speakableSchema })
  });
  const enhancedJsonLd = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd.map(enhanceSchema) : enhanceSchema(jsonLd))
    : null;

  return (
      <Helmet>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta name="robots" content={effectiveNoIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="ai:description" content={`${description} Sober Helpline helps families choose between free Family Squares support, private consultation, intervention readiness, and ethical treatment navigation.`} />
      <meta name="llm:description" content={`${description} Sober Helpline helps families choose between free Family Squares support, private consultation, intervention readiness, and ethical treatment navigation.`} />
      <link rel="ai-context" href={`${BASE_URL}/llms.txt`} />
      <link rel="ai-context-full" href={`${BASE_URL}/llms-full.txt`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Sober Helpline family addiction support resources" />
      <meta property="og:site_name" content="Sober Helpline" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoberHelpline" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content="Sober Helpline family addiction support resources" />

      {/* Article-specific meta tags */}
      {type === "article" && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
        </>
      )}

      {/* Custom JSON-LD Schema with speakable */}
      {enhancedJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(enhancedJsonLd)}
        </script>
      )}

      {/* FAQPage Schema for AEO */}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {/* HowTo Schema for AEO */}
      {howToSchema && (
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      )}

      {personJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(personJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
