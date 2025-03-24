
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles as SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfettiProps {
  duration?: number;
  count?: number;
  colors?: string[];
  showSparkles?: boolean;
  onComplete?: () => void;
  enabled?: boolean;
}

const Confetti = ({
  duration = 2000,
  count = 50,
  colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
  showSparkles = true,
  onComplete,
  enabled = true
}: ConfettiProps) => {
  const [isActive, setIsActive] = useState<boolean>(enabled);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; rotation: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate confetti particles
  useEffect(() => {
    if (!isActive) return;
    
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 10,
      rotation: Math.random() * 360
    }));
    
    setParticles(newParticles);
    
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsActive(false);
      if (onComplete) onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isActive, count, colors, duration, onComplete]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={containerRef}
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Confetti particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute"
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 1,
                rotate: 0,
                scale: 0
              }}
              animate={{
                x: `${particle.x - 10 + Math.random() * 20}%`,
                y: `${100 + Math.random() * 20}%`,
                opacity: 0,
                rotate: particle.rotation,
                scale: 1
              }}
              transition={{
                duration: 1 + Math.random() * 1,
                ease: "easeOut"
              }}
              style={{ 
                width: particle.size, 
                height: particle.size, 
                backgroundColor: particle.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0'
              }}
            />
          ))}
          
          {/* Center sparkles */}
          {showSparkles && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.3, 1] 
              }}
            >
              <div className="relative">
                <SparklesIcon 
                  className="h-24 w-24 text-purple-400 animate-pulse"
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.6, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: 0
                  }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Confetti };
