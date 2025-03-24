
import { motion } from "framer-motion";

const timelineEvents = [
  {
    id: 1,
    date: "April 2023",
    title: "Summer Collection",
    description: "First styling session with focus on summer casual wear and beachwear.",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    date: "June 2023",
    title: "Business Wardrobe",
    description: "Professional attire styling for office meetings and presentations.",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    date: "September 2023",
    title: "Fall Essentials",
    description: "Layering essentials for the autumn season with earthy tones.",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    date: "December 2023",
    title: "Holiday Specials",
    description: "Festive styling for winter gatherings and holiday parties.",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    date: "February 2024",
    title: "Spring Preview",
    description: "Early styling session for the upcoming spring season with light fabrics.",
    image: "/placeholder.svg"
  }
];

const StylingTimeline = () => {
  return (
    <div className="relative py-8">
      {/* Timeline center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-purple-500/50"></div>
      
      <div className="relative">
        {timelineEvents.map((event, index) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={`mb-12 flex items-center ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            } relative z-10`}
          >
            {/* Timeline node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 z-20"></div>
            
            {/* Content */}
            <div className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
              <span className="text-sm font-medium text-blue-300">{event.date}</span>
              <h3 className="text-lg font-semibold text-white mt-1">{event.title}</h3>
              <p className="text-white/70 mt-1">{event.description}</p>
            </div>
            
            {/* Image */}
            <div className={`w-5/12 ${index % 2 === 0 ? "pl-8" : "pr-8"}`}>
              <div className="aspect-video overflow-hidden rounded-lg glass-dark border border-white/10">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StylingTimeline;
