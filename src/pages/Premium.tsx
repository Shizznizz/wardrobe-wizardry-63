
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Wand, Shirt, Clock, Star, Crown, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/ui/optimized-image';
import PageLayout from '@/components/shared/PageLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const PremiumPage = () => {
  const [activeAccordion, setActiveAccordion] = React.useState<string | null>(null);
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <MessageCircle className="h-10 w-10 text-amber-400" />,
      title: "Chat with Olivia",
      description: "Instant fashion advice, every time you need it. Olivia knows your vibe and always gives the best tips."
    },
    {
      icon: <Wand className="h-10 w-10 text-pink-400" />,
      title: "AI Outfit Generator",
      description: "Let Olivia create outfits that match your wardrobe, body type, and style goals—like magic."
    },
    {
      icon: <Shirt className="h-10 w-10 text-purple-400" />,
      title: "Virtual Try-On",
      description: "See how your outfit looks on you before wearing it. Just upload a photo and Olivia takes care of the rest."
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-400" />,
      title: "Early Access",
      description: "Be the first to explore new drops, trending looks, and curated collections."
    }
  ];

  const comparisonData = [
    { feature: "Wardrobe Uploads", free: true, premium: true },
    { feature: "Outfit Suggestions", free: "Basic", premium: "Smart + Personalized" },
    { feature: "Virtual Try-On", free: false, premium: true },
    { feature: "Chat with Olivia", free: false, premium: "Instant Styling Chat" },
    { feature: "AI Outfit Generator", free: false, premium: "Unlimited Access" },
    { feature: "Early Access to New Drops", free: false, premium: true }
  ];

  const testimonials = [
    {
      quote: "I finally feel confident in what I wear every day. Olivia is like my stylish best friend!",
      rating: 5,
      name: "Sophie",
      age: 23,
      avatar: "/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png"
    },
    {
      quote: "Virtual try-on saved me from so many outfit disasters. Love it!",
      rating: 5,
      name: "Naomi",
      age: 26,
      avatar: "/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png"
    },
    {
      quote: "Premium is SO worth it. The outfits, the tips… I'm obsessed!",
      rating: 5,
      name: "Layla",
      age: 21,
      avatar: "/lovable-uploads/e4bf2134-0936-46f8-8d70-adcc220e50be.png"
    }
  ];

  const pricingPlans = [
    {
      name: "Weekly",
      price: "€2.99",
      interval: "week",
      description: "Try it out! Cancel anytime.",
      popular: false
    },
    {
      name: "Monthly – Best Value",
      price: "€8.99",
      interval: "month",
      description: "Your style journey, powered by Olivia.",
      popular: true
    }
  ];

  // Updated FAQs with the two new questions
  const faqs = [
    {
      id: "cancel",
      question: "Can I cancel anytime?",
      answer: "Yes, no strings attached. Cancel with one click."
    },
    {
      id: "wardrobe",
      question: "Will I still see my wardrobe if I don't go premium?",
      answer: "Absolutely! Premium just adds more magic on top."
    },
    {
      id: "privacy",
      question: "Is the virtual try-on private?",
      answer: "100%. Only you can see your photos and try-ons."
    },
    {
      id: "upgrade",
      question: "What happens when I upgrade?",
      answer: "Olivia instantly unlocks new features for you. No delay."
    },
    {
      id: "change-mind",
      question: "What if I change my mind?",
      answer: "No worries! You can cancel anytime, no questions asked."
    },
    {
      id: "try-week",
      question: "Can I try it for just one week?",
      answer: "Absolutely! That's what the weekly plan is for — instant access, total freedom."
    }
  ];

  const handleUpgrade = () => {
    console.log("User clicked upgrade button");
    // This would handle the subscription flow in a real implementation
  };

  const toggleAccordion = (id: string) => {
    if (activeAccordion === id) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(id);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
        {/* 1. Hero Section - Updated with enhanced animation */}
        <Container>
          <motion.section 
            className="py-8 md:py-16 lg:py-24"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0 px-4 md:px-0">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
                  Go Premium with Olivia ✨
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-white/80 mb-8 max-w-xl">
                  You're one step away from the ultimate wardrobe experience. Olivia unlocks exclusive styling tools, outfit magic, and early access surprises—just for you!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto flex justify-center md:justify-start"
                >
                  <Button 
                    onClick={handleUpgrade} 
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20 py-4 md:py-6 px-6 md:px-8 text-base md:text-lg rounded-xl w-full md:w-auto"
                    size="lg"
                  >
                    <Crown className="mr-2 h-4 w-4 md:h-5 md:w-5" /> <span className="whitespace-nowrap">✨ Unlock Premium</span>
                  </Button>
                </motion.div>
              </div>
              <div className="w-full md:w-1/2 relative">
                {/* Golden glow effect */}
                <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3,
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  className="relative z-10"
                >
                  <OptimizedImage
                    src="/lovable-uploads/252168a4-cd94-4608-9f6f-c8c54a033759.png"
                    alt="Olivia in gold outfit"
                    className="max-h-[300px] md:max-h-[500px] mx-auto drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]"
                  />
                </motion.div>
              </div>
            </div>
          </motion.section>
        </Container>

        {/* 2. What You'll Unlock Section */}
        <Container>
          <motion.section 
            className="py-10 md:py-16 mb-6 md:mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">
              What You'll Unlock
            </h2>

            {/* Desktop grid view */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={fadeInUp}
                  className="glass-dark rounded-xl p-6 backdrop-blur-sm border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="flex items-center justify-center mb-5">
                    <div className="p-3 rounded-full bg-white/10">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">{feature.title}</h3>
                  <p className="text-white/70 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile carousel view */}
            <div className="md:hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {features.map((feature, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <motion.div 
                        variants={fadeInUp}
                        className="glass-dark rounded-xl p-6 backdrop-blur-sm border border-amber-500/20 h-full"
                      >
                        <div className="flex items-center justify-center mb-5">
                          <div className="p-3 rounded-full bg-white/10">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-3">{feature.title}</h3>
                        <p className="text-white/70 text-center text-sm">{feature.description}</p>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
                  <CarouselNext className="relative static right-0 translate-y-0" />
                </div>
              </Carousel>
            </div>
          </motion.section>
        </Container>

        {/* 3. Olivia's Message - Updated quote */}
        <Container>
          <motion.section
            className="py-6 md:py-8 mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto relative px-4 md:px-0">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-10">
                <motion.div 
                  className="w-20 h-20 md:w-24 md:h-24 relative flex-shrink-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20, 
                    delay: 0.2 
                  }}
                >
                  <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md"></div>
                  <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full border-2 border-amber-400/50 relative z-10">
                    <OptimizedImage
                      src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png"
                      alt="Olivia"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-slate-800/80 to-indigo-900/80 p-4 md:p-6 rounded-2xl border border-amber-500/20 relative speech-bubble-left"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-base md:text-lg text-white/90 italic">
                    "Let's turn your wardrobe into a wow-drobe. Premium is where your real style story begins ✨"
                  </p>
                  <p className="text-right text-white/70 mt-2">— Olivia</p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </Container>

        {/* 4. Comparison Table */}
        <Container>
          <motion.section
            className="py-8 md:py-12 mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
              Free vs <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">Premium Plan ✨</span>
            </h2>
            
            <div className="max-w-4xl mx-auto px-4 md:px-0">
              <div className="overflow-x-auto rounded-xl border border-white/10 shadow-xl">
                <table className="w-full bg-gradient-to-b from-slate-900/90 to-slate-800/90 text-white">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-2 md:px-4 text-left text-sm md:text-base">Feature</th>
                      <th className="py-4 px-2 md:px-4 text-center text-sm md:text-base">Free Plan</th>
                      <th className="py-4 px-2 md:px-4 text-center bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-sm md:text-base">
                        Premium Plan ✨
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, index) => (
                      <tr key={index} className={cn(
                        "border-b border-white/5",
                        index % 2 === 0 ? "bg-slate-800/20" : "bg-transparent"
                      )}>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-sm md:text-base">{item.feature}</td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-center">
                          {typeof item.free === 'boolean' ? (
                            item.free ? (
                              <Check className="h-4 w-4 md:h-5 md:w-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 md:h-5 md:w-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-white/70 text-sm md:text-base">{item.free}</span>
                          )}
                        </td>
                        <td className="py-3 md:py-4 px-2 md:px-4 text-center bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
                          {typeof item.premium === 'boolean' ? (
                            item.premium ? (
                              <div className="flex justify-center">
                                <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold text-xs">
                                  <Check className="h-3 w-3 mr-0.5" /> Yes
                                </Badge>
                              </div>
                            ) : (
                              <X className="h-4 w-4 md:h-5 md:w-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <div className="flex justify-center">
                              <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold text-xs whitespace-nowrap">
                                <Star className="h-3 w-3 mr-0.5" /> {item.premium}
                              </Badge>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        </Container>

        {/* 5. Testimonials */}
        <Container>
          <motion.section
            className="py-8 md:py-12 mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              What Our Premium Members Say
            </h2>
            
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-dark rounded-xl p-6 border border-white/10 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4 overflow-hidden rounded-full h-12 w-12 bg-slate-800 flex-shrink-0">
                      {testimonial.avatar && (
                        <OptimizedImage
                          src={testimonial.avatar}
                          alt={`${testimonial.name} avatar`}
                          className="object-cover h-full w-full"
                          width={48}
                          height={48}
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}, {testimonial.age}</h4>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-white/80 text-sm italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile carousel */}
            <div className="md:hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="pl-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-dark rounded-xl p-6 border border-white/10 backdrop-blur-sm h-full"
                      >
                        <div className="flex items-center mb-4">
                          <div className="mr-4 overflow-hidden rounded-full h-12 w-12 bg-slate-800 flex-shrink-0">
                            {testimonial.avatar && (
                              <OptimizedImage
                                src={testimonial.avatar}
                                alt={`${testimonial.name} avatar`}
                                className="object-cover h-full w-full"
                                width={48}
                                height={48}
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{testimonial.name}, {testimonial.age}</h4>
                          </div>
                        </div>

                        <div className="flex mb-3">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>

                        <p className="text-white/80 text-sm italic">"{testimonial.quote}"</p>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
                  <CarouselNext className="relative static right-0 translate-y-0" />
                </div>
              </Carousel>
            </div>
          </motion.section>
        </Container>

        {/* 6. Pricing Section */}
        <Container>
          <motion.section
            className="py-8 md:py-12 mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">
              Choose Your Plan
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl mx-auto justify-center px-4 md:px-0">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-1"
                >
                  <Card className={`overflow-hidden h-full backdrop-blur-sm ${
                    plan.popular 
                      ? 'bg-gradient-to-b from-slate-800/95 to-purple-950/95 border-amber-500/30' 
                      : 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-white/10'
                  }`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 left-0">
                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold py-1 px-3 text-center">
                          BEST VALUE
                        </div>
                      </div>
                    )}

                    <CardContent className={`p-6 text-center ${plan.popular ? 'pt-8' : 'pt-6'}`}>
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-base md:text-lg text-white/70 ml-1">/{plan.interval}</span>
                      </div>
                      <p className="text-white/70 mb-6 text-sm md:text-base">{plan.description}</p>

                      <Button 
                        onClick={handleUpgrade} 
                        className={cn(
                          "w-full py-4 md:py-6",
                          plan.popular
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 hover:opacity-90 text-black font-semibold shadow-lg"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        )}
                      >
                        Choose {plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-white/60 mt-6 text-sm px-4">
              Instant access. Cancel anytime. Style magic begins the moment you click.
            </p>
          </motion.section>
        </Container>

        {/* 7. FAQ Section - Updated with new FAQs */}
        <Container>
          <motion.section
            className="py-8 md:py-12 mb-8 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-3 md:space-y-4 px-4 md:px-0">
              {faqs.map((faq) => (
                <Collapsible
                  key={faq.id}
                  open={activeAccordion === faq.id}
                  onOpenChange={() => toggleAccordion(faq.id)}
                  className="rounded-lg border border-white/10 hover:border-white/20 bg-slate-800/50 transition-all duration-300"
                >
                  <CollapsibleTrigger className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between text-left font-medium text-base md:text-lg">
                    <span className="pr-6">{faq.question}</span>
                    {activeAccordion === faq.id ? 
                      <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-white/70 flex-shrink-0" /> : 
                      <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-white/70 flex-shrink-0" />
                    }
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 md:px-5 pb-3 md:pb-4 text-white/70 text-sm md:text-base">
                    {faq.answer}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </motion.section>
        </Container>

        {/* 8. Final CTA - Updated button text */}
        <Container>
          <motion.section
            className="py-12 md:py-16 lg:py-24 mb-8 md:mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto px-4 md:px-0">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <OptimizedImage
                  src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png"
                  alt="Olivia"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-amber-500/30 mx-auto mb-6 md:mb-8"
                />
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                Ready for next-level outfits, just for you?
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-10">
                Let's make your closet more exciting, more YOU.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  onClick={handleUpgrade} 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:opacity-90 text-black font-semibold shadow-lg shadow-amber-500/20 py-4 md:py-6 px-6 md:px-8 text-base md:text-lg rounded-xl"
                  size="lg"
                >
                  <Crown className="mr-2 h-4 w-4 md:h-5 md:w-5" /> <span className="whitespace-nowrap">Join Olivia Premium ✨</span>
                </Button>
              </motion.div>
            </div>
          </motion.section>
        </Container>
      </div>
    </PageLayout>
  );
};

export default PremiumPage;
