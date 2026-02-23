import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, Share2, ArrowLeft, Loader2,
  Moon, Sun, Shirt, PartyPopper, Briefcase, Heart, Snowflake,
  ImageIcon, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/i18n";
import type { AppMode } from "@/lib/app-state";
import type { OutfitLayer, WardrobeItem } from "@/lib/wardrobe-types";
import { t } from "@/lib/i18n";
import { generateImage } from "@/lib/ai-client";
import { toast } from "sonner";
import WardrobeSheet from "@/components/WardrobeSheet";
import OutfitStack from "@/components/OutfitStack";

interface StudioPageProps {
  lang: Language;
  mode: AppMode;
  onSetMode: (mode: AppMode) => void;
  userPhoto: string | null;
  generatedImage: string | null;
  onGenerated: (image: string) => void;
  history: string[];
  onAddHistory: (image: string) => void;
}

const stylePresets = [
  { key: "eid", icon: PartyPopper },
  { key: "casual", icon: Sun },
  { key: "formal", icon: Briefcase },
  { key: "wedding", icon: Heart },
  { key: "summer", icon: Sun },
  { key: "winter", icon: Snowflake },
] as const;

const LOADING_MESSAGES = [
  "Analyzing your photo…",
  "Generating your style…",
  "Applying AI magic…",
  "Almost there…",
];

