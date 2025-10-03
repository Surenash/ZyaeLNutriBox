import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
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
          <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
        ))}
      </div>
      <p className="text-sm text-foreground/80 italic leading-relaxed">
        "{testimonial}"
      </p>
    </div>
  );
}
