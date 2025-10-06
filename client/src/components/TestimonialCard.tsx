import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  testimonial: string;
  image: string;
  rating?: number;
}

export default function TestimonialCard({
  name,
  role,
  location,
  testimonial,
  image,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar className="w-16 h-16">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </motion.div>
        <div>
          <h4 className="font-semibold text-foreground" data-testid={`text-customer-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {role}
          </p>
          <p className="text-xs text-muted-foreground">
            {location}
          </p>
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
          >
            <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-foreground/80 italic leading-relaxed">
        "{testimonial}"
      </p>
    </motion.div>
  );
}
