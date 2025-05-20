
import PremiumExperience from './PremiumExperience';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Only show Premium Experience on Home, Premium, and Shop & Try pages
  const showPremiumExperience = currentPath === '/' || 
                                currentPath === '/premium' || 
                                currentPath === '/shop-and-try';

  return (
    <div className="min-h-screen flex flex-col bg-fix-ios">
      <Header />
      
      <main className="flex-grow pt-8 sm:pt-10">
        {children}
      </main>
      
      <div className="mt-auto">
        {showPremiumExperience && <PremiumExperience onUpgrade={() => {}} />}
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
