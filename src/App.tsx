import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Outfits from '@/pages/Outfits';
import Wardrobe from '@/pages/Wardrobe';
import Calendar from '@/pages/Calendar';
import Preferences from '@/pages/Preferences';
import Settings from '@/pages/Settings';
import Showroom from '@/pages/Showroom';
import MixAndMatch from '@/pages/MixAndMatch';
import NewClothes from '@/pages/NewClothes';
import NotFound from '@/pages/NotFound';
import BackToTop from '@/components/BackToTop';
import FittingRoom from '@/pages/FittingRoom';

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/mix-and-match" element={<MixAndMatch />} />
        <Route path="/new-clothes" element={<NewClothes />} />
        <Route path="/fitting-room" element={<FittingRoom />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BackToTop />
    </Router>
  );
}

export default App;
