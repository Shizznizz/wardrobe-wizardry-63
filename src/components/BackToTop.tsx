
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Clean up the event listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`fixed bottom-20 right-5 z-50 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <button 
        onClick={scrollToTop}
        className="bg-gradient-to-r from-slate-800 to-purple-900 p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-transform duration-200 border border-purple-400/20 group"
        aria-label="Back to top"
      >
        <ChevronUp className="h-4 w-4 text-purple-300 group-hover:text-white" />
      </button>
    </div>
  );
};

export default BackToTop;
