import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Primary + fallback image models (both support image output on the gateway).
const MODELS = ["google/gemini-3.1-flash-image", "google/gemini-2.5-flash-image"];

const PROMPTS = {
  model: () =>
    `You are a professional fashion photography AI. Generate a full-body fashion model photo of the person in the reference photo, standing in a professional studio with soft lighting. Keep the face, skin tone and body proportions faithful to the reference. Output a single high-quality fashion photograph in 3:4 portrait aspect ratio.`,
  tryon: () =>
    `You are a virtual try-on AI. Take the person from the first image and dress them in the garment shown in the second image. Keep the person's face, skin tone, body shape and pose unchanged. The garment must fit and drape naturally with realistic fabric texture. Output a single realistic fashion photograph in 3:4 portrait aspect ratio.`,
  style: (preset: string) => {
    const styleDescriptions: Record<string, string> = {
      eid: "dressed in elegant Eid celebration attire — traditional Bangladeshi festive clothing with rich fabrics, embroidery, and jewel tones",
      casual: "wearing trendy casual streetwear — comfortable yet stylish everyday outfit suitable for Dhaka city life",
      formal: "in sharp formal business attire — professional clothing suitable for corporate Bangladesh",
      wedding: "in stunning Bangladeshi wedding attire — traditional bridal/groom clothing with ornate details and rich colors",
      summer: "in light, breathable summer clothing — bright colors and flowing fabrics perfect for Bangladesh summer",
      winter: "in cozy winter fashion — layered clothing with warm tones suitable for mild Bangladesh winter",
    };
    const desc = styleDescriptions[preset] || styleDescriptions.casual;
    return `You are an AI fashion stylist. Take the person from the provided photo and reimagine them ${desc}. Keep their face and body recognizable and unchanged. Output a single full-body fashion photograph with professional studio lighting in 3:4 portrait aspect ratio.`;
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isValidImage(src: unknown): src is string {
  return typeof src === "string" && (src.startsWith("data:image/") || src.startsWith("http"));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, userPhoto, garmentPhoto, stylePreset } = await req.json().catch(() => ({}));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return jsonResponse({ error: "AI is not configured. Please contact support." }, 500);
    }

    // --- input validation -------------------------------------------------
    if (!isValidImage(userPhoto)) {
      return jsonResponse({ error: "A valid photo is required to generate a look." }, 400);
    }
    if (mode === "tryon" && !isValidImage(garmentPhoto)) {
      return jsonResponse({ error: "A valid garment image is required for try-on." }, 400);
    }
    if (mode === "style" && (typeof stylePreset !== "string" || !stylePreset)) {
      return jsonResponse({ error: "Pick a style before generating." }, 400);
    }

    // --- prompt + message assembly ---------------------------------------
    let content: unknown[];
    if (mode === "tryon") {
      content = [
        { type: "text", text: PROMPTS.tryon() },
        { type: "image_url", image_url: { url: userPhoto } },
        { type: "image_url", image_url: { url: garmentPhoto } },
      ];
    } else if (mode === "style") {
      content = [
        { type: "text", text: PROMPTS.style(stylePreset) },
        { type: "image_url", image_url: { url: userPhoto } },
      ];
    } else {
      content = [
        { type: "text", text: PROMPTS.model() },
        { type: "image_url", image_url: { url: userPhoto } },
      ];
    }

    const messages = [{ role: "user", content }];

    // --- call the gateway, with a model fallback --------------------------
    let lastError = { status: 500, message: "AI generation failed. Please try again." };

    for (const model of MODELS) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages, modalities: ["image", "text"] }),
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl =
          data.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
          data.choices?.[0]?.message?.images?.[0]?.url;

        if (isValidImage(imageUrl)) {
          return jsonResponse({ image: imageUrl, model });
        }

        console.error("No image in response", model, JSON.stringify(data).slice(0, 600));
        lastError = {
          status: 422,
          message: "The AI could not create a look from that photo. Try a clearer, full-body photo.",
        };
        continue; // try the fallback model
      }

      const errorText = await response.text();
      console.error("AI gateway error:", model, response.status, errorText.slice(0, 600));

      // Terminal statuses — do not try other models.
      if (response.status === 402) {
        return jsonResponse(
          { error: "AI credits are exhausted. Add credits to keep generating looks." },
          402,
        );
      }
      if (response.status === 403) {
        return jsonResponse({ error: "AI access is blocked for this workspace." }, 403);
      }
      if (response.status === 429) {
        return jsonResponse(
          { error: "Too many requests right now. Wait a moment and try again." },
          429,
        );
      }

      lastError = { status: 502, message: "AI generation failed. Please try again." };
    }

    return jsonResponse({ error: lastError.message }, lastError.status);
  } catch (e) {
    console.error("generate-image error:", e);
    return jsonResponse({ error: "Something went wrong while generating. Please try again." }, 500);
  }
});
