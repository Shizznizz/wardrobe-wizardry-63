
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
        <ClerkSignUp routing="path" path="/sign-up" />
      </motion.div>
    </div>
  );
};

export default SignUp;
