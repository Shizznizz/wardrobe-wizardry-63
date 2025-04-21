
import { toast } from 'sonner';
import PremiumExperience from './PremiumExperience';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const handleUpgradeToPremium = () => {
    toast.success('Redirecting to premium subscription');
  };

  return (
    <>
      {children}
      <div className="pb-48">
        <PremiumExperience onUpgrade={handleUpgradeToPremium} />
      </div>
    </>
  );
};

export default PageLayout;
