import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      <motion.div 
        className="text-center px-4 max-w-md glass-dark p-10 rounded-2xl border border-white/10 backdrop-blur-lg shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <div className="relative mb-6 mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-violet-400 to-blue-500 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-blue-500 animate-pulse opacity-50 blur-md"></div>
            <span className="text-5xl font-bold">404</span>
          </div>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Page Not Found
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl text-blue-100/80 mb-8">
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Link to="/" className="inline-flex items-center group text-blue-300 hover:text-blue-100 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="underline">Return to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
