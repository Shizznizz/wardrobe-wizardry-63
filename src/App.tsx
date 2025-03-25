
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { NotFound } from './pages/NotFound';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import Settings from './pages/Settings';
import ScrollToTop from './components/ScrollToTop';
import Showcase from './pages/Showcase';
import VirtualTryOn from './pages/VirtualTryOn';
import Auth from './pages/Auth';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <Toaster />
              <Router>
                <ScrollToTop />
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Showcase />} />
                  <Route path="/virtual-try-on" element={<VirtualTryOn />} />
                  <Route path="/wardrobe" element={<Wardrobe />} />
                  <Route path="/outfits" element={<Outfits />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </div>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
