
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          <p className="text-white/70">
            Profile page is under construction. Check back soon!
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
