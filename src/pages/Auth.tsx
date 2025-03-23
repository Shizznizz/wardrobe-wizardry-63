
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";

const authFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      let response;
      
      if (authMode === "signin") {
        response = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      } else {
        response = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
      }

      if (response.error) {
        toast.error(response.error.message);
      } else {
        if (authMode === "signin" || response.data?.user?.identities?.length === 0) {
          toast.success(authMode === "signin" ? "Signed in successfully!" : "Account created successfully!");
          navigate("/");
        } else {
          toast.success("Verification email sent! Please check your inbox.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    form.reset();
  };

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
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white flex flex-col">
      <div className="p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-white hover:text-blue-300 transition-colors" 
          onClick={() => navigate("/")}
          asChild
        >
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <motion.div 
        className="container max-w-md mx-auto px-4 pt-10 pb-10 flex-grow flex flex-col justify-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="glass-dark p-8 rounded-2xl border border-white/10 backdrop-blur-lg shadow-xl">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                {authMode === "signin" ? "Sign In" : "Create an Account"}
              </h1>
              <p className="text-blue-100/80">
                {authMode === "signin"
                  ? "Enter your credentials to sign in to your account"
                  : "Enter your information to create a new account"}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200">Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your email" 
                            {...field} 
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Your password" 
                            {...field} 
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button 
                    type="submit" 
                    className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl" 
                    disabled={isLoading}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative">
                      {isLoading
                        ? authMode === "signin"
                          ? "Signing in..."
                          : "Creating account..."
                        : authMode === "signin"
                        ? "Sign In"
                        : "Create Account"}
                    </span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-300 hover:text-blue-100 underline transition-colors"
                    onClick={toggleAuthMode}
                  >
                    {authMode === "signin"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
