import { useState, useCallback } from "react";
import type { Language } from "@/lib/i18n";
import type { AppMode } from "@/lib/app-state";

export function useAppState() {
  const [lang, setLang] = useState<Language>("en");
  const [mode, setMode] = useState<AppMode>("tryon");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [garmentPhoto, setGarmentPhoto] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useCallback((image: string) => {
    setHistory((prev) => [image, ...prev].slice(0, 20));
  }, []);

  const reset = useCallback(() => {
    setUserPhoto(null);
    setGeneratedImage(null);
    setGarmentPhoto(null);
    setError(null);
  }, []);

  return {
    lang, setLang,
    mode, setMode,
    userPhoto, setUserPhoto,
    generatedImage, setGeneratedImage,
    garmentPhoto, setGarmentPhoto,
    history, addToHistory,
    isLoading, setLoading,
    error, setError,
    reset,
  };
}
