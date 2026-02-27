import { useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, ShieldCheck, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import ImageCropDialog from "@/components/ImageCropDialog";
import type { Language } from "@/lib/i18n";
import type { AppMode } from "@/lib/app-state";
import { t } from "@/lib/i18n";

interface UploadPageProps {
  lang: Language;
  mode: AppMode;
  onUpload: (base64: string) => void;
}

const MAX_SIZE = 10 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function UploadPage({ lang, mode, onUpload }: UploadPageProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    if (!VALID_TYPES.includes(file.type)) {
      setError(t(lang, "upload.invalid"));
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(t(lang, "upload.maxSize"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // Show crop dialog instead of uploading directly
      setPreviewSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [lang]);

  const handleCropConfirm = useCallback((croppedBase64: string) => {
    setPreviewSrc(null);
    onUpload(croppedBase64);
    navigate("/processing");
  }, [navigate, onUpload]);

  const handleCropCancel = useCallback(() => {
    setPreviewSrc(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md mx-auto">
        {/* Back + Mode badge */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            {t(lang, "nav.home")}
          </Button>
          <Badge variant="outline" className={mode === "tryon" ? "border-primary text-primary" : "border-secondary text-secondary"}>
            {mode === "tryon" ? t(lang, "tryOn") : t(lang, "aiStyle")}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-heading font-bold text-foreground mb-2 ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "upload.title")}
          </h1>
          <p className={`text-muted-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "upload.subtitle")}
          </p>
        </div>

        {/* Drop zone */}
        <label
          className={`glass-card flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-300 border-2 border-dashed relative overflow-hidden ${
            dragOver
              ? "border-primary bg-primary/10 scale-[1.02] shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]"
              : "border-border/50 hover:border-primary/50 hover:bg-card/80"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{ aspectRatio: "3/4" }}
        >
          {dragOver && (
            <div className="absolute inset-0 studio-shimmer pointer-events-none" />
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileInput} className="hidden" />
          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              dragOver ? "bg-primary/20 scale-110" : "bg-primary/10"
            }`}>
              {dragOver ? (
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <p className={`text-sm text-muted-foreground text-center transition-colors ${
              dragOver ? "text-primary font-medium" : ""
            } ${lang === "bn" ? "font-bengali" : ""}`}>
              {dragOver ? "Drop to upload!" : t(lang, "upload.guide")}
            </p>
          </div>
        </label>

        {/* Camera capture button (mobile) */}
        {isMobile && (
          <div className="mt-4">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full gap-2 h-12 border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="h-5 w-5" />
              <span className={lang === "bn" ? "font-bengali" : ""}>Take a Photo</span>
            </Button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-destructive text-center">{error}</p>
        )}

        {/* Privacy notice */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "upload.privacy")}</span>
        </div>
      </div>

      {/* Crop/Rotate Dialog */}
      {previewSrc && (
        <ImageCropDialog
          open={!!previewSrc}
          imageSrc={previewSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </main>
  );
}
