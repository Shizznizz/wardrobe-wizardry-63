
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import Wardrobe from './pages/Wardrobe';
import Outfits from './pages/Outfits';
import Settings from './pages/Settings';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <Toaster />
              <Router>
                <ScrollToTop />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<div className="flex items-center justify-center min-h-screen">Home Page</div>} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/wardrobe"
                    element={
                      <ProtectedRoute>
                        <Wardrobe />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/outfits"
                    element={
                      <ProtectedRoute>
                        <Outfits />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Catch-all route for 404 */}
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
