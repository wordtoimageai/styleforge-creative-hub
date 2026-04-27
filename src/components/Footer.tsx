import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Facebook, Linkedin, ArrowUpRight } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface FooterProps {
  lang: Language;
}

const Footer = ({ lang }: FooterProps) => {
  const bn = lang === "bn";
  const bengali = bn ? "font-bengali" : "";

  const productLinks = [
    { label: t(lang, "nav.home"), to: "/" },
    { label: t(lang, "nav.forBrands"), to: "/stylevu" },
    { label: t(lang, "nav.howItWorks"), to: "/#how-it-works" },
    { label: t(lang, "footer.architecture"), to: "/ecosystem" },
  ];
  const companyLinks = [
    { label: bn ? "আমাদের সম্পর্কে" : "About", to: "/ecosystem" },
    { label: t(lang, "footer.contact"), href: "mailto:hello@bdai.studio" },
    { label: t(lang, "footer.blog"), href: "#" },
  ];
  const resourceLinks = [
    { label: t(lang, "footer.privacy"), href: "#" },
    { label: t(lang, "footer.terms"), href: "#" },
    { label: t(lang, "footer.whatsapp"), href: "https://wa.me/8801XXXXXXXXX" },
  ];

  return (
    <footer className="relative pt-20 pb-10 px-4 lg:px-6 border-t border-[hsl(var(--m-line))] bg-[hsl(var(--m-bg))]">
      <div className="container mx-auto max-w-6xl">
        {/* Newsletter band */}
        <div className="m-card-feature flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16 bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))] border-transparent">
          <div className="max-w-md">
            <h3 className={`m-display text-2xl md:text-3xl font-bold ${bengali}`}>
              {t(lang, "footer.newsletterTitle")}
            </h3>
            <p className={`text-sm text-[hsl(var(--m-bg))]/70 mt-2 ${bengali}`}>
              {t(lang, "footer.newsletterDesc")}
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full md:w-auto gap-2"
          >
            <input
              type="email"
              required
              placeholder={bn ? "আপনার ইমেইল" : "you@brand.com"}
              className="flex-1 md:w-72 h-11 px-4 rounded-full bg-[hsl(var(--m-bg))]/10 border border-[hsl(var(--m-bg))]/15 text-[hsl(var(--m-bg))] placeholder:text-[hsl(var(--m-bg))]/50 outline-none focus:border-[hsl(var(--m-bg))]/40"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-full bg-[hsl(var(--m-bg))] text-[hsl(var(--m-ink))] font-semibold text-sm inline-flex items-center gap-1.5 hover:bg-[hsl(var(--m-accent))] hover:text-[hsl(var(--m-bg))] transition-colors"
            >
              {t(lang, "footer.newsletterCta")}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-14">
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-[hsl(var(--m-ink))] flex items-center justify-center">
                <span className="font-heading text-sm font-bold text-[hsl(var(--m-bg))]">BD</span>
              </div>
              <span className="font-heading text-lg font-bold text-[hsl(var(--m-ink))]">
                BDai<span className="text-[hsl(var(--m-accent))]">.studio</span>
              </span>
            </Link>
            <p className={`text-sm text-[hsl(var(--m-ink-soft))] max-w-xs ${bengali}`}>
              {t(lang, "footer.tagline")}
            </p>
            <div className="flex items-center gap-2 mt-5">
              {[Instagram, Facebook, Linkedin, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[hsl(var(--m-line))] text-[hsl(var(--m-ink-soft))] hover:text-[hsl(var(--m-ink))] hover:border-[hsl(var(--m-ink))] transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title={t(lang, "footer.product")} bengali={bengali}>
            {productLinks.map((l) => (
              <Link key={l.label} to={l.to} className="m-link-underline">{l.label}</Link>
            ))}
          </FooterCol>

          <FooterCol title={t(lang, "footer.company")} bengali={bengali}>
            {companyLinks.map((l) =>
              "to" in l && l.to ? (
                <Link key={l.label} to={l.to} className="m-link-underline">{l.label}</Link>
              ) : (
                <a key={l.label} href={l.href} className="m-link-underline">{l.label}</a>
              )
            )}
          </FooterCol>

          <FooterCol title={t(lang, "footer.resources")} bengali={bengali}>
            {resourceLinks.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="m-link-underline">
                {l.label}
              </a>
            ))}
          </FooterCol>
        </div>

        <div className="m-divider mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[hsl(var(--m-muted))]">
          <p>© {new Date().getFullYear()} BDai.studio · {t(lang, "footer.ecosystem")}</p>
          <p className={bengali}>🇧🇩 {t(lang, "footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
};

function FooterCol({ title, bengali, children }: { title: string; bengali: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--m-ink))] mb-4 ${bengali}`}>
        {title}
      </p>
      <div className={`flex flex-col gap-3 text-sm text-[hsl(var(--m-ink-soft))] ${bengali}`}>
        {children}
      </div>
    </div>
  );
}

export { Footer };
