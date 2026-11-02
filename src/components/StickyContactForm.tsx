import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Use the existing contact choices rather than collecting an unsent message.
const StickyContactForm = () => (
  <Link
    to="/contact"
    className="fixed bottom-4 right-4 z-[100] flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    aria-label="Contact Sober Helpline"
  >
    <MessageCircle className="h-6 w-6" aria-hidden="true" />
    <span className="text-sm font-semibold">Contact us</span>
  </Link>
);

export default StickyContactForm;
