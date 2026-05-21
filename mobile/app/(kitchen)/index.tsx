import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../src/hooks/useAuth';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';

interface KitchenOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  mealType: string;
  dietPlan: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  createdAt: string;
  specialInstructions?: string;
}

export default function KitchenDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');

  // Fetch kitchen orders
  const { data: orders = [], isLoading } = useQuery<KitchenOrder[]>({
    queryKey: ['kitchen-orders', selectedFilter],
    queryFn: async () => {
      // Mock data - replace with actual API
      return [
        {
          id: '1',
          orderNumber: 'ORD-001',
          clientName: 'John Doe',
          clientPhone: '+91 98765 43210',
          mealType: 'Lunch',
          dietPlan: 'Weight Loss',
          quantity: 2,
          status: 'pending',
          priority: 'high',
          estimatedTime: 30,
          createdAt: '2024-01-15T10:30:00Z',
          specialInstructions: 'No onions, extra vegetables',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          clientName: 'Jane Smith',
          clientPhone: '+91 98765 43211',
          mealType: 'Dinner',
          dietPlan: 'Muscle Gain',
          quantity: 1,
          status: 'preparing',
          priority: 'medium',
          estimatedTime: 25,
          createdAt: '2024-01-15T11:00:00Z',
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          clientName: 'Mike Johnson',
          clientPhone: '+91 98765 43212',
          mealType: 'Breakfast',
          dietPlan: 'Diabetic Friendly',
          quantity: 1,
          status: 'ready',
          priority: 'low',
          estimatedTime: 15,
          createdAt: '2024-01-15T11:15:00Z',
        },
      ];
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      // Mock API call - replace with actual API
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to update order status');
    },
  });

  const filteredOrders = orders.filter(order => 
    selectedFilter === 'all' || order.status === selectedFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'preparing': return '#2196F3';
      case 'ready': return '#4CAF50';
      case 'completed': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change order status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => updateStatusMutation.mutate({ orderId, status: newStatus }) },
      ]
    );
  };

  const renderOrder = ({ item }: { item: KitchenOrder }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.clientPhone}>{item.clientPhone}</Text>
        </View>
        <View style={styles.orderMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Meal Type:</Text>
          <Text style={styles.detailValue}>{item.mealType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Diet Plan:</Text>
          <Text style={styles.detailValue}>{item.dietPlan}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{item.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Est. Time:</Text>
          <Text style={styles.detailValue}>{item.estimatedTime} min</Text>
        </View>
      </View>

      {item.specialInstructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsLabel}>Special Instructions:</Text>
          <Text style={styles.instructionsText}>{item.specialInstructions}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <Button
            title="Start Preparing"
            onPress={() => handleStatusUpdate(item.id, 'preparing')}
            size="small"
            variant="primary"
          />
        )}
        {item.status === 'preparing' && (
          <Button
            title="Mark Ready"
            onPress={() => handleStatusUpdate(item.id, 'ready')}
            size="small"
            variant="primary"
          />
        )}
        {item.status === 'ready' && (
          <Button
            title="Mark Completed"
            onPress={() => handleStatusUpdate(item.id, 'completed')}
            size="small"
            variant="secondary"
          />
        )}
        <Button
          title="View Details"
          onPress={() => console.log('View order details:', item.id)}
          size="small"
          variant="outline"
        />
      </View>
    </Card>
  );

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    total: orders.length,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.preparing}</Text>
          <Text style={styles.statLabel}>Preparing</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.ready}</Text>
          <Text style={styles.statLabel}>Ready</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Card>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(['all', 'pending', 'preparing', 'ready'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <View style={styles.ordersContainer}>
        <Text style={styles.sectionTitle}>
          Orders ({filteredOrders.length})
        </Text>
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#2d5016',
    borderColor: '#2d5016',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  ordersContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 16,
  },
  orderCard: {
    marginBottom: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 12,
    color: '#666',
  },
  orderMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  instructionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 12,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});