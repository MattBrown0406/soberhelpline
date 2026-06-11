import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Home, Phone, Search, Users, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Sober Helpline</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://soberhelpline.com/404" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="text-center max-w-lg">
        <img src={logo} alt="Sober Helpline" className="h-20 w-20 mx-auto mb-6 object-contain" />
        <h1 className="mb-2 text-6xl font-bold text-logo-blue">404</h1>
        <p className="mb-2 text-xl font-semibold text-foreground">Page Not Found</p>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or may have moved. 
          But we're still here to help.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link to="/">
            <Button className="bg-logo-green hover:bg-logo-green/90 text-white gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <a href="tel:4582027900">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Phone className="w-4 h-4" />
              Call (458) 202-7900
            </Button>
          </a>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm font-medium text-muted-foreground mb-4">Looking for something specific?</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link to="/family-membership" className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors">
              <Users className="w-4 h-4 text-logo-blue" />
              <span>Family Membership</span>
            </Link>
            <Link to="/inpatient-treatment" className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors">
              <Search className="w-4 h-4 text-logo-blue" />
              <span>Find Treatment</span>
            </Link>
            <Link to="/blog" className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors">
              <BookOpen className="w-4 h-4 text-logo-blue" />
              <span>Blog & Resources</span>
            </Link>
            <Link to="/for-providers" className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors">
              <Heart className="w-4 h-4 text-logo-blue" />
              <span>For Providers</span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default NotFound;
