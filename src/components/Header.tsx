import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import mumbsoLogo from "@/assets/mumbso-logo.jpg";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { 
      label: "About", 
      submenu: [
        { path: "/about", label: "About Us" },
        { path: "/constitution", label: "Constitution" },
      ]
    },
    { 
      label: "Programs & Research", 
      submenu: [
        { path: "/programs", label: "Programs" },
        { path: "/research", label: "Research" },
      ]
    },
    { 
      label: "Updates", 
      submenu: [
        { path: "/events", label: "Events" },
        { path: "/news", label: "News" },
      ]
    },
    { path: "/members", label: "Members" },
    { path: "/contribution", label: "Support Us" },
    { path: "/gallery", label: "Gallery" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={mumbsoLogo} 
            alt="MUMBSO Logo" 
            className="h-12 w-12 object-contain"
          />
          <span className="hidden font-bold sm:inline-block lg:text-base text-sm">MUMBSO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-3 lg:gap-4">
          {navItems.map((item) => 
            'submenu' in item ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <button className="text-xs lg:text-sm font-medium transition-colors hover:text-primary whitespace-nowrap text-foreground/60">
                    {item.label}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.submenu.map((subitem) => (
                    <DropdownMenuItem key={subitem.path} asChild>
                      <Link to={subitem.path}>
                        {subitem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs lg:text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive(item.path) ? "text-primary" : "text-foreground/60"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <DarkModeToggle />
          <Button variant="hero" size="sm" onClick={() => navigate("/join")} className="whitespace-nowrap">
            Join MUMBSO
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => 
              'submenu' in item ? (
                <div key={item.label}>
                  <button
                    onClick={() => setExpandedSubmenu(expandedSubmenu === item.label ? null : item.label)}
                    className="w-full text-left px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-foreground/60"
                  >
                    {item.label}
                  </button>
                  {expandedSubmenu === item.label && (
                    <div className="ml-4 flex flex-col space-y-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          onClick={() => {
                            setIsOpen(false);
                            setExpandedSubmenu(null);
                          }}
                          className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                            isActive(subitem.path) ? "text-primary" : "text-foreground/60"
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-foreground/60"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Theme</span>
              <DarkModeToggle />
            </div>
            <Button 
              variant="hero" 
              size="sm" 
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                navigate("/join");
              }}
            >
              Join MUMBSO
            </Button>
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/dashboard");
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/auth");
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
