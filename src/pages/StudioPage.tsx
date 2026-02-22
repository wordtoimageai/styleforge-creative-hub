import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, Share2, ArrowLeft, Loader2,
  Moon, Sun, Shirt, PartyPopper, Briefcase, Heart, Snowflake,
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

export default function StudioPage({
  lang, mode, onSetMode, userPhoto, generatedImage, onGenerated, history, onAddHistory,
}: StudioPageProps) {
  const navigate = useNavigate();
  const [isProcessing, setProcessing] = useState(false);
  const [wardrobeOpen, setWardrobeOpen] = useState(false);
  const [outfitLayers, setOutfitLayers] = useState<OutfitLayer[]>([
    { garment: null },
  ]);
  const handleStyleSelect = useCallback(async (styleKey: string) => {
    if (!userPhoto) return;
    setProcessing(true);
    try {
      const result = await generateImage({
        mode: "style",
        userPhoto,
        stylePreset: styleKey,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        onGenerated(result.image);
        onAddHistory(result.image);
      }
    } catch {
      toast.error("Failed to generate style");
    } finally {
      setProcessing(false);
    }
  }, [userPhoto, onGenerated, onAddHistory]);

  const handleGarmentSelect = useCallback(async (garmentBase64: string, item: WardrobeItem) => {
    if (!userPhoto) return;
    setProcessing(true);
    try {
      const result = await generateImage({
        mode: "tryon",
        userPhoto,
        garmentPhoto: garmentBase64,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        onGenerated(result.image);
        onAddHistory(result.image);
        setOutfitLayers(prev => [...prev, { garment: item, resultImage: result.image }]);
      }
    } catch {
      toast.error("Failed to process try-on");
    } finally {
      setProcessing(false);
    }
  }, [userPhoto, onGenerated, onAddHistory]);

  const handleRemoveLastGarment = useCallback(() => {
    setOutfitLayers(prev => {
      if (prev.length <= 1) return prev;
      const newLayers = prev.slice(0, -1);
      const lastLayer = newLayers[newLayers.length - 1];
      if (lastLayer?.resultImage) {
        onGenerated(lastLayer.resultImage);
      }
      return newLayers;
    });
  }, [onGenerated]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    // Create canvas with watermark
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
      } catch {
        toast.info("Share cancelled");
      }
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
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t(lang, "nav.home")}
          </Button>

          {/* Mode toggle */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === "tryon" ? "default" : "outline"}
              onClick={() => onSetMode("tryon")}
              className={mode === "tryon" ? "bg-primary text-primary-foreground" : ""}
            >
              <Shirt className="h-4 w-4 mr-1" />
              {t(lang, "studio.tryOnMode")}
            </Button>
            <Button
              size="sm"
              variant={mode === "style" ? "default" : "outline"}
              onClick={() => onSetMode("style")}
              className={mode === "style" ? "bg-secondary text-secondary-foreground" : ""}
            >
              <Moon className="h-4 w-4 mr-1" />
              {t(lang, "studio.styleMode")}
            </Button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas area */}
          <div className="flex-1">
            <div className="glass-card overflow-hidden relative" style={{ aspectRatio: "3/4" }}>
              {isProcessing && (
                <div className="absolute inset-0 z-10 bg-background/80 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t(lang, "processing.generating")}</p>
                  </div>
                </div>
              )}
              {generatedImage ? (
                <img src={generatedImage} alt="Generated result" className="w-full h-full object-cover animate-fade-in" />
              ) : userPhoto ? (
                <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover opacity-50" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="flex gap-3 mt-4 justify-center">
              <Button onClick={handleDownload} disabled={!generatedImage} className="gap-2 bg-primary text-primary-foreground">
                <Download className="h-4 w-4" />
                {t(lang, "studio.download")}
              </Button>
              <Button variant="outline" onClick={handleShare} disabled={!generatedImage} className="gap-2">
                <Share2 className="h-4 w-4" />
                {t(lang, "studio.share")}
              </Button>
            </div>
          </div>

          {/* Side panel / Bottom sheet on mobile */}
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
                      className="glass-card p-4 text-center hover:bg-surface-hover transition-colors disabled:opacity-50 rounded-xl"
                    >
                      <preset.icon className="h-6 w-6 text-primary mx-auto mb-2" />
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
                      className="aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
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
