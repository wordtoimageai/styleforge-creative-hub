import { supabase } from "@/integrations/supabase/client";

export type GenerationMode = "model" | "tryon" | "style";

interface GenerateRequest {
  mode: GenerationMode;
  userPhoto: string; // base64
  garmentPhoto?: string; // base64 (for tryon)
  stylePreset?: string; // for style mode
}

interface GenerateResponse {
  image: string; // base64 data URL
  error?: string;
}

export async function generateImage(req: GenerateRequest): Promise<GenerateResponse> {
  const { data, error } = await supabase.functions.invoke("generate-image", {
    body: req,
  });

  if (error) {
    // Check for rate limit or payment errors
    const status = (error as any)?.status;
    if (status === 429) {
      return { image: "", error: "Rate limit exceeded. Please wait a moment and try again." };
    }
    if (status === 402) {
      return { image: "", error: "AI credits exhausted. Please add credits to continue." };
    }
    return { image: "", error: error.message || "Failed to generate image" };
  }

  if (data?.error) {
    return { image: "", error: data.error };
  }

  return { image: data.image };
}
