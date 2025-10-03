import NutritionistCard from '../NutritionistCard';
import nutritionistImage from '@assets/generated_images/Female_nutritionist_professional_portrait_a8930d89.png';

export default function NutritionistCardExample() {
  return (
    <div className="max-w-md">
      <NutritionistCard
        name="Dr. Priya Sharma"
        specialization="Clinical Nutritionist & Dietitian"
        experience="12 years experience"
        rating={4.9}
        image={nutritionistImage}
        onConsult={() => console.log('Consult clicked')}
      />
    </div>
  );
}
