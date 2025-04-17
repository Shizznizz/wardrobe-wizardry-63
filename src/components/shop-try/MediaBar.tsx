
import { motion } from 'framer-motion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface MediaMention {
  name: string;
  logo: string;
  quote: string;
}

const mediaQuotes: MediaMention[] = [
  {
    name: 'Vogue',
    logo: '/placeholder.svg',
    quote: 'The future of digital fashion shopping is here.'
  },
  {
    name: 'Business Insider',
    logo: '/placeholder.svg',
    quote: 'Revolutionary AI technology transforms online shopping.'
  },
  {
    name: 'TikTok',
    logo: '/placeholder.svg',
    quote: 'Gen Z\'s favorite virtual fitting room.'
  },
  {
    name: 'Refinery29',
    logo: '/placeholder.svg',
    quote: 'Finally, a solution to online shopping uncertainty.'
  }
];

const MediaBar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 px-4"
    >
      <h3 className="text-center text-lg font-medium text-white/90 mb-8">
        As Seen In
      </h3>
      
      <div className="flex justify-center items-center gap-8 flex-wrap">
        {mediaQuotes.map((media) => (
          <TooltipProvider key={media.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={media.logo}
                    alt={media.name}
                    className="h-8 md:h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom"
                className="max-w-xs bg-slate-900 border-purple-500/30"
              >
                <p className="text-sm">"{media.quote}"</p>
                <p className="text-xs text-purple-300 mt-1">- {media.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </motion.div>
  );
};

export default MediaBar;
