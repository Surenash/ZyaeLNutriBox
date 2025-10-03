import StatsCard from '../StatsCard';
import { Users } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="max-w-xs">
      <StatsCard
        title="Total Users"
        value="3,247"
        subtitle="Active subscriptions"
        icon={Users}
        trend={{ value: '+12.5%', isPositive: true }}
      />
    </div>
  );
}
