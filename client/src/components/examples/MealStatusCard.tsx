import MealStatusCard from '../MealStatusCard';

export default function MealStatusCardExample() {
  return (
    <div className="max-w-md space-y-3">
      <MealStatusCard
        mealType="Breakfast"
        status="delivered"
        time="8:00 AM"
        onViewDetails={() => console.log('View breakfast details')}
      />
      <MealStatusCard
        mealType="Lunch"
        status="delivered"
        time="1:00 PM"
        onViewDetails={() => console.log('View lunch details')}
      />
      <MealStatusCard
        mealType="Dinner"
        status="in-transit"
        time="Expected 7:00 PM"
        onViewDetails={() => console.log('View dinner details')}
      />
    </div>
  );
}
