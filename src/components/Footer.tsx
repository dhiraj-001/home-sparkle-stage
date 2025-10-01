import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-foreground text-background px-2 py-1 rounded font-bold text-sm">
              UC
            </div>
            <span className="font-bold text-lg">Urban Company</span>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About us</Link></li>
              <li><Link to="/investors" className="text-muted-foreground hover:text-primary transition-colors">Investor Relations</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy policy</Link></li>
              <li><Link to="/anti-discrimination" className="text-muted-foreground hover:text-primary transition-colors">Anti-discrimination policy</Link></li>
              <li><Link to="/esg" className="text-muted-foreground hover:text-primary transition-colors">ESG Impact</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="font-bold mb-4">For customers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/reviews" className="text-muted-foreground hover:text-primary transition-colors">UC reviews</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories near you</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact us</Link></li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="font-bold mb-4">For professionals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Register as a professional</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-4">Social links</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* App Download */}
            <div className="space-y-2">
              <a href="#" className="block">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on App Store" 
                  className="h-10"
                />
              </a>
              <a href="#" className="block">
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-12 -ml-1"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Urban Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
