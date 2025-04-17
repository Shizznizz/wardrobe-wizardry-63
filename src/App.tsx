
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import OliviaProvider from '@/components/OliviaProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

// Import pages
import Home from '@/pages/Home';
import ShopAndTry from '@/pages/ShopAndTry';
import NewClothes from '@/pages/NewClothes';
import MixAndMatch from '@/pages/MixAndMatch';
import Wardrobe from '@/pages/Wardrobe';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Dashboard from '@/pages/Dashboard';
import ScrollToTop from '@/components/ScrollToTop';

const App = () => {
  const handleUpgradeToPremium = () => {
    alert('This would redirect to the premium upgrade page');
  };
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <ScrollToTop />
        <OliviaProvider onUpgradeToPremium={handleUpgradeToPremium}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop-and-try" element={<ShopAndTry />} />
            <Route path="/new-clothes" element={<NewClothes />} />
            <Route path="/mix-and-match" element={<MixAndMatch />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </OliviaProvider>
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
