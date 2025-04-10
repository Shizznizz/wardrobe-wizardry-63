
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import Index from './pages/Index';
import Outfits from './pages/Outfits';
import Wardrobe from './pages/Wardrobe';
import Calendar from './pages/Calendar';
import Showroom from './pages/Showroom';
import NewClothes from './pages/NewClothes';
import ShopAndTry from './pages/ShopAndTry';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Preferences from './pages/Preferences';
import Auth from './pages/Auth';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/showroom" element={<Showroom />} />
        <Route path="/new-clothes" element={<NewClothes />} />
        <Route path="/shop" element={<ShopAndTry />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
