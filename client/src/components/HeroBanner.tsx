import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
  backgroundImage: string;
}

export default function HeroBanner({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  backgroundImage,
}: HeroBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-[500px] rounded-2xl overflow-hidden"
    >
      <motion.img
        src={backgroundImage}
        alt="Hero banner"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-white/90 mb-8"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground rounded-full px-8 hover-elevate active-elevate-2"
            onClick={onCtaClick}
            data-testid="button-hero-cta"
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
