import { Helmet } from "react-helmet-async";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts } from "@/data/blogPosts";

const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Sober Helpline Blog",
  description:
    "Clear, grounded guidance for families dealing with addiction, treatment decisions, recovery, and healthy boundaries.",
  url: "https://soberhelpline.com/blog",
  publisher: {
    "@type": "Organization",
    name: "Sober Helpline",
    url: "https://soberhelpline.com",
  },
};

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Family Addiction Recovery Blog | Sober Helpline</title>
        <meta
          name="description"
          content="Clear, grounded articles for families facing addiction, treatment choices, enabling, recovery, and what to do next."
        />
        <link rel="canonical" href="https://soberhelpline.com/blog" />
        <meta property="og:title" content="Family Addiction Recovery Blog | Sober Helpline" />
        <meta
          property="og:description"
          content="Clear, grounded articles for families facing addiction, treatment choices, enabling, recovery, and what to do next."
        />
        <meta property="og:url" content="https://soberhelpline.com/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Family Addiction Recovery Blog | Sober Helpline" />
        <meta
          name="twitter:description"
          content="Clear, grounded articles for families facing addiction, treatment choices, enabling, recovery, and what to do next."
        />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-4">A calmer place to get clear</h1>
          <p className="text-lg text-muted-foreground mx-auto">
            These articles are for families trying to make sense of addiction without getting lost in panic, shame, or noise. We write to help you understand what is happening and make a wiser next move.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedPosts.map((post) => (
            <Link key={post.id} to={post.content ? `/blog/${post.id}` : "#"} className={post.content ? "" : "pointer-events-none"}>
              <Card className={`hover:shadow-lg transition-shadow overflow-hidden h-full ${post.content ? "cursor-pointer" : ""}`}>
                {post.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
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
                      Read article →
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-muted rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">Need support beyond reading?</h3>
          <p className="text-muted-foreground mb-5">
            If you want real-time guidance, start with the Monday family Zoom. It is the best first step for many families who need clarity, support, and a plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/monday-zoom-registration">
              <Button>Join the Monday Zoom</Button>
            </Link>
            <Link to="/family-membership">
              <Button variant="outline">Explore Membership</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
