
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ThemeProvider } from "./components/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import LegalDisclaimer from "./components/LegalDisclaimer";
import Index from "./pages/Index";
import MyWardrobe from "./pages/MyWardrobe";
import MixAndMatch from "./pages/MixAndMatch";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ShopAndTry from "./pages/ShopAndTry";
import FittingRoom from "./pages/FittingRoom";
import Preferences from './pages/Preferences';
import StylePlanner from './pages/StylePlanner';
import StyleQuiz from './pages/StyleQuiz';

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
            <Route path="/my-wardrobe" element={<ProtectedRoute><MyWardrobe /></ProtectedRoute>} />
            <Route path="/mix-and-match" element={<ProtectedRoute><MixAndMatch /></ProtectedRoute>} />
            <Route path="/style-planner" element={<ProtectedRoute><StylePlanner /></ProtectedRoute>} />
            <Route path="/fitting-room" element={<ProtectedRoute><FittingRoom /></ProtectedRoute>} />
            <Route path="/shop-and-try" element={<ProtectedRoute><ShopAndTry /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
            <Route path="/style-quiz" element={<ProtectedRoute><StyleQuiz /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Redirects from old to new routes */}
            <Route path="/wardrobe" element={<Navigate to="/my-wardrobe" replace />} />
            <Route path="/outfits" element={<Navigate to="/mix-and-match" replace />} />
            <Route path="/calendar" element={<Navigate to="/style-planner" replace />} />
            <Route path="/showroom" element={<Navigate to="/fitting-room" replace />} />
            <Route path="/new-clothes" element={<Navigate to="/shop-and-try" replace />} />
            <Route path="/virtual-try-on" element={<Navigate to="/fitting-room" replace />} />
            
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
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
