import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../src/hooks/useAuth';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  nutritionists: number;
  deliveryAgents: number;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'order_created' | 'payment_received' | 'system_update';
  description: string;
  timestamp: string;
  user?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'orders' | 'analytics'>('overview');

  // Fetch admin stats
  const { data: stats = {
    totalUsers: 1250,
    activeUsers: 890,
    totalOrders: 3450,
    totalRevenue: 125000,
    pendingOrders: 45,
    completedOrders: 3200,
    nutritionists: 25,
    deliveryAgents: 15,
  } } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Mock data - replace with actual API
      return {
        totalUsers: 1250,
        activeUsers: 890,
        totalOrders: 3450,
        totalRevenue: 125000,
        pendingOrders: 45,
        completedOrders: 3200,
        nutritionists: 25,
        deliveryAgents: 15,
      };
    },
  });

  // Fetch system alerts
  const { data: alerts = [] } = useQuery<SystemAlert[]>({
    queryKey: ['system-alerts'],
    queryFn: async () => {
      // Mock data - replace with actual API
      return [
        {
          id: '1',
          type: 'warning',
          title: 'High Server Load',
          message: 'Server CPU usage is above 80%',
          timestamp: '2024-01-15T10:30:00Z',
          resolved: false,
        },
        {
          id: '2',
          type: 'info',
          title: 'New User Registration',
          message: '50 new users registered today',
          timestamp: '2024-01-15T09:15:00Z',
          resolved: true,
        },
        {
          id: '3',
          type: 'error',
          title: 'Payment Gateway Issue',
          message: 'Razorpay integration experiencing delays',
          timestamp: '2024-01-15T08:45:00Z',
          resolved: false,
        },
      ];
    },
  });

  // Fetch recent activity
  const { data: recentActivity = [] } = useQuery<RecentActivity[]>({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Mock data - replace with actual API
      return [
        {
          id: '1',
          type: 'user_registration',
          description: 'New user registered: John Doe',
          timestamp: '2024-01-15T11:30:00Z',
          user: 'John Doe',
        },
        {
          id: '2',
          type: 'order_created',
          description: 'New order created: ORD-001',
          timestamp: '2024-01-15T11:15:00Z',
        },
        {
          id: '3',
          type: 'payment_received',
          description: 'Payment received: ₹2,999',
          timestamp: '2024-01-15T11:00:00Z',
        },
        {
          id: '4',
          type: 'system_update',
          description: 'System maintenance completed',
          timestamp: '2024-01-15T10:45:00Z',
        },
      ];
    },
  });

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      case 'info': return '#2196F3';
      case 'success': return '#4CAF50';
      default: return '#666';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return '👤';
      case 'order_created': return '📦';
      case 'payment_received': return '💰';
      case 'system_update': return '🔧';
      default: return '📋';
    }
  };

  const renderAlert = ({ item }: { item: SystemAlert }) => (
    <Card style={[styles.alertCard, { borderLeftColor: getAlertColor(item.type) }]}>
      <View style={styles.alertHeader}>
        <Text style={[styles.alertType, { color: getAlertColor(item.type) }]}>
          {item.type.toUpperCase()}
        </Text>
        <Text style={styles.alertTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertMessage}>{item.message}</Text>
      {!item.resolved && (
        <Button
          title="Resolve"
          onPress={() => console.log('Resolve alert:', item.id)}
          size="small"
          variant="primary"
        />
      )}
    </Card>
  );

  const renderActivity = ({ item }: { item: RecentActivity }) => (
    <Card style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityIcon}>{getActivityIcon(item.type)}</Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, {user?.name}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalOrders.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>₹{stats.totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </Card>
      </View>

      {/* Secondary Stats */}
      <View style={styles.secondaryStatsContainer}>
        <Card style={styles.secondaryStatCard}>
          <Text style={styles.secondaryStatNumber}>{stats.pendingOrders}</Text>
          <Text style={styles.secondaryStatLabel}>Pending Orders</Text>
        </Card>
        <Card style={styles.secondaryStatCard}>
          <Text style={styles.secondaryStatNumber}>{stats.completedOrders}</Text>
          <Text style={styles.secondaryStatLabel}>Completed</Text>
        </Card>
        <Card style={styles.secondaryStatCard}>
          <Text style={styles.secondaryStatNumber}>{stats.nutritionists}</Text>
          <Text style={styles.secondaryStatLabel}>Nutritionists</Text>
        </Card>
        <Card style={styles.secondaryStatCard}>
          <Text style={styles.secondaryStatNumber}>{stats.deliveryAgents}</Text>
          <Text style={styles.secondaryStatLabel}>Delivery Agents</Text>
        </Card>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['overview', 'users', 'orders', 'analytics'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                selectedTab === tab && styles.tabButtonTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === 'overview' && (
          <View>
            <Text style={styles.sectionTitle}>System Alerts</Text>
            <FlatList
              data={alerts.filter(alert => !alert.resolved)}
              renderItem={renderAlert}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />

            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <FlatList
              data={recentActivity.slice(0, 5)}
              renderItem={renderActivity}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <Button
                  title="Manage Users"
                  onPress={() => console.log('Manage users')}
                  variant="primary"
                />
                <Button
                  title="View Orders"
                  onPress={() => console.log('View orders')}
                  variant="outline"
                />
                <Button
                  title="System Settings"
                  onPress={() => console.log('System settings')}
                  variant="outline"
                />
                <Button
                  title="Generate Report"
                  onPress={() => console.log('Generate report')}
                  variant="outline"
                />
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'users' && (
          <View>
            <Text style={styles.sectionTitle}>User Management</Text>
            <Card style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>User management interface will be implemented here</Text>
            </Card>
          </View>
        )}

        {selectedTab === 'orders' && (
          <View>
            <Text style={styles.sectionTitle}>Order Management</Text>
            <Card style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>Order management interface will be implemented here</Text>
            </Card>
          </View>
        )}

        {selectedTab === 'analytics' && (
          <View>
            <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
            <Card style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>Analytics dashboard will be implemented here</Text>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2d5016',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e8',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  secondaryStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  secondaryStatCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  secondaryStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 2,
  },
  secondaryStatLabel: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabButtonActive: {
    backgroundColor: '#2d5016',
    borderColor: '#2d5016',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 16,
  },
  alertCard: {
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#666',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  activityCard: {
    marginBottom: 12,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    marginTop: 24,
  },
  actionsGrid: {
    gap: 12,
  },
  placeholderCard: {
    padding: 32,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});