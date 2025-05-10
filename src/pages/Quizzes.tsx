import React from 'react';
import EnhancedHeroSection from '@/components/shared/EnhancedHeroSection';

const Quizzes = () => {
  const handleFindYourStyle = () => {
    // Implementation for finding your style
    const styleQuizSection = document.getElementById('style-quiz');
    if (styleQuizSection) {
      styleQuizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMoodMatcher = () => {
    // Implementation for mood matcher
    const moodMatcherSection = document.getElementById('mood-matcher');
    if (moodMatcherSection) {
      moodMatcherSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pb-20">
      <EnhancedHeroSection
        title="Discover Your Unique Style"
        subtitle="Take a quick quiz to reveal your personal style identity and receive curated outfit ideas."
        image={{
          src: "/lovable-uploads/f0afcad3-9696-4e23-a118-04525585d72a.png",
          alt: "Olivia headshot with ponytail and pink blouse",
          variant: "headshot"
        }}
        buttons={[
          {
            label: "Find Your Style",
            onClick: handleFindYourStyle,
            variant: "black"
          },
          {
            label: "Mood Matcher",
            onClick: handleMoodMatcher,
            variant: "secondary"
          }
        ]}
      />
      
      <div className="container mx-auto px-4 pt-10">
        <div id="style-quiz" className="pt-10">
          {/* Style quiz content would go here */}
        </div>
        
        <div id="mood-matcher" className="pt-20">
          {/* Mood matcher content would go here */}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
