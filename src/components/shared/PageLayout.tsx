
import { toast } from 'sonner';
import PremiumExperience from './PremiumExperience';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we have outfit data passed in the location state
    if (location.state?.selectedOutfit) {
      // Show a toast notification to indicate the outfit selection
      toast.success(`${location.state.selectedOutfit.name} selected for try-on`);
      
      // You could also store this in local storage or context for persistence
      localStorage.setItem('selectedOutfit', JSON.stringify(location.state.selectedOutfit));
    }
  }, [location.state]);

  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription');
  };

  return (
    <div className="min-h-screen flex flex-col bg-fix-ios">
      <main className="flex-grow">
        {children}
      </main>
      
      <div className="mt-auto">
        <PremiumExperience onUpgrade={handleUpgradeToPremium} />
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
