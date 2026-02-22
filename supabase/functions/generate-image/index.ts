import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPTS = {
  model: (userDesc: string) =>
    `You are a professional fashion photography AI. Generate a full-body fashion model photo of a person based on this reference photo. The person should be standing in a professional studio setting with soft lighting. Keep the face and body proportions natural. Output a high-quality fashion photograph.`,
  tryon: () =>
    `You are a virtual try-on AI. Take the person from the first image and dress them in the garment shown in the second image. Maintain the person's face, body shape, and pose. The garment should fit naturally on their body. Output a realistic fashion photograph with studio lighting.`,
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
    return `You are an AI fashion stylist. Take the person from the provided photo and reimagine them ${desc}. Keep their face and body recognizable. Generate a full-body fashion photograph with professional studio lighting.`;
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, userPhoto, garmentPhoto, stylePreset } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let messages: any[];

    if (mode === "tryon" && garmentPhoto) {
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPTS.tryon() },
            { type: "image_url", image_url: { url: userPhoto } },
            { type: "image_url", image_url: { url: garmentPhoto } },
          ],
        },
      ];
    } else if (mode === "style" && stylePreset) {
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPTS.style(stylePreset) },
            { type: "image_url", image_url: { url: userPhoto } },
          ],
        },
      ];
    } else {
      // model generation
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPTS.model("") },
            { type: "image_url", image_url: { url: userPhoto } },
          ],
        },
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages,
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ image: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
