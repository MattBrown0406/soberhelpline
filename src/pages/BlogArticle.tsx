import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Calendar, User, Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSEOOverride } from "@/contexts/SEOOverrideContext";
import { Helmet } from "react-helmet-async";

import cycleOfAddictionImg from "@/assets/blog-cycle-of-addiction.jpg";
import { blogPosts, imageMap } from "@/data/blogPosts";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";
import RelatedFamilyAnswerLinks from "@/components/RelatedFamilyAnswerLinks";

const BASE_URL = "https://soberhelpline.com";

const highIntentBlogOverrides: Record<string, { title: string; excerpt: string; seoTitle: string; metaDescription: string; conversionPrompt: string }> = {
  "what-to-do-when-loved-one-lies-about-drinking-drug-use": {
    title: "Loved One Lying About Drinking or Drug Use? What Families Can Do Next",
    excerpt:
      "If your loved one keeps lying about drinking or drug use, stop chasing a confession. Use a calmer script, hold the boundary, and know when to get outside help.",
    seoTitle: "Loved One Lying About Drinking or Drug Use? Family Next Steps",
    metaDescription:
      "If your loved one lies about drinking or drug use, learn what to say tonight, what not to say, and when to get family coaching or intervention help.",
    conversionPrompt:
      "If the lying has already turned into another crisis at home, you do not have to wait until everyone is calm to get help. Book a private family consult or start with family addiction coaching so the next conversation has structure instead of becoming another interrogation.",
  },
};

