
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from '@/pages/Home';
import MyWardrobe from '@/pages/MyWardrobe';
import MixAndMatch from '@/pages/MixAndMatch';
import StylePlanner from '@/pages/StylePlanner';
import FittingRoom from '@/pages/FittingRoom';
import ShopAndTry from '@/pages/ShopAndTry';
import Settings from '@/pages/Settings';
// Additional pages
import Auth from '@/pages/Auth';

// Providers
import { Toaster } from 'sonner';
import { OutfitProvider } from '@/hooks/useOutfitContext';
import { LocationProvider } from '@/hooks/useLocationStorage';
import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <OutfitProvider>
        <LocationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-wardrobe" element={<MyWardrobe />} />
              <Route path="/mix-and-match" element={<MixAndMatch />} />
              <Route path="/style-planner" element={<StylePlanner />} />
              <Route path="/fitting-room" element={<FittingRoom />} />
              <Route path="/shop-and-try" element={<ShopAndTry />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </Router>
          <Toaster position="top-center" richColors closeButton />
        </LocationProvider>
      </OutfitProvider>
    </AuthProvider>
  );
}

export default App;
