import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, Sparkles, BarChart3, Globe, Shield, Palette, Zap, Quote,
  ArrowUpRight, ArrowRight, MessageCircle, Clock,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface StyleVuPageProps {
  lang: Language;
}

const pillars = [
  { icon: Sparkles, title: { en: "AI Virtual Try-On", bn: "এআই ভার্চুয়াল ট্রাই-অন" }, desc: { en: "Customers see your garments on themselves in seconds.", bn: "কাস্টমাররা সেকেন্ডে আপনার পোশাক নিজের গায়ে দেখেন।" } },
  { icon: Palette, title: { en: "White-Label Brand", bn: "হোয়াইট-লেবেল ব্র্যান্ড" }, desc: { en: "Your colors, fonts, logo, and your domain — never ours.", bn: "আপনার রঙ, ফন্ট, লোগো এবং ডোমেইন — আমাদের নয়।" } },
  { icon: Globe, title: { en: "Bilingual by Default", bn: "ডিফল্ট দ্বিভাষিক" }, desc: { en: "Bengali and English UX out of the box.", bn: "বাংলা ও ইংরেজি UX আউট অফ দ্য বক্স।" } },
  { icon: BarChart3, title: { en: "Conversion Analytics", bn: "কনভার্শন অ্যানালিটিক্স" }, desc: { en: "Track try-ons, add-to-carts, and lift per SKU.", bn: "প্রতি SKU-তে ট্রাই-অন, কার্ট ও লিফট ট্র্যাক করুন।" } },
  { icon: Shield, title: { en: "Privacy Compliant", bn: "প্রাইভেসি কমপ্লায়েন্ট" }, desc: { en: "Photos processed in-memory, never stored.", bn: "ছবি মেমোরিতে প্রসেস হয়, কখনো সংরক্ষিত হয় না।" } },
  { icon: Zap, title: { en: "Live in 48 Hours", bn: "৪৮ ঘণ্টায় লাইভ" }, desc: { en: "We onboard your catalog and ship to production.", bn: "আমরা আপনার ক্যাটালগ অনবোর্ড করে প্রোডাকশনে দিই।" } },
];

type Period = "monthly" | "yearly";

const tiersFor = (period: Period) => [
  {
    name: "Starter",
    monthly: 4999,
    yearly: 4499,
    tagline: { en: "For boutiques getting started", bn: "শুরুতে থাকা বুটিকের জন্য" },
    features: {
      en: ["500 try-ons / month", "1 brand domain", "Email support", "Basic analytics"],
      bn: ["মাসে ৫০০ ট্রাই-অন", "১টি ব্র্যান্ড ডোমেইন", "ইমেইল সাপোর্ট", "বেসিক অ্যানালিটিক্স"],
    },
  },
  {
    name: "Growth",
    monthly: 14999,
    yearly: 12999,
    popular: true,
    tagline: { en: "For growing fashion brands", bn: "বাড়ন্ত ফ্যাশন ব্র্যান্ডের জন্য" },
    features: {
      en: ["5,000 try-ons / month", "3 brand domains", "Priority support", "Full analytics", "Custom AI styles"],
      bn: ["মাসে ৫,০০০ ট্রাই-অন", "৩টি ব্র্যান্ড ডোমেইন", "প্রায়োরিটি সাপোর্ট", "ফুল অ্যানালিটিক্স", "কাস্টম এআই স্টাইল"],
    },
  },
  {
    name: "Enterprise",
    monthly: null as number | null,
    yearly: null as number | null,
    tagline: { en: "For category leaders", bn: "ক্যাটাগরি লিডারদের জন্য" },
    features: {
      en: ["Unlimited try-ons", "Unlimited domains", "Dedicated CSM", "API access", "On-premise option"],
      bn: ["আনলিমিটেড ট্রাই-অন", "আনলিমিটেড ডোমেইন", "ডেডিকেটেড CSM", "API অ্যাক্সেস", "অন-প্রিমিস অপশন"],
    },
  },
].map((tier) => ({ ...tier, period }));

