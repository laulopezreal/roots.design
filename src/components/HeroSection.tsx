import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  title = "Timeless Lighting",
  subtitle = "Elevate your space with our curated collection of handcrafted lighting fixtures",
  ctaText = "Explore Collections",
  imageUrl = "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1512&q=80",
  onCtaClick = () => {},
}: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[800px] bg-white overflow-hidden">
      {/* Background image with parallax effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">{subtitle}</p>
          <Button
            onClick={onCtaClick}
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;