export default function StudioPage({
  lang, mode, onSetMode, userPhoto, generatedImage, onGenerated, history, onAddHistory,
}: StudioPageProps) {
  const navigate = useNavigate();
  const [isProcessing, setProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [outfitLayers, setOutfitLayers] = useState<OutfitLayer[]>([
    { garment: null },
  ]);

  const startProcessing = useCallback(() => {
    setProcessing(true);
    setLoadingStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, LOADING_MESSAGES.length - 1);
      setLoadingStep(step);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStyleSelect = useCallback(async (styleKey: string) => {
    if (!userPhoto) return;
    const cleanup = startProcessing();
    try {
      const result = await generateImage({ mode: "style", userPhoto, stylePreset: styleKey });
      if (result.error) toast.error(result.error);
      else { onGenerated(result.image); onAddHistory(result.image); }
    } catch { toast.error("Failed to generate style"); }
    finally { cleanup(); setProcessing(false); }
  }, [userPhoto, onGenerated, onAddHistory, startProcessing]);

  const handleGarmentSelect = useCallback(async (garmentBase64: string, item: WardrobeItem) => {
    if (!userPhoto) return;
    const cleanup = startProcessing();
    try {
      const result = await generateImage({ mode: "tryon", userPhoto, garmentPhoto: garmentBase64 });
      if (result.error) toast.error(result.error);
      else {
        onGenerated(result.image);
        onAddHistory(result.image);
        setOutfitLayers(prev => [...prev, { garment: item, resultImage: result.image }]);
      }
    } catch { toast.error("Failed to process try-on"); }
    finally { cleanup(); setProcessing(false); }
  }, [userPhoto, onGenerated, onAddHistory, startProcessing]);

  const handleRemoveLastGarment = useCallback(() => {
    setOutfitLayers(prev => {
      if (prev.length <= 1) return prev;
      const newLayers = prev.slice(0, -1);
      const lastLayer = newLayers[newLayers.length - 1];
      if (lastLayer?.resultImage) onGenerated(lastLayer.resultImage);
      return newLayers;
    });
  }, [onGenerated]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `${Math.max(16, img.width / 30)}px Syne, sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText("BDai.studio", img.width - 20, img.height - 20);
      const link = document.createElement("a");
      link.download = "bdai-studio-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = generatedImage;
  }, [generatedImage]);

  const handleShare = useCallback(async () => {
    if (!generatedImage) return;
    if (navigator.share) {
      try {
        const blob = await fetch(generatedImage).then(r => r.blob());
        const file = new File([blob], "bdai-studio.png", { type: "image/png" });
        await navigator.share({ title: "BDai.studio", files: [file] });
      } catch { toast.info("Share cancelled"); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  }, [generatedImage]);

  if (!userPhoto && !generatedImage) {
    navigate("/");
    return null;
  }

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t(lang, "nav.home")}
          </Button>

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetMode("tryon")}
              className={`rounded-lg transition-all ${mode === "tryon" ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Shirt className="h-4 w-4 mr-1.5" />
              {t(lang, "studio.tryOnMode")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetMode("style")}
              className={`rounded-lg transition-all ${mode === "style" ? "bg-secondary text-secondary-foreground shadow-md shadow-secondary/25 hover:bg-secondary/90" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              {t(lang, "studio.styleMode")}
            </Button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas area */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/40 backdrop-blur-sm" style={{ aspectRatio: "3/4" }}>
              {/* Dot grid background for empty/base state */}
              {!generatedImage && !isProcessing && (
                <div className="absolute inset-0 dot-grid opacity-30" />
              )}

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 animate-pulse" style={{
                      background: `linear-gradient(135deg, hsl(var(--brand-green) / 0.3), hsl(var(--brand-blue) / 0.2), hsl(var(--brand-orange) / 0.1))`,
                    }} />
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 studio-shimmer" />
                  </div>
                  <div className="relative text-center space-y-4">
                    <div className="relative mx-auto w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary pulse-glow" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground animate-fade-in">{LOADING_MESSAGES[loadingStep]}</p>
                      <div className="flex justify-center gap-1 mt-3">
                        {LOADING_MESSAGES.map((_, i) => (
                          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= loadingStep ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Image content */}
              {generatedImage ? (
                <img src={generatedImage} alt="Generated result" className="w-full h-full object-cover animate-fade-in" />
              ) : userPhoto ? (
                <div className="relative w-full h-full">
                  <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover opacity-40" />
                  {!isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-3 p-6">
                        <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center mx-auto">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {mode === "tryon" ? "Select a garment to try on" : "Choose a style preset"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/50 flex items-center justify-center mx-auto">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No image</p>
                  </div>
                </div>
              )}

              {/* Canvas corner badge */}
              {generatedImage && !isProcessing && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-md">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">AI Generated</span>
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="flex gap-3 mt-4 justify-center">
              <Button
                onClick={handleDownload}
                disabled={!generatedImage || isProcessing}
                className="gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-6 h-11 font-semibold transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:shadow-none"
              >
                <Download className="h-4 w-4" />
                {t(lang, "studio.download")}
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={!generatedImage || isProcessing}
                className="gap-2.5 border-border/70 hover:border-primary/50 hover:bg-primary/5 rounded-xl px-6 h-11 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Share2 className="h-4 w-4" />
                {t(lang, "studio.share")}
              </Button>
            </div>
          </div>

          {/* Side panel */}
          <div className="w-full lg:w-80 glass-card p-5">
            {mode === "tryon" ? (
              <>
                <OutfitStack
                  outfitHistory={outfitLayers}
                  onRemoveLastGarment={handleRemoveLastGarment}
                  onAddGarment={() => setWardrobeOpen(true)}
                  lang={lang}
                />
                <WardrobeSheet
                  open={wardrobeOpen}
                  onOpenChange={setWardrobeOpen}
                  onGarmentSelect={handleGarmentSelect}
                  activeGarmentIds={outfitLayers.filter(l => l.garment).map(l => l.garment!.id)}
                  isLoading={isProcessing}
                  lang={lang}
                />
              </>
            ) : (
              <div className="space-y-4">
                <h3 className={`font-heading font-semibold text-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                  {t(lang, "studio.styleMode")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {stylePresets.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => handleStyleSelect(preset.key)}
                      disabled={isProcessing}
                      className="glass-card p-4 text-center hover:bg-surface-hover hover:border-primary/30 transition-all disabled:opacity-50 rounded-xl group"
                    >
                      <preset.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className={`text-xs text-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
                        {t(lang, `studio.styles.${preset.key}`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <h4 className={`text-sm font-medium text-muted-foreground mb-3 ${lang === "bn" ? "font-bengali" : ""}`}>
                  {t(lang, "studio.history")}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {history.slice(0, 9).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => onGenerated(img)}
                      className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 hover:scale-105 transition-all"
                    >
                      <img src={img} alt={`History ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
