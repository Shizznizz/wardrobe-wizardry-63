
import { toast } from 'sonner';
import PremiumExperience from './PremiumExperience';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
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
