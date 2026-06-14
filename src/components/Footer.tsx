import { Link } from "react-router-dom";
import { Phone, Mail, Heart } from "lucide-react";
import logo from "@/assets/logo.png";
import { trackConversionEvent, trackPhoneClick } from "@/lib/conversionTracking";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 rounded-lg border border-gray-800 bg-gray-800/60 p-5">
          <p className="text-sm font-semibold text-logo-blue mb-2">Families usually need one clear next step</p>
          <div className="grid gap-3 md:grid-cols-3">
            <Link to="/family-consultation" onClick={() => trackConversionEvent("coaching_click", { source: "footer_path_card" })} className="rounded-md border border-gray-700 p-4 transition-colors hover:border-logo-green hover:bg-gray-800">
              <p className="font-semibold text-white">Private coaching</p>
              <p className="mt-1 text-sm text-gray-400">Book a Crisis Coaching Session for direct family guidance.</p>
            </Link>
            <Link to="/family-squares" onClick={() => trackConversionEvent("monday_zoom_click", { source: "footer_path_card" })} className="rounded-md border border-gray-700 p-4 transition-colors hover:border-logo-green hover:bg-gray-800">
              <p className="font-semibold text-white">Monday Family Squares</p>
              <p className="mt-1 text-sm text-gray-400">Join the free Monday night family support Zoom.</p>
            </Link>
            <Link to="/intervention-help" onClick={() => trackConversionEvent("intervention_readiness_click", { source: "footer_path_card" })} className="rounded-md border border-gray-700 p-4 transition-colors hover:border-logo-green hover:bg-gray-800">
              <p className="font-semibold text-white">Intervention planning</p>
              <p className="mt-1 text-sm text-gray-400">Assess readiness for a professional Freedom Interventions path.</p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Sober Helpline" className="h-12 w-12 object-contain" />
              <span className="font-semibold text-white text-lg">Sober Helpline</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Education and support for families affected by addiction. You don't have to go through this alone.
            </p>
            <a href="tel:4582027900" onClick={() => trackPhoneClick("footer_brand")} className="flex items-center gap-2 text-white font-semibold hover:text-white/80 transition-colors">
              <Phone className="w-4 h-4" />
              (458) 202-7900
            </a>
          </div>

          {/* For Families */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Families</h4>
            <ul className="space-y-2">
              <li><Link to="/family-membership" className="text-sm hover:text-white transition-colors">Membership</Link></li>
              <li><Link to="/start-here" className="text-sm hover:text-white transition-colors">Start Here</Link></li>
              <li><Link to="/family-forum" className="text-sm hover:text-white transition-colors">Family Forum</Link></li>
              <li><Link to="/family-education" className="text-sm hover:text-white transition-colors">Education Center</Link></li>
              <li><Link to="/blog" className="text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/family-coaching" className="text-sm hover:text-white transition-colors">Coaching</Link></li>
              <li><Link to="/family-consultation" className="text-sm hover:text-white transition-colors">Crisis Coaching Session</Link></li>
              <li><Link to="/intervention-help" className="text-sm hover:text-white transition-colors">Intervention Readiness</Link></li>
              <li><Link to="/family-squares" className="text-sm hover:text-white transition-colors">“The Family Squares”</Link></li>
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
              <li><Link to="/partner-with-sober-helpline" className="text-sm hover:text-white transition-colors">Partner Overview</Link></li>
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
              <li><Link to="/support" className="text-sm hover:text-white transition-colors">App Support</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/testimonials" className="text-sm hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link to="/recovery-resources" className="text-sm hover:text-white transition-colors">Recovery Resources</Link></li>
              <li><Link to="/recovery-podcasts" className="text-sm hover:text-white transition-colors">Recovery Podcasts</Link></li>
              <li><Link to="/california-family-support" className="text-sm hover:text-white transition-colors">California Family Support</Link></li>
              <li><Link to="/oregon-family-support" className="text-sm hover:text-white transition-colors">Oregon Family Support</Link></li>
              <li><Link to="/washington-family-support" className="text-sm hover:text-white transition-colors">Washington Family Support</Link></li>
              <li><Link to="/idaho-family-support" className="text-sm hover:text-white transition-colors">Idaho Family Support</Link></li>
              <li><Link to="/utah-family-support" className="text-sm hover:text-white transition-colors">Utah Family Support</Link></li>
              <li><Link to="/nevada-family-support" className="text-sm hover:text-white transition-colors">Nevada Family Support</Link></li>
              <li><Link to="/arizona-family-support" className="text-sm hover:text-white transition-colors">Arizona Family Support</Link></li>
              <li><Link to="/colorado-family-support" className="text-sm hover:text-white transition-colors">Colorado Family Support</Link></li>
              <li><Link to="/new-mexico-family-support" className="text-sm hover:text-white transition-colors">New Mexico Family Support</Link></li>
              <li><Link to="/texas-family-support" className="text-sm hover:text-white transition-colors">Texas Family Support</Link></li>
            </ul>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-white mb-1">Need Help Now?</p>
              <p className="text-xs text-gray-400 mb-2">SAMHSA National Helpline</p>
              <a href="tel:18006624357" className="text-logo-blue font-semibold text-sm hover:text-logo-blue/80 transition-colors">
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
            Made with <Link to="/admin"><Heart className="w-3 h-3 text-red-400 cursor-pointer" /></Link> for families who never give up
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
