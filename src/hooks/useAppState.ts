// ============================================
// BDai.studio — App State Management Hook
// ============================================

import { useState, useCallback } from 'react';
import type { AppState, AppScreen, Product } from '../types';

const initialState: AppState = {
  screen: 'start',
  userPhoto: null,
  selectedProduct: null,
  resultImage: null,
  isProcessing: false,
  error: null,
  language: 'bn',
  selectedCategory: 'all',
  selectedGender: 'all',
  searchQuery: '',
  tryOnCount: 0,
  shareMode: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const setScreen = useCallback((screen: AppScreen) => {
    setState((prev) => ({ ...prev, screen, error: null }));
  }, []);

  const setUserPhoto = useCallback((photo: string | null) => {
    setState((prev) => ({ ...prev, userPhoto: photo }));
  }, []);

  const selectProduct = useCallback((product: Product) => {
    setState((prev) => ({ ...prev, selectedProduct: product }));
  }, []);

  const setResultImage = useCallback((image: string | null) => {
    setState((prev) => ({
      ...prev,
      resultImage: image,
      isProcessing: false,
      screen: image ? 'result' : prev.screen,
      tryOnCount: image ? prev.tryOnCount + 1 : prev.tryOnCount,
    }));
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    setState((prev) => ({
      ...prev,
      isProcessing,
      screen: isProcessing ? 'processing' : prev.screen,
      error: null,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
      isProcessing: false,
      screen: prev.screen === 'processing' ? 'wardrobe' : prev.screen,
    }));
  }, []);

  const setLanguage = useCallback((language: 'bn' | 'en') => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setState((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const setGender = useCallback((gender: 'men' | 'women' | 'all') => {
    setState((prev) => ({ ...prev, selectedGender: gender, selectedCategory: 'all' }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setShareMode = useCallback((mode: boolean) => {
    setState((prev) => ({ ...prev, shareMode: mode }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      language: prev.language,
      tryOnCount: prev.tryOnCount,
    }));
  }, []);

  const tryAnother = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedProduct: null,
      resultImage: null,
      screen: 'wardrobe',
      shareMode: false,
      error: null,
    }));
  }, []);

  return {
    state,
    setScreen,
    setUserPhoto,
    selectProduct,
    setResultImage,
    setProcessing,
    setError,
    setLanguage,
    setCategory,
    setGender,
    setSearchQuery,
    setShareMode,
    reset,
    tryAnother,
  };
}
