
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from "@/components/theme-provider"
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import MyWardrobe from '@/pages/MyWardrobe';
import StyleQuiz from '@/pages/StyleQuiz';
import Premium from '@/pages/Premium';
import FittingRoom from '@/pages/FittingRoom';
import ShopAndTry from '@/pages/ShopAndTry';
import CalendarPage from '@/pages/CalendarPage';
import MixAndMatch from '@/pages/MixAndMatch';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-react-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/my-wardrobe" element={<MyWardrobe />} />
          <Route path="/style-quiz" element={<StyleQuiz />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/fitting-room" element={<FittingRoom />} />
          <Route path="/shop-and-try" element={<ShopAndTry />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/mix-and-match" element={<MixAndMatch />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
