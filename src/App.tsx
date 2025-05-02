
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import PageLayout from '@/components/shared/PageLayout';
import ScrollToTop from '@/components/ScrollToTop';
import CriticalAssetsPreloader from '@/components/CriticalAssetsPreloader';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import MyWardrobe from '@/pages/MyWardrobe';
import StyleQuiz from '@/pages/StyleQuiz';
import Premium from '@/pages/Premium';
import FittingRoom from '@/pages/FittingRoom';
import ShopAndTry from '@/pages/ShopAndTry';
import StylePlanner from '@/pages/StylePlanner';
import MixAndMatch from '@/pages/MixAndMatch';
import Settings from '@/pages/Settings';
import Quizzes from '@/pages/Quizzes';

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <CriticalAssetsPreloader />
      <PageLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/my-wardrobe" element={<MyWardrobe />} />
          <Route path="/style-quiz" element={<StyleQuiz />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/fitting-room" element={<FittingRoom />} />
          <Route path="/shop-and-try" element={<ShopAndTry />} />
          <Route path="/style-planner" element={<StylePlanner />} />
          <Route path="/mix-and-match" element={<MixAndMatch />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Routes>
      </PageLayout>
    </ThemeProvider>
  );
}

export default App;
