import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { useState } from "react";

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
}

export function Navbar({ lang, onToggleLang }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: t(lang, "nav.home") },
    { path: "/stylevu", label: t(lang, "nav.forBrands") },
    { path: "/#how-it-works", label: t(lang, "nav.howItWorks"), isAnchor: true },
  ];

  const handleNav = (item: typeof navItems[0]) => {
    setMobileOpen(false);
    if (item.isAnchor) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-heading text-sm font-bold text-primary-foreground">BD</span>
          </div>
          <span className="font-heading text-lg font-bold text-foreground">
            {lang === "bn" ? "বিডি এআই" : "BDai"}<span className="text-primary">.studio</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item)}
              className={`text-sm font-medium transition-colors ${
                !item.isAnchor && isActive(item.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLang}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            <span className={lang === "bn" ? "font-bengali" : ""}>{lang === "en" ? "বাংলা" : "English"}</span>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card border-border">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item)}
                    className={`text-left text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                      !item.isAnchor && isActive(item.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
