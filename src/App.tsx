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
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import SettingsPage from "@/pages/SettingsPage";

const queryClient = new QueryClient();

function AppContent() {
  const state = useAppState();
  const toggleLang = () => state.setLang(state.lang === "en" ? "bn" : "en");

  return (
    <Routes>
      {/* Public pages with navbar/footer */}
      <Route path="/" element={
        <>
          <Navbar lang={state.lang} onToggleLang={toggleLang} />
          <HomePage lang={state.lang} onSelectMode={state.setMode} />
          <Footer lang={state.lang} />
        </>
      } />
      <Route path="/upload" element={
        <>
          <Navbar lang={state.lang} onToggleLang={toggleLang} />
          <UploadPage lang={state.lang} mode={state.mode} onUpload={state.setUserPhoto} />
          <Footer lang={state.lang} />
        </>
      } />
      <Route path="/processing" element={
        <>
          <Navbar lang={state.lang} onToggleLang={toggleLang} />
          <ProcessingPage lang={state.lang} userPhoto={state.userPhoto} onGenerated={(img) => { state.setGeneratedImage(img); state.addToHistory(img); }} onError={state.setError} />
          <Footer lang={state.lang} />
        </>
      } />
      <Route path="/studio" element={
        <>
          <Navbar lang={state.lang} onToggleLang={toggleLang} />
          <StudioPage lang={state.lang} mode={state.mode} onSetMode={state.setMode} userPhoto={state.userPhoto} generatedImage={state.generatedImage} onGenerated={state.setGeneratedImage} history={state.history} onAddHistory={state.addToHistory} />
          <Footer lang={state.lang} />
        </>
      } />
      <Route path="/stylevu" element={<><Navbar lang={state.lang} onToggleLang={toggleLang} /><StyleVuPage lang={state.lang} /><Footer lang={state.lang} /></>} />
      <Route path="/onboarding" element={<><Navbar lang={state.lang} onToggleLang={toggleLang} /><OnboardingPage lang={state.lang} /><Footer lang={state.lang} /></>} />
      <Route path="/ecosystem" element={<><Navbar lang={state.lang} onToggleLang={toggleLang} /><EcosystemPage lang={state.lang} /><Footer lang={state.lang} /></>} />

      {/* Auth pages (no navbar/footer) */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard pages (sidebar layout, auth-protected) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/analytics" element={<div className="py-20 text-center text-muted-foreground">Analytics coming soon</div>} />
        <Route path="/billing" element={<div className="py-20 text-center text-muted-foreground">Billing coming soon</div>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
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
