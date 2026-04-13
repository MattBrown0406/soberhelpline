import { Helmet } from "react-helmet-async";
import { ArrowLeft, Phone, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Addiction Recovery Blog | Sober Helpline</title>
        <meta name="description" content="Expert guidance on addiction recovery, treatment options, family support, and helping loved ones find healing. Read our latest articles." />
        <link rel="canonical" href="https://soberhelpline.com/blog" />
        <meta property="og:title" content="Addiction Recovery Blog | Sober Helpline" />
        <meta property="og:description" content="Expert guidance on addiction recovery, treatment options, family support, and helping loved ones find healing." />
        <meta property="og:url" content="https://soberhelpline.com/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Addiction Recovery Blog | Sober Helpline" />
        <meta name="twitter:description" content="Expert guidance on addiction recovery, treatment options, family support, and helping loved ones find healing." />
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Recovery Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, stories, and resources to support you and your loved ones on the journey to recovery.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post) => (
            <Link key={post.id} to={post.content ? `/blog/${post.id}` : '#'} className={post.content ? '' : 'pointer-events-none'}>
              <Card className={`hover:shadow-lg transition-shadow overflow-hidden h-full ${post.content ? 'cursor-pointer' : ''}`}>
                {post.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {post.content && (
                    <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                      Read Full Article →
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center mt-12 p-8 bg-muted rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">More Content Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on bringing you more valuable content about recovery, treatment options, and family support. Check back regularly for updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
