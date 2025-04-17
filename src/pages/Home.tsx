
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Welcome to Olivia
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Your personal AI-powered fashion assistant.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
