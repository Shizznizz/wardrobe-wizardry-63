
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

// Updated password validation schema with minimum 8 characters, 1 letter, 1 number
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .refine(
    (password) => /[a-zA-Z]/.test(password),
    "Password must contain at least one letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must contain at least one number"
  );

const authFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthFormValues = z.infer<typeof authFormSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to home");
      const from = location.state?.from || "/";
      navigate(from, { replace: true, state: { fromAuth: true } });
    }
  }, [isAuthenticated, navigate, location.state]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchPassword = form.watch("password");

  useEffect(() => {
    // Calculate password strength with updated requirements
    if (watchPassword) {
      let strength = 0;
      
      // Length check
      if (watchPassword.length >= 8) strength += 25;
      
      // Contains letter
      if (/[a-zA-Z]/.test(watchPassword)) strength += 25;
      
      // Contains number
      if (/[0-9]/.test(watchPassword)) strength += 25;
      
      // Contains special char
      if (/[!@#$%^&*(),.?":{}|<>]/.test(watchPassword)) strength += 25;
      
      setPasswordStrength(strength);
      
      // Set feedback based on strength
      if (strength <= 25) setPasswordFeedback("Weak");
      else if (strength <= 75) setPasswordFeedback("Medium");
      else setPasswordFeedback("Strong");
    } else {
      setPasswordStrength(0);
      setPasswordFeedback("");
    }
  }, [watchPassword]);

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      let response;
      
      if (authMode === "signin") {
        console.log("Attempting sign in with:", values.email);
        response = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      } else {
        console.log("Attempting sign up with:", values.email);
        response = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
      }

      if (response.error) {
        console.error("Auth error:", response.error.message);
        toast.error(response.error.message);
      } else {
        if (authMode === "signin") {
          console.log("Sign in successful");
          toast.success("Sign in successful! Redirecting...");
          // Short timeout to ensure the toast is visible before redirect
          setTimeout(() => {
            const from = location.state?.from || "/";
            navigate(from, { replace: true, state: { fromAuth: true } });
          }, 500);
        } else if (response.data?.user) {
          if (response.data.user.identities && response.data.user.identities.length === 0) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            console.log("Sign up successful");
            toast.success("Account created successfully! You can now sign in.");
            setAuthMode("signin");
            form.setValue("password", "");
            form.setValue("confirmPassword", "");
          }
        }
      }
    } catch (error: any) {
      console.error("Unexpected auth error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Initiating Google sign in");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error("Google auth error:", error);
        toast.error(error.message);
      }
    } catch (error: any) {
      console.error("Unexpected Google auth error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    form.reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  // If loading, show a minimal loading indicator
  if (isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Redirecting...</div>;
  }

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
        className="container max-w-md mx-auto px-4 pt-10 pb-20 flex-grow flex flex-col justify-center"
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

            {/* Google Sign In Button */}
            <motion.div variants={itemVariants}>
              <Button 
                onClick={handleGoogleLogin}
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900 font-medium"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Continue with Google
              </Button>
            </motion.div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-3 text-white/50 text-sm">or</span>
              <div className="flex-grow border-t border-white/10"></div>
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
                            autoComplete="email"
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
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Your password" 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/50 pr-10"
                              autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                              onClick={togglePasswordVisibility}
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        {watchPassword && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <Progress value={passwordStrength} className="h-1.5" />
                              <span className={`text-xs ml-2 ${
                                passwordStrength <= 25 ? 'text-red-400' : 
                                passwordStrength <= 75 ? 'text-yellow-400' : 
                                'text-green-400'
                              }`}>
                                {passwordFeedback}
                              </span>
                            </div>
                          </div>
                        )}
                        <FormMessage className="text-pink-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Confirm Password field (only for signup) */}
                {authMode === "signup" && (
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-200">Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Confirm your password" 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage className="text-pink-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

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
