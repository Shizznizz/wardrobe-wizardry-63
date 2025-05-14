
import PremiumExperience from './PremiumExperience';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const location = useLocation();
  const isPremiumPage = location.pathname === "/premium";
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-fix-ios">
      <Header />
      
      <main className={`flex-grow pt-4 sm:pt-6 md:pt-8 ${isMobile ? 'pb-4' : ''}`}>
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
