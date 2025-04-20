
import { motion } from "framer-motion";
import { Palette, TrendingUp, CalendarDays } from "lucide-react";

const insights = [
  {
    icon: <Palette className="h-6 w-6 text-blue-300" />,
    title: "Color Harmony",
    description: "Mix and match colors from the same palette for a cohesive look. Try complementary colors for a bold statement!"
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-purple-300" />,
    title: "Wardrobe Insight",
    description: "Did you know? The average person uses only 20% of their wardrobe regularly. Our AI helps you rediscover the other 80%!"
  },
  {
    icon: <CalendarDays className="h-6 w-6 text-pink-300" />,
    title: "Plan Ahead",
    description: "Have you tried styling based on your upcoming events? It's a great way to plan your outfits ahead of time."
  }
];

const InsightsCarousel = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex-1 glass-dark p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10">
                {insight.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
            </div>
            <p className="text-white/80 leading-relaxed">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InsightsCarousel;
