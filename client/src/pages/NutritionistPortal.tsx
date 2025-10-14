import { Calendar, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import { useRealtime } from "@/hooks/use-realtime";
import ClientProgressCard from "@/components/ClientProgressCard";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";

import clientImage1 from "@assets/generated_images/Business_professional_customer_testimonial_18fae654.png";
import clientImage2 from "@assets/generated_images/Happy_customer_testimonial_photo_4e688e5c.png";

export default function NutritionistPortal() {
  // Real-time updates for clients, sessions, and progress logs
  useRealtime({
    events: ["client_created", "client_updated", "session_created", "session_updated", "progress_log_created"],
    invalidateQueries: [["/api/clients"], ["/api/sessions"], ["/api/progress-logs"]],
    showToast: true,
  });

  // Fetch clients from API
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch sessions from API
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/sessions"],
  });

  // Image mapping for clients
  const clientImages = [clientImage1, clientImage2, clientImage1, clientImage2];

  // Prepare clients with formatted data
  const clients = (Array.isArray(clientsData) ? clientsData : []).map((client: any, index: number) => {
    // Find upcoming session for this client
    const upcomingSession = Array.isArray(sessionsData) 
      ? sessionsData.find((s: any) => s.clientId === client.id && s.status === "scheduled")
      : null;

    return {
      id: client.id,
      clientName: `Client ${index + 1}`,
      clientImage: clientImages[index % clientImages.length],
      nextSession: upcomingSession 
        ? new Date(upcomingSession.sessionDate).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit' 
          })
        : "Not scheduled",
      mealCompletion: 90,
      avgCalories: { current: 1450, target: 1500 },
      proteinIntake: 80,
      waterIntake: { current: 2.5, target: 3 },
      weightProgress: { start: client.weightStart, current: client.weightCurrent },
    };
  });

  // Prepare upcoming sessions from API data
  const upcomingSessions = (Array.isArray(sessionsData) ? sessionsData : [])
    .filter((session: any) => session.status === "scheduled")
    .sort((a: any, b: any) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
    .slice(0, 5)
    .map((session: any) => {
      const sessionDate = new Date(session.sessionDate);
      const today = new Date();
      const isToday = sessionDate.toDateString() === today.toDateString();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = sessionDate.toDateString() === tomorrow.toDateString();
      
      return {
        clientName: `Client Session`,
        description: "Progress Review",
        day: isToday ? "Today" : isTomorrow ? "Tomorrow" : sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
    });

  // Stats
  const activeClientsCount = (Array.isArray(clientsData) ? clientsData : []).length;
  const sessionsToday = (Array.isArray(sessionsData) ? sessionsData : [])
    .filter((session: any) => {
      const sessionDate = new Date(session.sessionDate);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    }).length;

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
            value={clientsLoading ? "..." : String(activeClientsCount)}
            subtitle="Total clients"
            icon={Users}
          />
          <StatsCard
            title="Sessions Today"
            value={sessionsLoading ? "..." : String(sessionsToday)}
            subtitle="Scheduled sessions"
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
          {sessionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : upcomingSessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No upcoming sessions scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{session.clientName}</p>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${session.day === 'Today' ? 'text-primary' : 'text-foreground'}`}>
                      {session.day}
                    </p>
                    <p className="text-sm text-muted-foreground">{session.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
}
