import { MapPin, Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-foreground text-background px-2 py-1 rounded font-bold text-sm">
              UC
            </div>
            <span className="font-bold text-lg hidden sm:inline">Urban Company</span>
          </Link>

          {/* Center Section: Location & Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Location Selector */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors shrink-0">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm hidden md:inline">Connaught Place, New...</span>
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for AC se..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
