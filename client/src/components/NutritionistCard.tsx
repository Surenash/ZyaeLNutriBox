import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface NutritionistCardProps {
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
  onConsult?: () => void;
}

export default function NutritionistCard({
  name,
  specialization,
  experience,
  rating,
  image,
  onConsult,
}: NutritionistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar className="w-20 h-20">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-nutritionist-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            {specialization}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {experience}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
            <span className="text-sm font-semibold" data-testid="text-rating">
              {rating}
            </span>
          </div>
        </div>
      </div>
      <Button
        className="w-full mt-4 bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2"
        onClick={onConsult}
        data-testid="button-consult"
      >
        Consult Now
      </Button>
    </motion.div>
  );
}
