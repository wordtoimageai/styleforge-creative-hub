import { useNavigate } from "react-router-dom";
import { Upload, Camera, Sparkles, Shield, Zap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
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
];

export default function HomePage({ lang, onSelectMode }: HomePageProps) {
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

      {/* Features */}
      <section className="relative px-4 pb-20">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.key}
              className="glass-card p-5 text-center animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <f.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className={`text-sm font-medium text-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                {t(lang, f.key)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
