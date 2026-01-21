import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

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
}: SEOHeadProps) {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const fullImageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  // Ensure title is under 60 chars and description under 160 chars
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const truncatedDescription = description.length > 160 ? `${description.substring(0, 157)}...` : description;

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
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Sober Helpline" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SoberHelpline" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={truncatedTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={fullImageUrl} />

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
    </Helmet>
  );
}
