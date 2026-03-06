import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Phone, Calendar, User, Share2, Facebook, Twitter, Mail, Copy, Check, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSEOOverride } from "@/contexts/SEOOverrideContext";

import cycleOfAddictionImg from "@/assets/blog-cycle-of-addiction.jpg";
import { blogPosts, imageMap } from "./Blog";
import FamilyBridgeCTA from "@/components/FamilyBridgeCTA";

const BASE_URL = "https://soberhelpline.com";

const BlogArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { setOverridden } = useSEOOverride();
  
  // Check for slug-based route first, then fall back to id-based
  const currentPath = window.location.pathname;
  const post = blogPosts.find(p => {
    const slug = (p as any).slug;
    if (slug) {
      // Match both /blog/slug and /slug patterns
      if (currentPath === `/${slug}` || currentPath === `/blog/${slug}`) return true;
    }
    return false;
  }) || (id ? blogPosts.find(p => p.id?.toString() === id) : undefined);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

  // Direct DOM manipulation for SEO — bypasses react-helmet-async override issues
  // Tell DefaultSEO to skip — BlogArticle manages its own SEO
  useEffect(() => {
    setOverridden(true);
    return () => setOverridden(false);
  }, [setOverridden]);

  useEffect(() => {
    if (!post) return;

    const slug = (post as any).slug || `blog/${post.id}`;
    const canonicalUrl = `${BASE_URL}/${slug}`;
    const seoDescription = (post as any).metaDescription || post.excerpt || (post.content ? post.content.substring(0, 155) + '...' : '');
    const fullImageUrl = post.image?.startsWith('http') ? post.image : `${BASE_URL}${post.image}`;

    // Build truncated title
    const suffix = ' | Sober Helpline';
    const baseSeoTitle = (post as any).seoTitle || post.title;
    const maxLen = 60 - suffix.length;
    const seoTitle = baseSeoTitle.includes('Sober Helpline')
      ? baseSeoTitle
      : baseSeoTitle.length > maxLen
        ? `${baseSeoTitle.substring(0, maxLen - 3)}...${suffix}`
        : `${baseSeoTitle}${suffix}`;

    // 1. Title
    document.title = seoTitle;

    // Helper: set or create a meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Meta description
    setMeta('name', 'description', seoDescription);

    // 3. Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 4. OG tags
    setMeta('property', 'og:title', seoTitle);
    setMeta('property', 'og:description', seoDescription);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:image', fullImageUrl);
    setMeta('property', 'og:site_name', 'Sober Helpline');
    setMeta('property', 'article:published_time', post.date);
    setMeta('property', 'article:author', post.author);
    setMeta('property', 'article:section', post.category);

    // 5. Twitter tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', '@SoberHelpline');
    setMeta('name', 'twitter:title', seoTitle);
    setMeta('name', 'twitter:description', seoDescription);
    setMeta('name', 'twitter:image', fullImageUrl);

    // 6. Article JSON-LD schema
    const existingArticleSchema = document.querySelector('script[data-schema="article"]');
    if (existingArticleSchema) existingArticleSchema.remove();

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.setAttribute('data-schema', 'article');
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": seoDescription,
      "image": fullImageUrl,
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
        "@id": canonicalUrl
      },
      "articleSection": post.category,
      "isAccessibleForFree": true,
      "keywords": (post as any).keywords || [post.category, "addiction recovery", "family support"]
    });
    document.head.appendChild(schema);

    // Cleanup on unmount
    return () => {
      const articleSchema = document.querySelector('script[data-schema="article"]');
      if (articleSchema) articleSchema.remove();
    };
  }, [post]);

  if (!post) return null;

  const copyLink = async () => {
    const url = window.location.href;
    const textToCopy = `${post.title} - Sober Helpline\n${url}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.log('Failed to copy link');
    }
  };

  const getShareUrls = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      twitter: `https://x.com/intent/tweet?url=${pageUrl}&text=${title}`,
      email: `mailto:?subject=${title}&body=${title}%0A%0A${text}%0A%0ARead more: ${decodeURIComponent(pageUrl)}`,
    };
  };

  const shareUrls = getShareUrls();

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8">

        {/* Article */}
        <article className="max-w-3xl mx-auto">
          <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
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
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a 
                    href={shareUrls.twitter}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Twitter className="w-4 h-4" />
                    X
                  </a>
                  <a 
                    href={shareUrls.email}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  {navigator.share && (
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
              alt={post.title} 
              className="w-full h-48 sm:h-72 md:h-96 object-cover rounded-lg mb-6 sm:mb-8"
            />
          )}

          {/* Content */}
          <div className="prose prose-sm sm:prose-lg max-w-none">
            {post.content && renderContent(post.content)}
          </div>

          {/* Membership CTA */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-logo-green/5 via-emerald-50 to-white border border-logo-green/20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-logo-green/10 text-logo-green text-xs font-semibold mb-3">
                <BookOpen className="w-3 h-3" />
                Member Resource
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                This is just one of 62+ resources available to members
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 max-w-lg mx-auto">
                Get access to interactive tools, guided meditations, AI coaching, our private family forum, and weekly Monday Night Zoom sessions.
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
  );
};

export default BlogArticle;
