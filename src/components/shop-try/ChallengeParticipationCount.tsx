
import { motion } from 'framer-motion';
import { Flame, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChallengeParticipationCountProps {
  participantCount: number;
  onShowSubmissions: () => void;
}

const ChallengeParticipationCount = ({
  participantCount,
  onShowSubmissions
}: ChallengeParticipationCountProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 items-center justify-center"
    >
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center border border-orange-500/30">
        <Flame className="h-5 w-5 text-orange-500 mr-2" />
        <span className="text-white font-semibold">{participantCount}</span>
        <span className="text-white/80 ml-2">participants this week</span>
      </div>
      
      <Button
        onClick={onShowSubmissions}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
      >
        <Users className="h-4 w-4 mr-2" />
        Show Me Top Submissions
      </Button>
    </motion.div>
  );
};

export default ChallengeParticipationCount;
