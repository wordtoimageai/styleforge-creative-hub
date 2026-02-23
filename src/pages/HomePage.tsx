import { useNavigate } from "react-router-dom";
import { Camera, Sparkles, Shield, Zap, MapPin, Globe, Layers, Shirt, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Language } from "@/lib/i18n";
import type { AppMode } from "@/lib/app-state";
import { t } from "@/lib/i18n";

interface HomePageProps {
  lang: Language;
  onSelectMode: (mode: AppMode) => void;
}

const features = [
  { icon: Sparkles, key: "features.gemini" },
  { icon: Zap, key: "features.fast" },
  { icon: MapPin, key: "features.madeBD" },
  { icon: Shield, key: "features.privacy" },
  { icon: Globe, key: "features.bilingual" },
  { icon: Layers, key: "features.whiteLabel" },
];

const HomePage = ({ lang, onSelectMode }: HomePageProps) => {
  const navigate = useNavigate();

  const handleStart = (mode: AppMode) => {
    onSelectMode(mode);
    navigate("/upload");
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl float-animation" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl float-animation" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 pt-20 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              {lang === "bn" ? "🇧🇩 বাংলাদেশে তৈরি" : "🇧🇩 Made in Bangladesh"}
            </span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-slide-up-delay-1 ${lang === "bn" ? "font-bengali" : ""}`}>
            <span className="gradient-text">{t(lang, "heroTitle")}</span>
          </h1>

          <p className={`text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up-delay-2 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-3">
            <Button
              size="lg"
              onClick={() => handleStart("tryon")}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-green text-base px-8 py-6"
            >
              <Camera className="h-5 w-5" />
              {t(lang, "tryOn")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleStart("style")}
              className="gap-2 border-secondary/50 text-secondary hover:bg-secondary/10 text-base px-8 py-6"
            >
              <Sparkles className="h-5 w-5" />
              {t(lang, "aiStyle")}
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Teaser */}
      <section className="relative px-4 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="dot-grid rounded-2xl p-8 glass-card">
            <div className="flex items-center justify-center gap-6 md:gap-10">
              <div className="w-28 h-36 md:w-36 md:h-44 bg-muted rounded-xl flex items-center justify-center pulse-glow">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">AI</span>
              </div>
              <div className="w-28 h-36 md:w-36 md:h-44 bg-primary/10 rounded-xl border-2 border-primary/30 flex items-center justify-center">
                <Shirt className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {lang === "bn" ? "এআই ট্রাই-অন ডেমো প্রিভিউ" : "AI Try-On Demo Preview"}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: t(lang, "stats.tryOns"), label: t(lang, "stats.tryOnsLabel") },
              { val: t(lang, "stats.speed"), label: t(lang, "stats.speedLabel") },
              { val: t(lang, "stats.brands"), label: t(lang, "stats.brandsLabel") },
            ].map((s, i) => (
              <div
                key={s.label}
                className="glass-card p-6 text-center animate-count-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="text-2xl md:text-4xl font-heading font-bold text-primary mb-1">{s.val}</div>
                <p className={`text-xs md:text-sm text-muted-foreground ${lang === "bn" ? "font-bengali" : ""}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
              {lang === "bn" ? "ওয়ার্কফ্লো" : "Workflow"}
            </span>
            <h2 className={`text-2xl md:text-4xl font-heading font-bold text-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
              {t(lang, "howItWorks.subtitle")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Camera, step: "1", titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc" },
              { icon: Shirt, step: "2", titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc" },
              { icon: Wand2, step: "3", titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc" },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.step} className="glass-card p-8 text-center relative">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-5">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="absolute top-4 right-4 text-xs font-bold text-muted-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center">
                    {item.step}
                  </span>
                  <h3 className={`text-lg font-heading font-bold text-foreground mb-2 ${lang === "bn" ? "font-bengali" : ""}`}>
                    {t(lang, item.titleKey)}
                  </h3>
                  <p className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                    {t(lang, item.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
          {features.map((f, i) => {
            const IconComp = f.icon;
            return (
              <div
                key={f.key}
                className="glass-card p-5 text-center animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <IconComp className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className={`text-sm font-medium text-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                  {t(lang, f.key)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-2xl">
          <h2 className={`text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-10 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "faq.title")}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <AccordionItem key={n} value={`q${n}`} className="glass-card px-5 border-none">
                <AccordionTrigger className={`text-sm text-foreground hover:no-underline ${lang === "bn" ? "font-bengali" : ""}`}>
                  {t(lang, `faq.q${n}`)}
                </AccordionTrigger>
                <AccordionContent className={`text-sm text-muted-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                  {t(lang, `faq.a${n}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto max-w-3xl">
          <div className="gradient-bg rounded-3xl p-10 md:p-16 text-center border border-primary/20">
            <h2 className={`text-2xl md:text-4xl font-heading font-bold text-foreground mb-4 ${lang === "bn" ? "font-bengali" : ""}`}>
              {t(lang, "cta.title")}
            </h2>
            <p className={`text-muted-foreground mb-8 ${lang === "bn" ? "font-bengali" : ""}`}>
              {t(lang, "cta.subtitle")}
            </p>
            <Button
              size="lg"
              onClick={() => handleStart("tryon")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green text-base px-10 py-6"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {t(lang, "cta.button")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