const BlogArticle = () => {
  const { id } = useParams();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { setOverridden } = useSEOOverride();

  // Generate a slug from a title for fallback matching
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Derive a short slug from image filename (e.g. blog-rock-bottom-myth.png)
  const getImageSlug = (image?: string) => {
    if (!image) return '';
    const fileName = image.split('/').pop()?.toLowerCase() || '';
    const noExt = fileName.replace(/\.[a-z0-9]+$/i, '');
    if (!noExt.startsWith('blog-')) return '';

    const segments = noExt.replace(/^blog-/, '').split('-');
    const lastSegment = segments[segments.length - 1];

    // Strip Vite hash-like suffixes only when they contain digits (e.g. -a1b2c3d4)
    if (lastSegment && lastSegment.length >= 8 && /\d/.test(lastSegment)) {
      segments.pop();
    }

    return segments.join('-');
  };

  // Match by explicit slug, title slug, image slug, or numeric id
  const currentPath = window.location.pathname;
  const normalizedRouteParam = (id || '').toLowerCase();
  const pathSlug = currentPath.replace(/^\/blog\//, '').replace(/^\//, '').toLowerCase();
  const post = blogPosts.find((p) => {
    const slug = ((p as any).slug || '').toLowerCase();
    const titleSlug = generateSlug(p.title || '');
    const imageSlug = getImageSlug(p.image);
    const imagePath = (p.image || '').toLowerCase();

    const candidates = [slug, titleSlug, imageSlug].filter(Boolean);

    if (normalizedRouteParam && candidates.includes(normalizedRouteParam)) return true;
    if (pathSlug && candidates.includes(pathSlug)) return true;
    if (normalizedRouteParam && imagePath.includes(`blog-${normalizedRouteParam}`)) return true;
    if (pathSlug && imagePath.includes(`blog-${pathSlug}`)) return true;

    if (candidates.some((candidate) => currentPath === `/${candidate}` || currentPath === `/blog/${candidate}`)) return true;

    return false;
  }) || (id ? blogPosts.find((p) => p.id != null && p.id.toString() === id) : undefined);

  const fallbackPostSlug = post
    ? ((post as any).slug || getImageSlug(post.image) || generateSlug(post.title || '') || id || post.id?.toString() || '').toLowerCase()
    : '';
  const blogOverride = fallbackPostSlug ? highIntentBlogOverrides[fallbackPostSlug] : undefined;

  // Tell DefaultSEO to skip - BlogArticle manages its own SEO
  useEffect(() => {
    setOverridden(true);
    return () => setOverridden(false);
  }, [setOverridden]);

  // Compute SEO values for Helmet and schema
  const seoData = useMemo(() => {
    if (!post) return null;
    const fallbackSlug = generateSlug(post.title || '') || id || post.id?.toString() || '';
    const postSlug = (post as any).slug || getImageSlug(post.image) || fallbackSlug;
    const override = highIntentBlogOverrides[postSlug.toLowerCase()];
    const canonicalUrl = `${BASE_URL}/blog/${postSlug}`;
    const seoDescription = override?.metaDescription || (post as any).metaDescription || post.excerpt || (post.content ? post.content.substring(0, 155) + '...' : '');
    const fullImageUrl = post.image?.startsWith('http') ? post.image : `${BASE_URL}${post.image}`;

    const suffix = ' | Sober Helpline';
    const baseSeoTitle = override?.seoTitle || (post as any).seoTitle || post.title;
    const maxLen = 60 - suffix.length;
    const seoTitle = baseSeoTitle.includes('Sober Helpline')
      ? baseSeoTitle
      : baseSeoTitle.length > maxLen
        ? `${baseSeoTitle.substring(0, maxLen - 3)}...${suffix}`
        : `${baseSeoTitle}${suffix}`;

    return { postSlug, canonicalUrl, seoDescription, fullImageUrl, seoTitle };
  }, [post, id]);

  // Article JSON-LD schema (must be DOM-injected since Helmet doesn't handle data attributes)
  useEffect(() => {
    if (!post || !seoData) return;

    const existingArticleSchema = document.querySelector('script[data-schema="article"]');
    if (existingArticleSchema) existingArticleSchema.remove();

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.setAttribute('data-schema', 'article');
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": blogOverride?.title || post.title,
      "description": seoData.seoDescription,
      "image": seoData.fullImageUrl,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": "https://freedominterventions.com/interventionist"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sober Helpline",
        "url": "https://soberhelpline.com"
      },
      "datePublished": post.date,
      "dateModified": post.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": seoData.canonicalUrl
      },
      "articleSection": post.category,
      "isAccessibleForFree": true,
      "keywords": (post as any).keywords || [post.category, "addiction recovery", "family support"]
    });
    document.head.appendChild(schema);

    return () => {
      const articleSchema = document.querySelector('script[data-schema="article"]');
      if (articleSchema) articleSchema.remove();
    };
  }, [post, seoData, blogOverride]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10">
          <article className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Post not found</h1>
            <p className="text-muted-foreground">We couldn’t find this article.</p>
          </article>
        </div>
      </div>
    );
  }

  const sharePageUrl = seoData?.canonicalUrl || `${BASE_URL}/blog/${fallbackPostSlug}`;
  const shareTitle = blogOverride?.title || post.title;
  const shareText = blogOverride?.excerpt || post.excerpt;

  const copyLink = async () => {
    const textToCopy = `${shareTitle} - Sober Helpline\n${sharePageUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.log('Failed to copy link');
    }
  };

  const getShareUrls = () => {
    const pageUrl = encodeURIComponent(sharePageUrl);
    const title = encodeURIComponent(shareTitle);
    const text = encodeURIComponent(shareText);
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      twitter: `https://x.com/intent/tweet?url=${pageUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
      email: `mailto:?subject=${title}&body=${title}%0A%0A${text}%0A%0ARead more: ${sharePageUrl}`,
    };
  };

  const shareUrls = getShareUrls();

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: sharePageUrl,
      }).catch(() => {});
    }
  };

  const renderTextWithLinks = (text: string) => {
    const linkRegex = /\[LINK:([^:]+):([^\]]+)\]/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      const imageMatch = paragraph.match(/^\[IMAGE:(\w+)\]$/);
      if (imageMatch) {
        const imageName = imageMatch[1];
        const imageSrc = imageMap[imageName];
        if (imageSrc) {
          return (
            <div key={index} className="my-6 rounded-lg overflow-hidden shadow-lg">
              <img src={imageSrc} alt="Article illustration" className="w-full h-auto" />
            </div>
          );
        }
        return null;
      }
      
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      return (
        <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
          {renderTextWithLinks(paragraph)}
        </p>
      );
    });
  };

  return (
    <>
      {seoData && (
        <Helmet>
          <title>{seoData.seoTitle}</title>
          <meta name="description" content={seoData.seoDescription} />
          <link rel="canonical" href={seoData.canonicalUrl} />
          <meta property="og:title" content={seoData.seoTitle} />
          <meta property="og:description" content={seoData.seoDescription} />
          <meta property="og:url" content={seoData.canonicalUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={seoData.fullImageUrl} />
          <meta property="og:site_name" content="Sober Helpline" />
          <meta property="article:published_time" content={post.date} />
          <meta property="article:author" content={post.author} />
          <meta property="article:section" content={post.category} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@SoberHelpline" />
          <meta name="twitter:title" content={seoData.seoTitle} />
          <meta name="twitter:description" content={seoData.seoDescription} />
          <meta name="twitter:image" content={seoData.fullImageUrl} />
        </Helmet>
      )}
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">

        {/* Article */}
        <article className="max-w-3xl mx-auto">
          <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{blogOverride?.title || post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-y py-4 mb-6">
            <Button 
              onClick={() => setShowShareOptions(!showShareOptions)} 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {showShareOptions ? 'Hide share options' : 'Share this article'}
            </Button>
            
            {showShareOptions && (
              <div className="mt-4 p-4 border rounded-lg bg-background shadow-lg">
                <p className="text-sm text-muted-foreground mb-3">Share via:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyLink}
                    className="flex items-center gap-2"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {linkCopied ? 'Copied!' : 'Copy Link'}
                  </Button>
                  <a 
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a 
                    href={shareUrls.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Twitter className="w-4 h-4" />
                    X
                  </a>
                  <a 
                    href={shareUrls.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a 
                    href={shareUrls.email}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  {typeof navigator !== "undefined" && navigator.share && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleNativeShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      More Options
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {post.image && (
            <img 
              src={post.image} 
              alt={blogOverride?.title || post.title} 
              className="w-full h-48 sm:h-72 md:h-96 object-cover rounded-lg mb-6 sm:mb-8"
            />
          )}

          {/* Content */}
          <div className="prose prose-sm sm:prose-lg max-w-none">
            {blogOverride?.conversionPrompt && (
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-foreground font-medium leading-relaxed">{blogOverride.conversionPrompt}</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Link to="/family-consultation">
                    <Button>Book a private family consult</Button>
                  </Link>
                  <Link to="/addiction-family-coaching">
                    <Button variant="outline">Family addiction coaching</Button>
                  </Link>
                </div>
              </div>
            )}
            {post.content && renderContent(post.content)}
          </div>

          <RelatedFamilyAnswerLinks
            post={{
              slug: (post as any).slug || seoData?.postSlug,
              title: blogOverride?.title || post.title,
              category: post.category,
              excerpt: blogOverride?.excerpt || post.excerpt,
            }}
          />

          {/* Membership CTA */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-logo-green/5 via-emerald-50 to-white border border-logo-green/20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-logo-green/10 text-logo-blue text-xs font-semibold mb-3">
                <BookOpen className="w-3 h-3" />
                Member Resource
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                This is just one of 62+ resources available to members
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 max-w-lg mx-auto">
                Get access to interactive tools, guided meditations, AI coaching, our private family forum, and weekly “The Family Squares” sessions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/family-membership">
                  <Button className="bg-logo-green hover:bg-logo-green/90 text-white px-6">
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock Full Access — $14.99/mo
                  </Button>
                </Link>
                <Link to="/free-guide">
                  <Button variant="outline" className="px-6">
                    Get Free Guide First
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FamilyBridge CTA */}
          <div className="mt-8">
            <FamilyBridgeCTA variant="card" />
          </div>
        </article>
      </div>
    </div>
    </>
  );
};

export default BlogArticle;
