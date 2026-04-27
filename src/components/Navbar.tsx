import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Menu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { useEffect, useState } from "react";

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  variant?: "light" | "dark";
}

export function Navbar({ lang, onToggleLang, variant = "light" }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: t(lang, "nav.home") },
    { path: "/stylevu", label: t(lang, "nav.forBrands") },
    { path: "/#how-it-works", label: t(lang, "nav.howItWorks"), isAnchor: true },
    { path: "/ecosystem", label: t(lang, "footer.architecture") },
  ];

  const handleNav = (item: typeof navItems[0]) => {
    setMobileOpen(false);
    if (item.isAnchor) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }), 120);
      } else {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.path);
    }
  };

  // Style variants
  const isDark = variant === "dark";
  const shellBg = isDark
    ? `bg-background/70 backdrop-blur-xl border-b border-border/40`
    : scrolled
      ? "bg-[hsl(var(--m-bg)/0.85)] backdrop-blur-xl border-b border-[hsl(var(--m-line))]"
      : "bg-transparent border-b border-transparent";

  const inkText = isDark ? "text-foreground" : "text-[hsl(var(--m-ink))]";
  const mutedText = isDark ? "text-muted-foreground" : "text-[hsl(var(--m-ink-soft))]";
  const hoverText = isDark ? "hover:text-foreground" : "hover:text-[hsl(var(--m-ink))]";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${shellBg}`}>
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-3 ${isDark ? "bg-primary" : "bg-[hsl(var(--m-ink))]"}`}>
            <span className={`font-heading text-sm font-bold ${isDark ? "text-primary-foreground" : "text-[hsl(var(--m-bg))]"}`}>BD</span>
          </div>
          <span className={`font-heading text-lg font-bold ${inkText}`}>
            {lang === "bn" ? "বিডি এআই" : "BDai"}
            <span className={isDark ? "text-primary" : "text-[hsl(var(--m-accent))]"}>.studio</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = !item.isAnchor && isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item)}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  active
                    ? isDark ? "text-primary" : "text-[hsl(var(--m-ink))] bg-[hsl(var(--m-bg-alt))]"
                    : `${mutedText} ${hoverText}`
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${mutedText} ${hoverText}`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className={lang === "bn" ? "font-bengali" : ""}>{lang === "en" ? "বাংলা" : "English"}</span>
          </button>

          {!isDark && (
            <Button
              size="sm"
              onClick={() => navigate("/upload")}
              className="hidden sm:inline-flex h-9 rounded-full bg-[hsl(var(--m-ink))] hover:bg-[hsl(var(--m-accent))] text-[hsl(var(--m-bg))] px-4 gap-1.5"
            >
              {t(lang, "nav.tryItFree")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={inkText}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={`w-72 ${isDark ? "bg-card border-border" : "bg-[hsl(var(--m-bg))] border-[hsl(var(--m-line))]"}`}
            >
              <div className="flex flex-col gap-1 mt-10">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item)}
                    className={`text-left text-base font-medium py-3 px-3 rounded-xl transition-colors ${
                      !item.isAnchor && isActive(item.path)
                        ? isDark ? "text-primary bg-primary/10" : "text-[hsl(var(--m-ink))] bg-[hsl(var(--m-bg-alt))]"
                        : `${mutedText} ${hoverText}`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); onToggleLang(); }}
                  className={`text-left text-base font-medium py-3 px-3 rounded-xl ${mutedText}`}
                >
                  <Globe className="inline h-4 w-4 mr-2" />
                  {lang === "en" ? "বাংলা" : "English"}
                </button>
                <Button
                  onClick={() => { setMobileOpen(false); navigate("/upload"); }}
                  className={`mt-4 rounded-full ${isDark ? "" : "bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))] hover:bg-[hsl(var(--m-accent))]"}`}
                >
                  {t(lang, "nav.tryItFree")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
