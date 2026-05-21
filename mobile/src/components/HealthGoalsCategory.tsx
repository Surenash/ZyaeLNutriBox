import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface HealthGoal {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface HealthGoalsCategoryProps {
  goals: HealthGoal[];
  selectedGoal?: number;
  onGoalSelect: (goal: HealthGoal) => void;
}

export default function HealthGoalsCategory({
  goals,
  selectedGoal,
  onGoalSelect,
}: HealthGoalsCategoryProps) {
  const renderGoal = ({ item }: { item: HealthGoal }) => (
    <TouchableOpacity
      style={[
        styles.goalCard,
        { backgroundColor: item.color },
        selectedGoal === item.id && styles.selectedGoal,
      ]}
      onPress={() => onGoalSelect(item)}
    >
      <Text style={styles.goalIcon}>{item.icon}</Text>
      <Text style={styles.goalName}>{item.name}</Text>
      <Text style={styles.goalDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Health Goal</Text>
      <Text style={styles.subtitle}>Select what you want to achieve</Text>
      
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  goalCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  selectedGoal: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
});
