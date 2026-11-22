import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(),
  trackEvent: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: mocks.invoke } },
}));

vi.mock("@/services/geminiService", () => ({
  trackEvent: mocks.trackEvent,
}));

import { generateImage } from "@/lib/ai-client";

describe("image generation tracking", () => {
  beforeEach(() => {
    mocks.invoke.mockReset();
    mocks.trackEvent.mockReset();
    mocks.trackEvent.mockResolvedValue(undefined);
    mocks.invoke.mockResolvedValue({ data: { image: "data:image/png;base64,result" }, error: null });
  });

  it.each([
    ["model", "model_generation"],
    ["tryon", "try_on"],
    ["style", "style_generation"],
  ] as const)("records successful %s use as %s", async (mode, event) => {
    const result = await generateImage({ mode, userPhoto: "data:image/png;base64,photo" });

    expect(result.image).toBe("data:image/png;base64,result");
    expect(mocks.trackEvent).toHaveBeenCalledWith(import.meta.env.VITE_BRAND_ID || "demo", event);
  });

  it("does not record a failed generation", async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: { message: "Generation failed" } });

    await generateImage({ mode: "tryon", userPhoto: "data:image/png;base64,photo" });

    expect(mocks.trackEvent).not.toHaveBeenCalled();
  });

  it("requires sign-in when the generation service rejects an unauthenticated request", async () => {
    mocks.invoke.mockResolvedValue({
      data: null,
      error: { message: "Unauthorized", context: { status: 401 } },
    });

    const result = await generateImage({ mode: "model", userPhoto: "data:image/png;base64,photo" });

    expect(result.requiresSignIn).toBe(true);
    expect(result.error).toBe("Sign in to generate images.");
    expect(mocks.trackEvent).not.toHaveBeenCalled();
  });
});