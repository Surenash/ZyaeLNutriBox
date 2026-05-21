import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface Nutritionist {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
  price: string;
  available: boolean;
}

interface NutritionistSliderProps {
  nutritionists: Nutritionist[];
  onNutritionistSelect: (nutritionist: Nutritionist) => void;
}

export default function NutritionistSlider({
  nutritionists,
  onNutritionistSelect,
}: NutritionistSliderProps) {
  const renderNutritionist = ({ item }: { item: Nutritionist }) => (
    <TouchableOpacity
      style={styles.nutritionistCard}
      onPress={() => onNutritionistSelect(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialization}>{item.specialization}</Text>
        <Text style={styles.experience}>{item.experience}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        
        <View style={styles.availabilityContainer}>
          <View style={[
            styles.availabilityDot,
            { backgroundColor: item.available ? '#4CAF50' : '#f44336' }
          ]} />
          <Text style={styles.availabilityText}>
            {item.available ? 'Available' : 'Busy'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Nutritionists</Text>
      <Text style={styles.subtitle}>Expert guidance for your health journey</Text>
      
      <FlatList
        data={nutritionists}
        renderItem={renderNutritionist}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
    marginBottom: 16,
  },
  listContainer: {
    paddingRight: 20,
  },
  nutritionistCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5016',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#666',
  },
});
