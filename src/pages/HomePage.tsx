import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera, Sparkles, Shield, Zap, MapPin, Globe, Layers, Shirt, Wand2,
  ArrowUpRight, ArrowRight, Star, Play, Check, X,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BeforeAfterDemo from "@/components/BeforeAfterDemo";
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

const partners = [
  "Aarong", "Yellow", "Sailor", "Cats Eye", "Le Reve", "Ecstasy",
  "Gentle Park", "Anjan's", "Twelve Clothing", "Rang Bangladesh",
];

const HomePage = ({ lang, onSelectMode }: HomePageProps) => {
  const navigate = useNavigate();
  const bn = lang === "bn";
  const bengali = bn ? "font-bengali" : "";
  const [demoOpen, setDemoOpen] = useState(false);

  const handleStart = (mode: AppMode) => {
    onSelectMode(mode);
    navigate("/upload");
  };

  return (
    <main className="relative">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 px-4 lg:px-6 overflow-hidden">
        <div className="absolute inset-0 m-mesh pointer-events-none" />
        <div className="absolute inset-0 m-grain opacity-60 pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="max-w-3xl m-fade-up">
            <span className="m-eyebrow inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--m-accent))]" />
              {t(lang, "home.eyebrow")}
            </span>

            <h1 className={`m-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold mt-6 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "home.titleA")}{" "}
              <span className="m-gradient-text italic">{t(lang, "home.titleB")}</span>{" "}
              {t(lang, "home.titleC")}
            </h1>

            <p className={`mt-7 text-lg md:text-xl text-[hsl(var(--m-ink-soft))] max-w-2xl leading-relaxed ${bengali}`}>
              {t(lang, "home.lede")}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleStart("tryon")}
                className="m-btn-primary h-13 px-7 py-4 text-sm inline-flex items-center justify-center gap-2"
              >
                {t(lang, "home.ctaPrimary")}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                className="m-btn-ghost h-13 px-7 py-4 text-sm inline-flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                {t(lang, "home.ctaSecondary")}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[hsl(var(--m-muted))]">
              <span className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[hsl(var(--m-pop))] text-[hsl(var(--m-pop))]" />
                ))}
              </span>
              <span className={bengali}>{t(lang, "home.microTrust")}</span>
            </div>
          </div>

          {/* Floating preview card */}
          <div className="hidden lg:block absolute right-0 top-32 w-[340px] m-fade-up" style={{ animationDelay: ".15s" }}>
            <div className="m-card p-3 rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[hsl(var(--m-bg-alt))] relative">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
                  alt="AI styled model"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 m-card p-3 backdrop-blur-md bg-[hsl(var(--m-surface)/0.85)] rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--m-accent-ink))] font-semibold">AI Generated</p>
                  <p className="text-sm font-semibold text-[hsl(var(--m-ink))]">Eid '26 Capsule · Look 04</p>
                </div>
              </div>
            </div>
            <div className="m-card p-3 -mt-12 -ml-16 -rotate-6 hover:rotate-0 transition-transform duration-500 w-48">
              <div className="aspect-[3/4] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="relative py-10 px-4 border-y border-[hsl(var(--m-line))] bg-[hsl(var(--m-bg-alt))]">
        <div className="container mx-auto max-w-6xl">
          <p className={`text-center text-xs font-medium uppercase tracking-[0.22em] text-[hsl(var(--m-muted))] mb-6 ${bengali}`}>
            {t(lang, "home.logosTitle")}
          </p>
          <div className="overflow-hidden">
            <div className="flex gap-12 m-marquee whitespace-nowrap" style={{ width: "200%" }}>
              {[...partners, ...partners].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="font-heading text-2xl md:text-3xl font-bold text-[hsl(var(--m-ink))]/40 hover:text-[hsl(var(--m-ink))] transition-colors"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ DEMO ============ */}
      <section id="demo" className="relative px-4 lg:px-6 py-24 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <span className="m-eyebrow">{t(lang, "home.sectionEyebrowProcess")}</span>
              <h2 className={`m-display text-3xl md:text-5xl font-bold mt-4 text-[hsl(var(--m-ink))] ${bengali}`}>
                {t(lang, "home.processTitle")}
              </h2>
              <p className={`mt-5 text-base text-[hsl(var(--m-ink-soft))] ${bengali}`}>
                {bn
                  ? "ডান দিকে স্লাইডার টানুন এবং আগে/পরে তুলনা করুন। ফল ৩০ সেকেন্ডের কম সময়ে।"
                  : "Drag the slider on the right to compare before / after. Results in under 30 seconds — no photoshoot needed."}
              </p>

              <div className="mt-10 space-y-5">
                {[
                  { icon: Camera, titleKey: "howItWorks.step1.title", descKey: "howItWorks.step1.desc" },
                  { icon: Shirt, titleKey: "howItWorks.step2.title", descKey: "howItWorks.step2.desc" },
                  { icon: Wand2, titleKey: "howItWorks.step3.title", descKey: "howItWorks.step3.desc" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4 group">
                      <div className="shrink-0 w-12 h-12 rounded-2xl bg-[hsl(var(--m-bg-alt))] border border-[hsl(var(--m-line))] flex items-center justify-center group-hover:bg-[hsl(var(--m-ink))] group-hover:border-[hsl(var(--m-ink))] transition-colors">
                        <Icon className="h-5 w-5 text-[hsl(var(--m-ink))] group-hover:text-[hsl(var(--m-bg))] transition-colors" />
                      </div>
                      <div className="pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[hsl(var(--m-muted))]">0{i + 1}</span>
                          <h3 className={`font-heading text-base font-bold text-[hsl(var(--m-ink))] ${bengali}`}>
                            {t(lang, item.titleKey)}
                          </h3>
                        </div>
                        <p className={`text-sm text-[hsl(var(--m-ink-soft))] mt-1 ${bengali}`}>
                          {t(lang, item.descKey)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleStart("tryon")}
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--m-ink))] m-link-underline"
              >
                {bn ? "এখনই চেষ্টা করুন" : "Try it yourself"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-[hsl(var(--m-accent)/0.08)] rounded-[2rem] blur-2xl" />
              <div className="relative bg-[hsl(var(--m-ink))] rounded-3xl p-3 shadow-[0_30px_80px_-30px_hsl(244_72%_30%/0.45)]">
                <BeforeAfterDemo label={bn ? "এআই ট্রাই-অন প্রিভিউ" : "AI Try-On Preview"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="relative px-4 lg:px-6 py-20 bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="m-eyebrow text-[hsl(var(--m-accent))]/90">{t(lang, "home.sectionEyebrowSocial")}</span>
              <h2 className={`m-display text-3xl md:text-5xl font-bold mt-3 ${bengali}`}>
                {t(lang, "home.socialTitle")}
              </h2>
            </div>
            <a href="/stylevu" className="text-sm font-semibold inline-flex items-center gap-2 m-link-underline text-[hsl(var(--m-bg))]/80 hover:text-[hsl(var(--m-bg))]">
              {bn ? "ব্র্যান্ড স্টোরি দেখুন" : "Read brand stories"}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[hsl(var(--m-bg))/0.1]">
            {[
              { val: t(lang, "stats.tryOns"), label: t(lang, "stats.tryOnsLabel") },
              { val: t(lang, "stats.speed"), label: t(lang, "stats.speedLabel") },
              { val: t(lang, "stats.brands"), label: t(lang, "stats.brandsLabel") },
              { val: "99.2%", label: bn ? "আপটাইম" : "Uptime" },
            ].map((s) => (
              <div key={s.label} className="bg-[hsl(var(--m-ink))] p-8 md:p-10">
                <div className="m-display text-4xl md:text-6xl font-bold tracking-tight">{s.val}</div>
                <p className={`text-xs uppercase tracking-[0.18em] text-[hsl(var(--m-bg))]/60 mt-3 ${bengali}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES GRID ============ */}
      <section className="relative px-4 lg:px-6 py-24 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-14">
            <span className="m-eyebrow">{t(lang, "home.sectionEyebrowFeatures")}</span>
            <h2 className={`m-display text-3xl md:text-5xl font-bold mt-3 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "home.featuresTitle")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              const isFeatured = i === 0 || i === 4;
              return (
                <div
                  key={f.key}
                  className={`m-card-feature ${isFeatured ? "lg:row-span-2 lg:bg-[hsl(var(--m-bg-alt))]" : ""}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[hsl(var(--m-accent-soft))] flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-[hsl(var(--m-accent-ink))]" />
                  </div>
                  <h3 className={`font-heading text-lg font-bold text-[hsl(var(--m-ink))] mb-2 ${bengali}`}>
                    {t(lang, f.key)}
                  </h3>
                  <p className={`text-sm text-[hsl(var(--m-ink-soft))] ${bengali}`}>
                    {bn ? "প্রিমিয়াম মান, দ্রুত ডেলিভারি, এবং একদম ব্র্যান্ডের রঙে।" : "Studio-grade quality, delivered fast, in your brand's exact look."}
                  </p>
                  {isFeatured && (
                    <ul className="mt-6 space-y-2">
                      {(bn
                        ? ["জেমিনি ২.৫ ফ্ল্যাশ", "৩০ সেকেন্ডে রেজাল্ট", "ব্যাচ প্রসেসিং"]
                        : ["Gemini 2.5 Flash inference", "Sub-30s generation", "Batch processing"]
                      ).map((t2) => (
                        <li key={t2} className={`flex items-center gap-2 text-sm text-[hsl(var(--m-ink-soft))] ${bengali}`}>
                          <Check className="h-4 w-4 text-[hsl(var(--m-emerald))]" />
                          {t2}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="relative px-4 lg:px-6 py-24 md:py-32 bg-[hsl(var(--m-bg-alt))] border-y border-[hsl(var(--m-line))]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <span className="m-eyebrow">{t(lang, "home.sectionEyebrowFaq")}</span>
            <h2 className={`m-display text-3xl md:text-5xl font-bold mt-3 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "home.faqTitle")}
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <AccordionItem
                key={n}
                value={`q${n}`}
                className="m-card px-6 border-none data-[state=open]:bg-[hsl(var(--m-surface))]"
              >
                <AccordionTrigger className={`text-left text-base font-semibold text-[hsl(var(--m-ink))] hover:no-underline py-5 ${bengali}`}>
                  {t(lang, `faq.q${n}`)}
                </AccordionTrigger>
                <AccordionContent className={`text-sm text-[hsl(var(--m-ink-soft))] pb-5 ${bengali}`}>
                  {t(lang, `faq.a${n}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative px-4 lg:px-6 py-24 md:py-32">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[2rem] overflow-hidden bg-[hsl(var(--m-ink))] p-10 md:p-20 text-center">
            <div className="absolute inset-0 m-mesh opacity-60" />
            <div className="relative">
              <h2 className={`m-display text-3xl md:text-6xl font-bold text-[hsl(var(--m-bg))] max-w-3xl mx-auto ${bengali}`}>
                {t(lang, "home.ctaBig")}
              </h2>
              <p className={`mt-6 text-base md:text-lg text-[hsl(var(--m-bg))]/70 max-w-xl mx-auto ${bengali}`}>
                {t(lang, "home.ctaBigSub")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleStart("tryon")}
                  className="h-13 px-7 py-4 rounded-full bg-[hsl(var(--m-bg))] text-[hsl(var(--m-ink))] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--m-accent))] hover:text-[hsl(var(--m-bg))] transition-colors"
                >
                  {t(lang, "cta.button")}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/stylevu")}
                  className="h-13 px-7 py-4 rounded-full border border-[hsl(var(--m-bg))]/25 text-[hsl(var(--m-bg))] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--m-bg))]/10 transition-colors"
                >
                  {t(lang, "nav.forBrands")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
