import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
}

export function Navbar({ lang, onToggleLang }: NavbarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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

        <div className="hidden md:flex items-center gap-6">
          {[
            { path: "/", label: t(lang, "nav.home") },
            { path: "/stylevu", label: t(lang, "nav.stylevu") },
            { path: "/ecosystem", label: t(lang, "nav.ecosystem") },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLang}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          <span className={lang === "bn" ? "font-bengali" : ""}>{lang === "en" ? "বাংলা" : "English"}</span>
        </Button>
      </div>
    </nav>
  );
}
