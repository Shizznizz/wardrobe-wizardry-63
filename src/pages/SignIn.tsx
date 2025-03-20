
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
        <ClerkSignIn routing="path" path="/sign-in" />
      </motion.div>
    </div>
  );
};

export default SignIn;
