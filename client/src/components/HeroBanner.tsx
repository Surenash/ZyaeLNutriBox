import { Button } from "@/components/ui/button";

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
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
      <img
        src={backgroundImage}
        alt="Hero banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          {subtitle}
        </p>
        <div>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground rounded-full px-8 hover-elevate active-elevate-2"
            onClick={onCtaClick}
            data-testid="button-hero-cta"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}
