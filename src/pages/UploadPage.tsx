import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, ShieldCheck, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      onUpload(reader.result as string);
      navigate("/processing");
    };
    reader.readAsDataURL(file);
  }, [lang, navigate, onUpload]);

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
          className={`glass-card flex flex-col items-center justify-center p-10 cursor-pointer transition-all border-2 border-dashed ${
            dragOver ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{ aspectRatio: "3/4" }}
        >
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileInput} className="hidden" />
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {dragOver ? <ImageIcon className="h-8 w-8 text-primary" /> : <Upload className="h-8 w-8 text-primary" />}
            </div>
            <p className={`text-sm text-muted-foreground text-center ${lang === "bn" ? "font-bengali" : ""}`}>
              {t(lang, "upload.guide")}
            </p>
          </div>
        </label>

        {error && (
          <p className="mt-4 text-sm text-destructive text-center">{error}</p>
        )}

        {/* Privacy notice */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span className={lang === "bn" ? "font-bengali" : ""}>{t(lang, "upload.privacy")}</span>
        </div>
      </div>
    </main>
  );
}
