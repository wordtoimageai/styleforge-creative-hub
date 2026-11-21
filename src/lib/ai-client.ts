import { supabase } from "@/integrations/supabase/client";
import { getConfiguredBrandId } from "@/brandConfig";
import { trackEvent, type TrackingEvent } from "@/services/geminiService";

export type GenerationMode = "model" | "tryon" | "style";

interface GenerateRequest {
  mode: GenerationMode;
  userPhoto: string; // base64 data URL
  garmentPhoto?: string; // base64 data URL (for tryon)
  stylePreset?: string; // for style mode
}

interface GenerateResponse {
  image: string; // base64 data URL
  error?: string;
}

const GENERATION_EVENTS: Record<GenerationMode, TrackingEvent> = {
  model: "model_generation",
  tryon: "try_on",
  style: "style_generation",
};

/** Pull the JSON error message out of a failed function invocation. */
async function readErrorMessage(error: unknown): Promise<string | null> {
  const context = (error as { context?: unknown })?.context;
  if (context instanceof Response) {
    try {
      const body = await context.clone().json();
      if (typeof body?.error === "string") return body.error;
    } catch {
      /* body was not JSON */
    }
  }
  return null;
}

export async function generateImage(req: GenerateRequest): Promise<GenerateResponse> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: req,
    });

    if (error) {
      const message = await readErrorMessage(error);
      if (message) return { image: "", error: message };

      const status = (error as { context?: { status?: number } })?.context?.status;
      if (status === 429) {
        return { image: "", error: "Too many requests right now. Wait a moment and try again." };
      }
      if (status === 402) {
        return { image: "", error: "AI credits are exhausted. Add credits to keep generating looks." };
      }
      return { image: "", error: error.message || "Failed to generate image" };
    }

    if (data?.error) return { image: "", error: data.error };
    if (!data?.image) return { image: "", error: "No image was generated. Please try again." };

    void trackEvent(getConfiguredBrandId(), GENERATION_EVENTS[req.mode]);
    return { image: data.image };
  } catch (e) {
    console.error("generateImage failed:", e);
    return { image: "", error: "Network problem. Check your connection and try again." };
  }
}