function useCountdown(endIso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(endIso).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

export default function StyleVuPage({ lang }: StyleVuPageProps) {
  const navigate = useNavigate();
  const bn = lang === "bn";
  const bengali = bn ? "font-bengali" : "";
  const [period, setPeriod] = useState<Period>("monthly");
  const tiers = useMemo(() => tiersFor(period), [period]);
  const { d, h, m, s } = useCountdown("2026-03-31T23:59:59+06:00");

  return (
    <main className="relative pt-24">
      {/* HERO */}
      <section className="relative px-4 lg:px-6 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 m-mesh pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="m-eyebrow inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--m-pop))]" />
              {t(lang, "sv.eyebrow")}
            </span>
            <h1 className={`m-display text-4xl md:text-6xl lg:text-7xl font-bold mt-5 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "sv.title")}
            </h1>
            <p className={`mt-6 text-lg text-[hsl(var(--m-ink-soft))] max-w-xl ${bengali}`}>
              {t(lang, "sv.lede")}
            </p>

            {/* Countdown */}
            <div className="mt-8 inline-flex items-center gap-3 m-card px-4 py-3 bg-[hsl(var(--m-surface))]">
              <Clock className="h-4 w-4 text-[hsl(var(--m-pop))]" />
              <span className={`text-xs font-semibold uppercase tracking-wider text-[hsl(var(--m-ink))] ${bengali}`}>
                {t(lang, "stylevu.ramadan")}
              </span>
              <div className="flex items-center gap-1 text-sm font-mono text-[hsl(var(--m-ink))]">
                {[
                  { val: d, label: bn ? "দি" : "d" },
                  { val: h, label: bn ? "ঘ" : "h" },
                  { val: m, label: bn ? "মি" : "m" },
                  { val: s, label: bn ? "সে" : "s" },
                ].map((u, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-[hsl(var(--m-bg-alt))]">
                    {String(u.val).padStart(2, "0")}<span className="text-[hsl(var(--m-muted))]">{u.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/onboarding")}
                className="m-btn-primary h-13 px-7 py-4 text-sm inline-flex items-center justify-center gap-2"
              >
                {t(lang, "sv.cta")}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="m-btn-ghost h-13 px-7 py-4 text-sm inline-flex items-center justify-center gap-2"
              >
                {t(lang, "sv.cta2")}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--m-muted))]">
              <span>🇧🇩 {bn ? "বাংলাদেশে তৈরি" : "Made in Bangladesh"}</span>
              <span>· {bn ? "৪৮ ঘণ্টায় লাইভ" : "Live in 48 hours"}</span>
              <span>· {bn ? "সেটআপ ফি নেই" : "No setup fee"}</span>
            </div>
          </div>

          {/* Hero visual: storefront mock */}
          <div className="lg:col-span-5 relative">
            <div className="relative m-card p-4 bg-[hsl(var(--m-surface))]">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-[hsl(var(--m-muted))] font-mono">tryon.yourbrand.com</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1551028711-031cda28351a?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=400&q=80",
                ].map((src, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden bg-[hsl(var(--m-bg-alt))]">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[hsl(var(--m-muted))] font-medium">{bn ? "৪ লুক জেনারেট" : "4 looks generated"}</span>
                <button className="text-xs font-semibold text-[hsl(var(--m-accent-ink))]">
                  {bn ? "কার্টে যোগ" : "Add to cart"} →
                </button>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 m-card px-3 py-2 bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))] rotate-6">
              <p className="text-xs font-semibold">+312% try-on rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="relative px-4 lg:px-6 py-20 md:py-28 border-t border-[hsl(var(--m-line))]">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <span className="m-eyebrow">{t(lang, "stylevu.features")}</span>
            <h2 className={`m-display text-3xl md:text-5xl font-bold mt-3 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "sv.pillarsTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[hsl(var(--m-line))] border border-[hsl(var(--m-line))] rounded-3xl overflow-hidden">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title.en} className="bg-[hsl(var(--m-bg))] p-7 hover:bg-[hsl(var(--m-bg-alt))] transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-[hsl(var(--m-accent-soft))] flex items-center justify-center mb-5">
                    <Icon className="h-5 w-5 text-[hsl(var(--m-accent-ink))]" />
                  </div>
                  <h3 className={`font-heading text-lg font-bold text-[hsl(var(--m-ink))] mb-2 ${bengali}`}>
                    {bn ? p.title.bn : p.title.en}
                  </h3>
                  <p className={`text-sm text-[hsl(var(--m-ink-soft))] ${bengali}`}>
                    {bn ? p.desc.bn : p.desc.en}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="relative px-4 lg:px-6 py-20 md:py-28 bg-[hsl(var(--m-bg-alt))] border-y border-[hsl(var(--m-line))]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[hsl(var(--m-ink))]">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80"
                  alt="Brand case study"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="m-eyebrow">{t(lang, "stylevu.caseStudy.title")}</span>
              <Quote className="h-10 w-10 text-[hsl(var(--m-accent))]/40 mt-4" />
              <p className={`m-display text-2xl md:text-3xl text-[hsl(var(--m-ink))] mt-2 leading-snug ${bengali}`}>
                "{t(lang, "stylevu.caseStudy.quote")}"
              </p>
              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className={`font-heading font-bold text-[hsl(var(--m-ink))] ${bengali}`}>
                    {t(lang, "stylevu.caseStudy.brand")}
                  </p>
                  <p className={`text-xs text-[hsl(var(--m-muted))] ${bengali}`}>
                    {t(lang, "stylevu.caseStudy.note")}
                  </p>
                </div>
                <div className="m-chip text-[hsl(var(--m-accent-ink))] border-[hsl(var(--m-accent))]/30 bg-[hsl(var(--m-accent-soft))]">
                  ↑ {t(lang, "stylevu.caseStudy.metric")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative px-4 lg:px-6 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="m-eyebrow">{t(lang, "sv.pricingEyebrow")}</span>
            <h2 className={`m-display text-3xl md:text-5xl font-bold mt-3 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "sv.pricingTitle")}
            </h2>

            {/* Period toggle */}
            <div className="mt-8 inline-flex items-center p-1 rounded-full border border-[hsl(var(--m-line))] bg-[hsl(var(--m-surface))]">
              {(["monthly", "yearly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-5 h-9 rounded-full text-sm font-semibold transition-colors ${
                    period === p
                      ? "bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))]"
                      : "text-[hsl(var(--m-ink-soft))] hover:text-[hsl(var(--m-ink))]"
                  }`}
                >
                  {p === "monthly" ? (bn ? "মাসিক" : "Monthly") : (bn ? "বার্ষিক · ১০% সাশ্রয়" : "Yearly · save 10%")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const price = period === "monthly" ? tier.monthly : tier.yearly;
              const popular = (tier as any).popular;
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-3xl p-8 border transition-all ${
                    popular
                      ? "bg-[hsl(var(--m-ink))] border-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))] shadow-2xl scale-[1.02]"
                      : "bg-[hsl(var(--m-surface))] border-[hsl(var(--m-line))] hover:border-[hsl(var(--m-line-strong))]"
                  }`}
                >
                  {popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(var(--m-pop))] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {bn ? "জনপ্রিয়" : "Most popular"}
                    </span>
                  )}
                  <h3 className={`font-heading text-xl font-bold mb-1 ${popular ? "" : "text-[hsl(var(--m-ink))]"}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mb-6 ${popular ? "text-[hsl(var(--m-bg))]/70" : "text-[hsl(var(--m-muted))]"} ${bengali}`}>
                    {bn ? tier.tagline.bn : tier.tagline.en}
                  </p>

                  <div className="mb-6">
                    {price === null ? (
                      <span className={`m-display text-4xl font-bold ${popular ? "" : "text-[hsl(var(--m-ink))]"}`}>
                        {bn ? "কাস্টম" : "Custom"}
                      </span>
                    ) : (
                      <>
                        <span className={`m-display text-5xl font-bold ${popular ? "" : "text-[hsl(var(--m-ink))]"}`}>
                          ৳{price.toLocaleString()}
                        </span>
                        <span className={`text-sm ml-1 ${popular ? "text-[hsl(var(--m-bg))]/60" : "text-[hsl(var(--m-muted))]"}`}>
                          /{period === "monthly" ? (bn ? "মাস" : "mo") : (bn ? "মাস · বার্ষিক বিল" : "mo · billed yearly")}
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(bn ? tier.features.bn : tier.features.en).map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-sm ${popular ? "text-[hsl(var(--m-bg))]/85" : "text-[hsl(var(--m-ink-soft))]"} ${bengali}`}
                      >
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${popular ? "text-[hsl(var(--m-pop))]" : "text-[hsl(var(--m-emerald))]"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate("/onboarding")}
                    className={`w-full h-11 rounded-full font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition-colors ${
                      popular
                        ? "bg-[hsl(var(--m-bg))] text-[hsl(var(--m-ink))] hover:bg-[hsl(var(--m-pop))] hover:text-white"
                        : "bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))] hover:bg-[hsl(var(--m-accent))]"
                    }`}
                  >
                    {t(lang, "stylevu.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <p className={`text-center text-xs text-[hsl(var(--m-muted))] mt-8 ${bengali}`}>
            {t(lang, "sv.pricingNote")}
          </p>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="relative px-4 lg:px-6 py-20 md:py-28 bg-[hsl(var(--m-bg-alt))] border-y border-[hsl(var(--m-line))]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="m-eyebrow">FAQ</span>
            <h2 className={`m-display text-3xl md:text-5xl font-bold mt-3 text-[hsl(var(--m-ink))] ${bengali}`}>
              {t(lang, "sv.faqTitle")}
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <AccordionItem key={n} value={`q${n}`} className="m-card px-6 border-none">
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

      <section className="relative px-4 lg:px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[2rem] bg-[hsl(var(--m-ink))] text-[hsl(var(--m-bg))] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 m-mesh opacity-50" />
            <div className="relative">
              <h2 className={`m-display text-3xl md:text-5xl font-bold ${bengali}`}>
                {bn ? "আপনার ব্র্যান্ডে এআই ট্রাই-অন আনুন" : "Bring AI try-on to your brand"}
              </h2>
              <p className={`mt-4 text-[hsl(var(--m-bg))]/70 max-w-lg mx-auto ${bengali}`}>
                {bn ? "১৫ মিনিটের ডেমোতে দেখুন এটি আপনার দোকানে কেমন দেখাবে।" : "See it running in your store in a 15-minute walk-through."}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/onboarding")}
                  className="h-13 px-7 py-4 rounded-full bg-[hsl(var(--m-bg))] text-[hsl(var(--m-ink))] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--m-pop))] hover:text-white transition-colors"
                >
                  {t(lang, "sv.cta")}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href="https://wa.me/8801XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-13 px-7 py-4 rounded-full border border-[hsl(var(--m-bg))]/25 text-[hsl(var(--m-bg))] font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--m-bg))]/10 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
