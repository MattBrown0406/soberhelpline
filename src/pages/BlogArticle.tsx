import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Phone, Calendar, User, Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "@/assets/logo.png";
import cycleOfAddictionImg from "@/assets/blog-cycle-of-addiction.jpg";
import { blogPosts, imageMap } from "./Blog";

const BlogArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const post = blogPosts.find(p => p.id.toString() === id);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
  }, [post, navigate]);

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

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    const text = encodeURIComponent(post.excerpt);

    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${title}%0A%0A${text}%0A%0A${url}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: post.title,
            text: post.excerpt,
            url: window.location.href,
          }).catch(err => console.log('Share cancelled'));
        }
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
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

  const fullImageUrl = window.location.origin + post.image;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} - Sober Helpline</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={fullImageUrl} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/blog">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:5412415886" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">(541) 241-5886</span>
            </a>
            <img src={logo} alt="Sober Helpline" className="h-16 w-auto" />
          </div>
        </div>

        {/* Article */}
        <div className="max-w-3xl mx-auto">
          <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    X
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => shareToSocial('linkedin')}
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => shareToSocial('email')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  {navigator.share && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => shareToSocial('native')}
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
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content && renderContent(post.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
