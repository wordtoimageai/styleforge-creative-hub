import { useNavigate } from "react-router-dom";
import { Check, Sparkles, BarChart3, Globe, Shield, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface StyleVuPageProps {
  lang: Language;
}

const features = [
  { icon: Sparkles, title: "AI Virtual Try-On", desc: "Let customers see garments on themselves in real-time" },
  { icon: Palette, title: "White-Label Ready", desc: "Your brand, your colors, your domain — fully customizable" },
  { icon: Globe, title: "Bengali + English", desc: "Native bilingual support for the Bangladesh market" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track try-ons, conversions, and customer engagement" },
  { icon: Shield, title: "Privacy Compliant", desc: "Photos processed in memory, never stored permanently" },
  { icon: Zap, title: "30-Second Results", desc: "Fast AI processing powered by Gemini" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "৳4,999",
    period: "/month",
    features: ["500 try-ons/month", "1 brand domain", "Email support", "Basic analytics"],
  },
  {
    name: "Growth",
    price: "৳14,999",
    period: "/month",
    popular: true,
    features: ["5,000 try-ons/month", "3 brand domains", "Priority support", "Full analytics", "Custom styles"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited try-ons", "Unlimited domains", "Dedicated support", "API access", "On-premise option"],
  },
];

export default function StyleVuPage({ lang }: StyleVuPageProps) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative px-4 py-20 text-center">
        <div className="absolute inset-0 gradient-bg pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
            {t(lang, "stylevu.ramadan")}
          </Badge>
          <h1 className={`text-3xl md:text-5xl font-heading font-bold text-foreground mb-4 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "stylevu.hero")}
          </h1>
          <p className={`text-lg text-muted-foreground mb-4 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "stylevu.subtitle")}
          </p>
          <p className="text-2xl font-heading font-bold text-primary mb-8">
            {t(lang, "stylevu.pricing")}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/onboarding")} className="bg-primary text-primary-foreground px-8">
              {t(lang, "stylevu.cta")}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className={`text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-12 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "stylevu.features")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-card p-6">
                <f.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className={`text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-12 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "stylevu.pricingTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card p-6 relative ${tier.popular ? "border-primary glow-green" : ""}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${tier.popular ? "bg-primary text-primary-foreground" : ""}`}
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => navigate("/onboarding")}
                >
                  {t(lang, "stylevu.cta")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
