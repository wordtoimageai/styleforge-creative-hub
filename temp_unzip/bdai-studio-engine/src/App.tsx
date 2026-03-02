// ============================================
// BDai.studio — Main App Component
// Orchestrates screens based on app state
// ============================================

import { useBrand } from './BrandContext';
import { useAppState } from './hooks/useAppState';
import { generateTryOn } from './services/geminiService';
import { addWatermark } from './utils/watermark';
import { t } from './i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import StartScreen from './components/StartScreen';
import CameraView from './components/CameraView';
import WardrobePanel from './components/WardrobePanel';
import ProcessingOverlay from './components/ProcessingOverlay';
import ResultScreen from './components/ResultScreen';
import SharePanel from './components/SharePanel';

export default function App() {
  const { config, language, isLoading, error: configError } = useBrand();
  const {
    state, setScreen, setUserPhoto, selectProduct, setResultImage,
    setProcessing, setError, setCategory, setGender, setSearchQuery,
    setShareMode, reset, tryAnother,
  } = useAppState();

  // Loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>{t('app.loading', language)}</p>
      </div>
    );
  }

  // Config error
  if (configError || !config) {
    return (
      <div className="app-error">
        <h2>⚠️ Configuration Error</h2>
        <p>{configError || 'Brand configuration not found'}</p>
      </div>
    );
  }

  // Handle try-on generation
  const handleTryOn = async () => {
    if (!state.userPhoto || !state.selectedProduct) {
      setError(!state.userPhoto ? 'error.noPhoto' : 'error.noProduct');
      return;
    }

    setProcessing(true);

    try {
      // Get product image as base64
      let productImageBase64 = '';
      const imgUrl = state.selectedProduct.imageUrl;

      if (imgUrl.startsWith('data:')) {
        productImageBase64 = imgUrl.split(',')[1];
      } else if (imgUrl.startsWith('http')) {
        try {
          const resp = await fetch(imgUrl);
          const blob = await resp.blob();
          productImageBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(blob);
          });
        } catch {
          setError(t('error.network', language));
          return;
        }
      }

      const result = await generateTryOn({
        brandId: config.brandId,
        userImage: state.userPhoto,
        productImage: productImageBase64,
        productCategory: state.selectedProduct.category,
        productName: state.selectedProduct.name,
        productFabric: state.selectedProduct.fabric,
        productColor: state.selectedProduct.color,
      });

      if (!result.success || !result.resultImage) {
        const errorKey = result.error === 'rate_limit' ? 'error.rateLimit'
          : result.error === 'network_error' ? 'error.network'
          : 'error.aiError';
        setError(t(errorKey, language));
        return;
      }

      // Apply watermark
      let finalImage = result.resultImage;
      if (config.watermark.enabled) {
        finalImage = await addWatermark(
          result.resultImage,
          config.brandName,
          config.logo,
          config.watermark
        );
      }

      setResultImage(finalImage);
    } catch (err) {
      console.error('Try-on error:', err);
      setError(t('error.generic', language));
    }
  };

  // Handle photo capture/upload
  const handlePhoto = (base64: string) => {
    setUserPhoto(base64);
    setScreen('wardrobe');
  };

  return (
    <div className="app-container">
      <Header />

      <main className="app-main">
        {/* Error Toast */}
        {state.error && (
          <div className="error-toast" onClick={() => setError(null)}>
            <span className="error-icon">⚠️</span>
            <span>{state.error}</span>
            <button className="error-close">✕</button>
          </div>
        )}

        {/* Screen Router */}
        {state.screen === 'start' && (
          <StartScreen
            onTakePhoto={() => setScreen('camera')}
            onUploadPhoto={handlePhoto}
            onBrowseFirst={() => setScreen('wardrobe')}
          />
        )}

        {state.screen === 'camera' && (
          <CameraView
            onCapture={handlePhoto}
            onBack={() => setScreen('start')}
          />
        )}

        {state.screen === 'wardrobe' && (
          <WardrobePanel
            selectedProduct={state.selectedProduct}
            selectedCategory={state.selectedCategory}
            selectedGender={state.selectedGender}
            searchQuery={state.searchQuery}
            hasPhoto={!!state.userPhoto}
            onSelectProduct={selectProduct}
            onSetCategory={setCategory}
            onSetGender={setGender}
            onSearch={setSearchQuery}
            onTryOn={handleTryOn}
            onBack={() => setScreen(state.userPhoto ? 'start' : 'start')}
          />
        )}

        {state.screen === 'processing' && <ProcessingOverlay />}

        {state.screen === 'result' && state.resultImage && state.selectedProduct && (
          <ResultScreen
            resultImage={state.resultImage}
            product={state.selectedProduct}
            onTryAnother={tryAnother}
            onShare={() => setShareMode(true)}
            onNewPhoto={reset}
          />
        )}

        {/* Share Modal */}
        {state.shareMode && state.resultImage && state.selectedProduct && (
          <SharePanel
            resultImage={state.resultImage}
            product={state.selectedProduct}
            onClose={() => setShareMode(false)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
