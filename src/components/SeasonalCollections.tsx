
import React from 'react';
import { motion } from 'framer-motion';
import CollectionCard from './CollectionCard';

const SeasonalCollections: React.FC = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full py-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2">
          Seasonal Collections
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <CollectionCard
          title="Spring Transition Collection"
          description="Early spring essentials with versatile layering pieces for changing temperatures."
          gradient="from-green-500/30 to-blue-400/30"
          styleAdvice={{
            text: "Olivia's pick – Light layering for unpredictable Dutch spring weather. Focus on breathable fabrics with waterproof outer layers.",
            oliviaImage: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png"
          }}
        />
        
        <CollectionCard
          title="March Collection"
          description="Coming soon"
          comingSoon={true}
          gradient="from-blue-400/30 to-purple-400/30"
          className="md:h-full"
        />
        
        <CollectionCard
          title="June Collection"
          subtitle="June 2025"
          description="Breathable fabrics and versatile pieces for warm days and cool evenings."
          gradient="from-amber-400/30 to-orange-300/30"
          styleAdvice={{
            text: "Olivia's pick – Natural linen blends in earth tones that transition easily from beach to dinner with just a few accessories.",
            oliviaImage: "/lovable-uploads/86bf74b8-b311-4e3c-bfd6-53819add3df8.png"
          }}
        />
      </div>
    </motion.section>
  );
};

export default SeasonalCollections;
