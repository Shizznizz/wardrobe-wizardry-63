import React from 'react';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';

const FittingRoom = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Try On Your Wardrobe"
        subtitle="Upload a photo or use Olivia to see how clothes from your wardrobe look when styled together."
        image={{
          src: "/lovable-uploads/0e9ba14f-845b-4c56-a82c-5a616b0a3efb.png",
          alt: "Olivia in pink blouse and white pants",
          variant: "standing"
        }}
      />
      
      {/* Rest of the Fitting Room content */}
    </div>
  );
};

export default FittingRoom;
