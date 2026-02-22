import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

interface OnboardingPageProps {
  lang: Language;
}

export default function OnboardingPage({ lang }: OnboardingPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brandName: "",
    brandUrl: "",
    primaryColor: "#00DC82",
    accentColor: "#0096FF",
    catalogUrl: "",
  });
  const [config, setConfig] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedConfig = {
      brand: {
        name: form.brandName,
        url: form.brandUrl,
        theme: {
          primary: form.primaryColor,
          accent: form.accentColor,
          mode: "dark",
        },
        catalog: form.catalogUrl,
      },
      features: {
        virtualTryOn: true,
        aiStyleGeneration: true,
        languages: ["en", "bn"],
      },
      deployment: {
        subdomain: `${form.brandName.toLowerCase().replace(/\s+/g, "-")}.bdai.studio`,
      },
    };
    setConfig(JSON.stringify(generatedConfig, null, 2));
    toast.success("Config generated!");
  };

  const handleCopy = () => {
    if (config) {
      navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/stylevu")} className="gap-2 text-muted-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          StyleVu
        </Button>

        <h1 className={`text-2xl md:text-3xl font-heading font-bold text-foreground mb-2 ${lang === "bn" ? "font-bengali" : ""}`}>
          {t(lang, "onboarding.title")}
        </h1>
        <p className={`text-muted-foreground mb-8 ${lang === "bn" ? "font-bengali" : ""}`}>
          {t(lang, "onboarding.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "onboarding.brandName")}</Label>
            <Input value={form.brandName} onChange={(e) => update("brandName", e.target.value)} required placeholder="Aarong" />
          </div>
          <div className="space-y-2">
            <Label className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "onboarding.brandUrl")}</Label>
            <Input value={form.brandUrl} onChange={(e) => update("brandUrl", e.target.value)} placeholder="https://aarong.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "onboarding.primaryColor")}</Label>
              <div className="flex gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                <Input value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "onboarding.accentColor")}</Label>
              <div className="flex gap-2">
                <input type="color" value={form.accentColor} onChange={(e) => update("accentColor", e.target.value)} className="h-10 w-10 rounded cursor-pointer" />
                <Input value={form.accentColor} onChange={(e) => update("accentColor", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "onboarding.catalog")}</Label>
            <Input value={form.catalogUrl} onChange={(e) => update("catalogUrl", e.target.value)} placeholder="https://brand.com/catalog.json" />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground">
            {t(lang, "onboarding.submit")}
          </Button>
        </form>

        {config && (
          <div className="mt-8 glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-semibold text-foreground text-sm">Generated Config</h3>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-64 bg-background/50 p-3 rounded-lg">
              {config}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
