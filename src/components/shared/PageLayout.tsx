
import PremiumExperience from './PremiumExperience';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const location = useLocation();
  const isPremiumPage = location.pathname === "/premium";
  
  // Removed useEffect that was showing toast notification for selected outfit

  return (
    <div className="min-h-screen flex flex-col bg-fix-ios">
      <Header />
      
      <main className="flex-grow pt-8 sm:pt-10">
        {children}
      </main>
      
      <div className="mt-auto">
        {!isPremiumPage && <PremiumExperience onUpgrade={() => {}} />}
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
