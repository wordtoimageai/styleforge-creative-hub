import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface EcosystemPageProps {
  lang: Language;
}

const domains = [
  { name: "startbd.com", role: "Parent Company", color: "text-foreground" },
  { name: "bdai.ai", role: "AI Platform Hub", color: "text-brand-green" },
  { name: "bdai.dev", role: "Developer APIs & Tools", color: "text-brand-blue" },
  { name: "bdai.studio", role: "Creative AI Studio", color: "text-brand-orange" },
];

const subdomains = [
  { name: "bdai.studio", desc: "Consumer app (public try-on)" },
  { name: "brands.bdai.studio", desc: "Brand dashboard" },
  { name: "api.bdai.studio", desc: "AI proxy (Edge Functions)" },
  { name: "{brand}.bdai.studio", desc: "White-label brand apps" },
];

const techStack = [
  { category: "Frontend", items: ["React + TypeScript", "Tailwind CSS", "Lovable"] },
  { category: "Backend", items: ["Lovable Cloud", "Edge Functions", "PostgreSQL"] },
  { category: "AI", items: ["Gemini 2.5 Flash Image", "Lovable AI Gateway"] },
  { category: "Infrastructure", items: ["Cloudflare DNS", "R2 Storage", "CDN"] },
];

const brandColors = [
  { name: "Green", hex: "#00DC82", hsl: "152 100% 43%", usage: "Primary / CTA" },
  { name: "Blue", hex: "#0096FF", hsl: "210 100% 50%", usage: "Secondary / Links" },
  { name: "Orange", hex: "#FF9500", hsl: "35 100% 50%", usage: "Accent / Highlights" },
  { name: "Background", hex: "#0A0A0F", hsl: "240 20% 4%", usage: "Dark surfaces" },
];

export default function EcosystemPage({ lang }: EcosystemPageProps) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          {t(lang, "nav.home")}
        </Button>

        <h1 className={`text-3xl md:text-4xl font-heading font-bold text-foreground mb-2 ${lang === "bn" ? "font-bengali" : ""}`}>
          {t(lang, "ecosystem.title")}
        </h1>
        <p className={`text-lg text-muted-foreground mb-12 ${lang === "bn" ? "font-bengali" : ""}`}>
          {t(lang, "ecosystem.subtitle")}
        </p>

        {/* Brand Architecture */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">Brand Architecture</h2>
          <div className="glass-card p-6">
            <div className="space-y-4">
              {domains.map((d, i) => (
                <div key={d.name} className={`flex items-center gap-4 ${i > 0 ? "ml-8" : ""}`}>
                  {i > 0 && <span className="text-muted-foreground">├──</span>}
                  <span className={`font-heading font-bold ${d.color}`}>{d.name}</span>
                  <span className="text-sm text-muted-foreground">→ {d.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subdomains */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">Domain Strategy</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {subdomains.map((s) => (
              <div key={s.name} className="glass-card p-4">
                <p className="font-heading font-semibold text-primary text-sm mb-1">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {techStack.map((cat) => (
              <div key={cat.category} className="glass-card p-5">
                <h3 className="font-heading font-semibold text-foreground mb-3">{cat.category}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Guide */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">Brand Guide</h2>
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brandColors.map((c) => (
                <div key={c.name}>
                  <div className="h-16 rounded-lg mb-2" style={{ backgroundColor: c.hex }} />
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.hex}</p>
                  <p className="text-xs text-muted-foreground">{c.usage}</p>
                </div>
              ))}
            </div>

            <h3 className="font-heading font-semibold text-foreground mt-8 mb-4">Typography</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="font-heading text-lg font-bold text-foreground">Syne</p>
                <p className="text-xs text-muted-foreground">Headings & branding</p>
              </div>
              <div>
                <p className="font-body text-lg font-medium text-foreground">Outfit</p>
                <p className="text-xs text-muted-foreground">Body text & UI</p>
              </div>
              <div>
                <p className="font-bengali text-lg font-medium text-foreground">নোটো সানস বাংলা</p>
                <p className="text-xs text-muted-foreground">Bengali text</p>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">Revenue Model</h2>
          <div className="glass-card p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-heading font-semibold text-primary mb-2">B2C — Free</h3>
                <p className="text-sm text-muted-foreground">Consumer virtual try-on with BDai watermark. Ad-supported.</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-secondary mb-2">B2B — SaaS</h3>
                <p className="text-sm text-muted-foreground">White-label for brands. ৳4,999–৳14,999/month tiers.</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-accent mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground">Custom deployment, API access, dedicated support.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
