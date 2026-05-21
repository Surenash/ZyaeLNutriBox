import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import HeroSlider from '../../src/components/HeroSlider';
import HealthGoalsCategory from '../../src/components/HealthGoalsCategory';
import NutritionistSlider from '../../src/components/NutritionistSlider';
import TestimonialCard from '../../src/components/TestimonialCard';
import NutritionProgress from '../../src/components/NutritionProgress';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';

// Mock data for quick demo
const categories = [
  { id: 1, name: 'Weight Loss', icon: '🥗', color: '#4CAF50', description: 'Lose weight safely' },
  { id: 2, name: 'Muscle Gain', icon: '💪', color: '#FF9800', description: 'Build muscle mass' },
  { id: 3, name: 'Balanced', icon: '❤️', color: '#E91E63', description: 'Maintain health' },
  { id: 4, name: 'Diabetic', icon: '🍛', color: '#9C27B0', description: 'Manage diabetes' },
];

const mealPlans = [
  { id: 1, name: 'Weight Loss Plan', price: '₹2,999', image: '🥗', description: '30-day weight loss program' },
  { id: 2, name: 'Muscle Gain Plan', price: '₹3,499', image: '💪', description: 'High protein muscle building' },
  { id: 3, name: 'Balanced Nutrition', price: '₹2,499', image: '❤️', description: 'Complete balanced meals' },
];

const heroSlides = [
  {
    id: 1,
    title: 'Healthy Meals Delivered',
    subtitle: 'Fresh, nutritious meals made just for you',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    ctaText: 'Order Now',
    onPress: () => console.log('Order Now'),
  },
  {
    id: 2,
    title: 'Expert Nutritionists',
    subtitle: 'Get personalized advice from certified experts',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    ctaText: 'Consult Now',
    onPress: () => console.log('Consult Now'),
  },
];

const nutritionists = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialization: 'Weight Management',
    experience: '8 years experience',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
    price: '₹500/session',
    available: true,
  },
  {
    id: 2,
    name: 'Rahul Menon',
    specialization: 'Sports Nutrition',
    experience: '6 years experience',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200',
    price: '₹600/session',
    available: false,
  },
];

const testimonials = [
  {
    name: 'Meera, 28',
    role: 'Content Writer',
    location: 'Bengaluru',
    testimonial: 'I signed up after seeing their Instagram ad. True to that, I got a call from their nutritionist. She spoke with me about my stress, eating gaps, and even sleep. It felt like therapy through food.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
    rating: 5,
  },
  {
    name: 'Rajesh, 35',
    role: 'Software Engineer',
    location: 'Mumbai',
    testimonial: 'The meal plans are perfectly balanced and the delivery is always on time. My energy levels have improved significantly since I started.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState(1);

  const handleGoalSelect = (goal: any) => {
    console.log('Selected goal:', goal);
  };

  const handleNutritionistSelect = (nutritionist: any) => {
    console.log('Selected nutritionist:', nutritionist);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subtitle}>What would you like to eat today?</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchPlaceholder}>🔍 Search meals, plans, or experts...</Text>
      </View>

      {/* Health Goals */}
      <HealthGoalsCategory
        goals={categories}
        selectedGoal={selectedCategory}
        onGoalSelect={handleGoalSelect}
      />

      {/* Featured Plans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Meal Plans</Text>
        <FlatList
          data={mealPlans}
          horizontal
          showsHorizontalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <Card style={styles.planCard} delay={index * 100}>
                      <Text style={styles.planIcon}>{item.image}</Text>
                      <Text style={styles.planName}>{item.name}</Text>
                      <Text style={styles.planDescription}>{item.description}</Text>
                      <Text style={styles.planPrice}>{item.price}</Text>
                      <Button
                        title="View Plan"
                        onPress={() => console.log('View Plan:', item)}
                        size="small"
                        delay={index * 100 + 200}
                      />
                    </Card>
                  )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Nutrition Progress */}
      <View style={styles.section}>
        <NutritionProgress
          calories={1200}
          protein={80}
          carbs={150}
          fat={45}
          targetCalories={1500}
          targetProtein={100}
          targetCarbs={200}
          targetFat={60}
        />
      </View>

      {/* Nutritionists */}
      <NutritionistSlider
        nutritionists={nutritionists}
        onNutritionistSelect={handleNutritionistSelect}
      />

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Customers Say</Text>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <Card style={styles.actionCard} delay={0}>
                    <Text style={styles.actionIcon}>📞</Text>
                    <Text style={styles.actionText}>Talk to Nutritionist</Text>
                    <Button
                      title="Book Now"
                      onPress={() => console.log('Book nutritionist')}
                      size="small"
                      variant="outline"
                      delay={100}
                    />
                  </Card>
                  <Card style={styles.actionCard} delay={100}>
                    <Text style={styles.actionIcon}>📊</Text>
                    <Text style={styles.actionText}>Track Progress</Text>
                    <Button
                      title="View Stats"
                      onPress={() => console.log('View progress')}
                      size="small"
                      variant="outline"
                      delay={200}
                    />
                  </Card>
                </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 16,
    marginLeft: 20,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  planCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 12,
  },
  planButton: {
    backgroundColor: '#2d5016',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5016',
    textAlign: 'center',
  },
});
