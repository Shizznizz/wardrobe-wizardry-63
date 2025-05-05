
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedImage from '@/components/ui/optimized-image';

// Product data
const products = [
  {
    id: 1,
    name: "Beige Off-Shoulder Crop Top",
    description: "Soft knitted fabric with balloon sleeves",
    image: "/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png",
    itemImage: "/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png",
    price: "€60,00",
    url: "https://chatgpt.com/?hints=search&q=Off-shoulder+gebreide+crop+top+voor+dames+-+Gem%C3%ABleerd+beige+-+L+-+Mani%C3%A8re+De+Voir",
    brand: "Manière De Voir"
  },
  {
    id: 2,
    name: "Ivory High-Waisted Trousers",
    description: "Tailored fit with pleated front detail",
    image: "/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png",
    itemImage: "/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png",
    price: "€35,95",
    url: "https://chatgpt.com/?hints=search&q=Ivory+Trousers+Wit+%2F+S",
    brand: "Monyé Essentials"
  },
  {
    id: 3,
    name: "Tan Envelope Clutch",
    description: "Faux leather with gold-tone hardware",
    image: "/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png",
    itemImage: "/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png",
    price: "€44,70",
    url: "https://chatgpt.com/?hints=search&q=Dames+Clutches+Envelope+Pochette+Ceremonie+Huwelijk+Schoudertassen+in+Su%C3%A8de+...",
    brand: "bol.com"
  },
  {
    id: 4,
    name: "Round Tortoiseshell Sunglasses",
    description: "UV protection with metal frame",
    image: "/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png",
    itemImage: "/lovable-uploads/22f42482-be2b-4588-a88f-47730da3a352.png",
    price: "€26,00",
    url: "https://chatgpt.com/?hints=search&q=Next+Round+Zonnebril%2C+Heren%2C+Maat%3A+One+Size%2C+Tortoiseshell+Brown",
    brand: "Zalando.nl"
  }
];

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const GetOliviasLook: React.FC = () => {
  const navigate = useNavigate();
  
  const handleExploreMore = () => {
    navigate('/shop-and-try');
  };
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-purple-50/5 to-pink-50/5 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
          {/* Left Column - Product Information */}
          <div className="w-full md:w-3/5 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center md:text-left"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500 mb-3">
                Get Olivia's Look
              </h2>
              <p className="text-lg md:text-xl text-white/80">
                Shop her favourite outfit of the week
              </p>
            </motion.div>
            
            {/* Product Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4 md:gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Button */}
            <motion.div 
              className="flex justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button 
                onClick={handleExploreMore}
                className="bg-gradient-to-r from-[#ff4ecb] to-[#a97eff] text-white hover:scale-[1.03] transition-transform font-bold py-6 px-10 rounded-xl shadow-md h-auto text-lg flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Explore More Looks
              </Button>
            </motion.div>
          </div>
          
          {/* Right Column - Olivia's Image */}
          <motion.div 
            className="w-full md:w-2/5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <OptimizedImage 
                  src="/lovable-uploads/db51966b-4679-4d51-81f2-8844a7a57817.png"
                  alt="Olivia wearing a beige off-shoulder crop top and ivory high-waisted trousers"
                  className="w-full h-auto object-cover rounded-2xl"
                  aspectRatio="aspect-[3/4]"
                  priority={true}
                  containerClassName="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
interface ProductProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    itemImage: string;
    price: string;
    url: string;
    brand: string;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const handleBuyNow = () => {
    window.open(product.url, '_blank');
  };
  
  return (
    <Card className="bg-white/5 border-white/10 hover:border-purple-500/30 backdrop-blur-sm overflow-hidden h-full">
      <div className="aspect-square w-full overflow-hidden">
        <OptimizedImage 
          src={product.itemImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          aspectRatio="aspect-square"
        />
      </div>
      <CardContent className="p-3 md:p-4">
        <h3 className="font-medium text-sm md:text-base text-white line-clamp-1">{product.name}</h3>
        <p className="text-xs md:text-sm text-white/60 line-clamp-1 mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm font-medium text-purple-300">{product.price}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBuyNow}
            className="text-xs md:text-sm text-purple-300 hover:text-purple-200 p-1 h-auto flex items-center gap-1"
          >
            Buy Now
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GetOliviasLook;
