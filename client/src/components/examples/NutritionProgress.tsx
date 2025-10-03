import NutritionProgress from '../NutritionProgress';

export default function NutritionProgressExample() {
  const nutritionData = [
    { label: 'Calories', current: 870, target: 1500, unit: ' kcal', color: 'hsl(var(--chart-1))' },
    { label: 'Protein', current: 45, target: 60, unit: 'g', color: 'hsl(var(--chart-3))' },
    { label: 'Carbs', current: 110, target: 200, unit: 'g', color: 'hsl(var(--chart-2))' },
    { label: 'Fats', current: 25, target: 50, unit: 'g', color: 'hsl(var(--chart-4))' },
  ];

  return (
    <div className="max-w-md">
      <NutritionProgress items={nutritionData} />
    </div>
  );
}
