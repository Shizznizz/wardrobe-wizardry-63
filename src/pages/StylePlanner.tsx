import React from 'react';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';

const StylePlanner = () => {
  const handleShowTimeline = () => {
    // Scroll to timeline section or open timeline view
    const timelineSection = document.getElementById('style-timeline');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Your Style Planner & Insights"
        subtitle="Explore your fashion evolution and unlock personalized insights that guide your unique style journey."
        image={{
          src: "/lovable-uploads/56943e49-b4d1-47fe-adf7-ee221134ef60.png",
          alt: "Woman in light beige pantsuit with gold belt and sunglasses",
          variant: "standing"
        }}
        buttons={[
          {
            label: "Show Me My Style Timeline",
            onClick: handleShowTimeline,
            variant: "lavender"
          }
        ]}
      />
      
      {/* Rest of the Style Planner content */}
      <div id="style-timeline" className="pt-20">
        {/* Style timeline content would go here */}
      </div>
    </div>
  );
};

export default StylePlanner;
