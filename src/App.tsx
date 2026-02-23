import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAppState } from "@/hooks/use-app-state";
import HomePage from "@/pages/HomePage";
import UploadPage from "@/pages/UploadPage";
import ProcessingPage from "@/pages/ProcessingPage";
import StudioPage from "@/pages/StudioPage";
import StyleVuPage from "@/pages/StyleVuPage";
import OnboardingPage from "@/pages/OnboardingPage";
import EcosystemPage from "@/pages/EcosystemPage";
import NotFound from "@/pages/NotFound";


const queryClient = new QueryClient();

function AppContent() {
  const state = useAppState();

  const toggleLang = () => state.setLang(state.lang === "en" ? "bn" : "en");

  return (
    <>
      <Navbar lang={state.lang} onToggleLang={toggleLang} />
      <Routes>
        <Route path="/" element={<HomePage lang={state.lang} onSelectMode={state.setMode} />} />
        <Route path="/upload" element={<UploadPage lang={state.lang} mode={state.mode} onUpload={state.setUserPhoto} />} />
        <Route
          path="/processing"
          element={
            <ProcessingPage
              lang={state.lang}
              userPhoto={state.userPhoto}
              onGenerated={(img) => {
                state.setGeneratedImage(img);
                state.addToHistory(img);
              }}
              onError={state.setError}
            />
          }
        />
        <Route
          path="/studio"
          element={
            <StudioPage
              lang={state.lang}
              mode={state.mode}
              onSetMode={state.setMode}
              userPhoto={state.userPhoto}
              generatedImage={state.generatedImage}
              onGenerated={state.setGeneratedImage}
              history={state.history}
              onAddHistory={state.addToHistory}
            />
          }
        />
        <Route path="/stylevu" element={<StyleVuPage lang={state.lang} />} />
        <Route path="/onboarding" element={<OnboardingPage lang={state.lang} />} />
        <Route path="/ecosystem" element={<EcosystemPage lang={state.lang} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer lang={state.lang} />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
