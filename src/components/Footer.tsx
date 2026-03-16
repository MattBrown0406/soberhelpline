import { Link } from "react-router-dom";
import { Phone, Mail, Heart } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Sober Helpline" className="h-12 w-12 rounded-lg" />
              <span className="font-semibold text-white text-lg">Sober Helpline</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Education and support for families affected by addiction. You don't have to go through this alone.
            </p>
            <a href="tel:5412415886" className="flex items-center gap-2 text-logo-green font-semibold hover:text-logo-green/80 transition-colors">
              <Phone className="w-4 h-4" />
              (541) 241-5886
            </a>
          </div>

          {/* For Families */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Families</h4>
            <ul className="space-y-2">
              <li><Link to="/family-membership" className="text-sm hover:text-white transition-colors">Membership</Link></li>
              <li><Link to="/family-forum" className="text-sm hover:text-white transition-colors">Family Forum</Link></li>
              <li><Link to="/family-education" className="text-sm hover:text-white transition-colors">Education Center</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/family-coaching" className="text-sm hover:text-white transition-colors">Coaching</Link></li>
              <li><Link to="/monday-zoom-registration" className="text-sm hover:text-white transition-colors">Monday Night Zoom</Link></li>
              <li><Link to="/zoom-recordings" className="text-sm hover:text-white transition-colors">Past Recordings</Link></li>
              <li><Link to="/addiction-assessment" className="text-sm hover:text-white transition-colors">Addiction Assessment</Link></li>
              <li><Link to="/free-guide" className="text-sm hover:text-white transition-colors">Free Guide</Link></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Providers</h4>
            <ul className="space-y-2">
              <li><Link to="/for-providers" className="text-sm hover:text-white transition-colors">List Your Practice</Link></li>
              <li><Link to="/provider-info" className="text-sm hover:text-white transition-colors">Provider Application</Link></li>
              <li><Link to="/consultation-provider-dashboard" className="text-sm hover:text-white transition-colors">Provider Dashboard</Link></li>
            </ul>
            <h4 className="font-semibold text-white mt-6 mb-4">Find Treatment</h4>
            <ul className="space-y-2">
              <li><Link to="/inpatient-treatment" className="text-sm hover:text-white transition-colors">Inpatient Treatment</Link></li>
              <li><Link to="/outpatient-treatment" className="text-sm hover:text-white transition-colors">Outpatient Treatment</Link></li>
              <li><Link to="/therapists" className="text-sm hover:text-white transition-colors">Therapists</Link></li>
              <li><Link to="/interventionists" className="text-sm hover:text-white transition-colors">Interventionists</Link></li>
            </ul>
          </div>

          {/* Resources & Trust */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/faqs" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/testimonials" className="text-sm hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link to="/recovery-resources" className="text-sm hover:text-white transition-colors">Recovery Resources</Link></li>
              <li><Link to="/recovery-podcasts" className="text-sm hover:text-white transition-colors">Recovery Podcasts</Link></li>
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-white mb-1">Need Help Now?</p>
              <p className="text-xs text-gray-400 mb-2">SAMHSA National Helpline</p>
              <a href="tel:18006624357" className="text-logo-green font-semibold text-sm hover:text-logo-green/80 transition-colors">
                1-800-662-4357
              </a>
              <p className="text-xs text-gray-500 mt-1">Free, confidential, 24/7</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} Sober Helpline. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> for families who never give up
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
