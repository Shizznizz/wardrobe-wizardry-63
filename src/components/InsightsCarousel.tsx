
import { motion } from "framer-motion";
import { Palette, TrendingUp, CalendarDays } from "lucide-react";

const insights = [
  {
    icon: <Palette className="h-6 w-6 text-blue-300" />,
    title: "Color Harmony",
    description: "Mix and match colors from the same palette for a cohesive look. Try complementary colors for a bold statement!",
    color: "from-blue-600/20 to-cyan-600/20",
    delay: 0
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-purple-300" />,
    title: "Wardrobe Insight",
    description: "Did you know? The average person uses only 20% of their wardrobe regularly. Our AI helps you rediscover the other 80%!",
    color: "from-purple-600/20 to-pink-600/20",
    delay: 0.1
  },
  {
    icon: <CalendarDays className="h-6 w-6 text-pink-300" />,
    title: "Plan Ahead",
    description: "Have you tried styling based on your upcoming events? It's a great way to plan your outfits ahead of time.",
    color: "from-pink-600/20 to-rose-600/20",
    delay: 0.2
  }
];

const InsightsCarousel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-6xl mx-auto py-20"
    >
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Style Intelligence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-white/80 max-w-3xl mx-auto"
        >
          Discover fashion insights powered by our advanced style analysis technology
        </motion.p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 px-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: insight.delay, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            className="flex-1 glass-dark p-8 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
          >
            <div className="relative overflow-hidden mb-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
              <div className="relative z-10 flex items-center justify-center bg-white/10 rounded-full w-16 h-16 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                {insight.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">{insight.title}</h3>
            <p className="text-white/80 leading-relaxed">{insight.description}</p>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors">
                Learn more
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InsightsCarousel;
