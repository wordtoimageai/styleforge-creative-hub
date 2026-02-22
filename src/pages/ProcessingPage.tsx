import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { generateImage } from "@/lib/ai-client";

interface ProcessingPageProps {
  lang: Language;
  userPhoto: string | null;
  onGenerated: (image: string) => void;
  onError: (error: string) => void;
}

export default function ProcessingPage({ lang, userPhoto, onGenerated, onError }: ProcessingPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userPhoto) {
      navigate("/upload");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const result = await generateImage({
          mode: "model",
          userPhoto,
        });

        if (cancelled) return;

        if (result.error) {
          onError(result.error);
          navigate("/upload");
        } else {
          onGenerated(result.image);
          navigate("/studio");
        }
      } catch (err) {
        if (!cancelled) {
          onError("Something went wrong. Please try again.");
          navigate("/upload");
        }
      }
    })();

    return () => { cancelled = true; };
  }, [userPhoto, navigate, onGenerated, onError]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* Photo preview */}
        {userPhoto && (
          <div className="relative mb-8 mx-auto">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 mx-auto">
              <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-4 border-primary/50 border-t-primary animate-spin" />
            </div>
          </div>
        )}

        <h2 className={`text-xl font-heading font-bold text-foreground mb-3 pulse-glow ${lang === "bn" ? "font-bengali" : ""}`}>
          {t(lang, "processing.title")}
        </h2>

        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className={`text-sm ${lang === "bn" ? "font-bengali" : ""}`}>
            {t(lang, "processing.generating")}
          </span>
        </div>

        <p className={`text-xs text-muted-foreground ${lang === "bn" ? "font-bengali" : ""}`}>
          {t(lang, "processing.subtitle")}
        </p>
      </div>
    </main>
  );
}
