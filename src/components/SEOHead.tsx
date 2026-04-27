import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSEOOverride } from "@/contexts/SEOOverrideContext";

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
  jsonLd?: Record<string, unknown>;
  /** CSS selectors for speakable content (AEO optimization) */
  speakableSelectors?: string[];
  /** FAQ items for automatic FAQPage schema generation */
  faqItems?: Array<{ question: string; answer: string }>;
  /** HowTo steps for automatic HowTo schema generation */
  howToSteps?: Array<{ name: string; text: string }>;
  howToName?: string;
  howToDescription?: string;
  personJsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://soberhelpline.com";

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
}: SEOHeadProps) {
  const location = useLocation();
  const { setOverridden } = useSEOOverride();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;

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
  const enhancedJsonLd = jsonLd ? {
    ...jsonLd,
    ...(speakableSchema && { speakable: speakableSchema })
  } : null;

  return (
      <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Sober Helpline family addiction support resources" />
      <meta property="og:site_name" content="Sober Helpline" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoberHelpline" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
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
