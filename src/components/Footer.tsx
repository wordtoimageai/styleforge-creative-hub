import { Link } from "react-router-dom";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  return (
    <footer className="border-t border-border/30 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="font-heading text-xs font-bold text-primary-foreground">BD</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {t(lang, "footer.ecosystem")}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="https://startbd.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              startbd.com
            </a>
            <a href="https://bdai.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              bdai.ai
            </a>
            <a href="https://bdai.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              bdai.dev
            </a>
            <Link to="/ecosystem" className="hover:text-foreground transition-colors">
              Architecture
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 BDai.studio — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
