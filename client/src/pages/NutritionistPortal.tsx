import { Calendar, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import ClientProgressCard from "@/components/ClientProgressCard";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";

import clientImage1 from "@assets/generated_images/Business_professional_customer_testimonial_18fae654.png";
import clientImage2 from "@assets/generated_images/Happy_customer_testimonial_photo_4e688e5c.png";

export default function NutritionistPortal() {
  //todo: remove mock functionality
  const clients = [
    {
      clientName: "Rohan Sharma",
      clientImage: clientImage1,
      nextSession: "Dec 15, 3:00 PM",
      mealCompletion: 92,
      avgCalories: { current: 1480, target: 1500 },
      proteinIntake: 85,
      waterIntake: { current: 2.5, target: 3 },
      weightProgress: { start: 85, current: 82 },
    },
    {
      clientName: "Priya Menon",
      clientImage: clientImage2,
      nextSession: "Dec 16, 10:00 AM",
      mealCompletion: 88,
      avgCalories: { current: 1350, target: 1400 },
      proteinIntake: 78,
      waterIntake: { current: 2.2, target: 3 },
      weightProgress: { start: 72, current: 68 },
    },
  ];

  return (
    <motion.div
      {...pageTransitionVariants}
      className="min-h-screen bg-background"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-primary text-primary-foreground py-8 mb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Nutritionist Dashboard</h1>
          <p className="text-primary-foreground/80">
            Manage your clients and track their progress
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <StatsCard
            title="Active Clients"
            value="24"
            subtitle="This month"
            icon={Users}
            trend={{ value: "+3", isPositive: true }}
          />
          <StatsCard
            title="Sessions Today"
            value="6"
            subtitle="2 pending"
            icon={Calendar}
          />
          <StatsCard
            title="Avg Response Time"
            value="2.5h"
            subtitle="Last 7 days"
            icon={Clock}
            trend={{ value: "-0.5h", isPositive: true }}
          />
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Active Clients</h2>
            <Button variant="outline" className="rounded-full" data-testid="button-view-all">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientProgressCard
                key={client.clientName}
                {...client}
                onViewDetails={() =>
                  console.log(`View details for ${client.clientName}`)
                }
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Rohan Sharma</p>
                <p className="text-sm text-muted-foreground">
                  Progress Review & Diet Adjustment
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">Today</p>
                <p className="text-sm text-muted-foreground">3:00 PM</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Priya Menon</p>
                <p className="text-sm text-muted-foreground">
                  Weekly Check-in
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">Tomorrow</p>
                <p className="text-sm text-muted-foreground">10:00 AM</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
