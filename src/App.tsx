
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./components/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import LegalDisclaimer from "./components/LegalDisclaimer";
import Index from "./pages/Index";
import Wardrobe from "./pages/Wardrobe";
import Outfits from "./pages/Outfits";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import VirtualTryOn from "./pages/VirtualTryOn";
import NewClothes from "./pages/NewClothes";
import Showroom from "./pages/Showroom";
import Preferences from './pages/Preferences';
import Calendar from './pages/Calendar'; // Import the Calendar page

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<>
              <Index />
              <LegalDisclaimer />
            </>} />
            <Route path="/wardrobe" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
            <Route path="/outfits" element={<ProtectedRoute><Outfits /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} /> {/* Style Planner route */}
            <Route path="/showroom" element={<ProtectedRoute><Showroom /></ProtectedRoute>} />
            <Route path="/new-clothes" element={<ProtectedRoute><NewClothes /></ProtectedRoute>} />
            <Route path="/virtual-try-on" element={<ProtectedRoute><VirtualTryOn /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
