import { ArrowLeft, Phone, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const blogPosts = [
  {
    id: 1,
    title: "Motivating Your Reluctant Loved One",
    excerpt: "When someone you care about is struggling with addiction but resistant to help, it can feel hopeless. Discover compassionate strategies to encourage treatment without pushing them away.",
    author: "Sober Helpline Team",
    date: "2024-11-25",
    category: "Family Support"
  },
  {
    id: 2,
    title: "Understanding the First Steps of Recovery",
    excerpt: "Recovery is a journey that begins with a single step. Learn about the crucial first steps that can set you or your loved one on the path to lasting sobriety.",
    author: "Sober Helpline Team",
    date: "2024-01-15",
    category: "Recovery Basics"
  },
  {
    id: 3,
    title: "How to Support a Loved One in Treatment",
    excerpt: "Supporting someone through addiction treatment can be challenging. Discover effective ways to be there for your loved one while maintaining healthy boundaries.",
    author: "Sober Helpline Team",
    date: "2024-01-10",
    category: "Family Support"
  },
  {
    id: 4,
    title: "The Importance of Aftercare in Recovery",
    excerpt: "Treatment is just the beginning. Learn why aftercare programs are essential for maintaining long-term sobriety and preventing relapse.",
    author: "Sober Helpline Team",
    date: "2024-01-05",
    category: "Aftercare"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
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

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Recovery Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, stories, and resources to support you and your loved ones on the journey to recovery.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
              </CardContent>
            </Card>
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
