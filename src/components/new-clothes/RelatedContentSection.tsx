
import { motion } from 'framer-motion';
import AffiliateProducts from '@/components/outfits/AffiliateProducts';
import OutfitStylingTips from '@/components/outfits/OutfitStylingTips';
import RecommendedOutfits from '@/components/outfits/RecommendedOutfits';

interface RelatedContentSectionProps {
  finalImage: string | null;
}

const RelatedContentSection = ({ finalImage }: RelatedContentSectionProps) => {
  if (!finalImage) return null;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <>
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <AffiliateProducts />
        <OutfitStylingTips />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <RecommendedOutfits />
      </motion.div>
    </>
  );
};

export default RelatedContentSection;
