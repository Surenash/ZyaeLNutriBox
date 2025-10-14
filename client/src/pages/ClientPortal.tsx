import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageTransitionVariants, viewportConfig } from "@/lib/animations";
import HeroBanner from "@/components/HeroBanner";
import DietPlanCard from "@/components/DietPlanCard";
import NutritionistCard from "@/components/NutritionistCard";
import TestimonialCard from "@/components/TestimonialCard";
import MealStatusCard from "@/components/MealStatusCard";
import NutritionProgress from "@/components/NutritionProgress";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";

import heroBanner from "@assets/generated_images/Home-cooked_comfort_food_banner_9590a8d1.png";
import weightLoss from "@assets/generated_images/Healthy_balanced_meal_food_36201b9b.png";
import veganMeal from "@assets/generated_images/Vegan_plant-based_salad_bowl_552c75a9.png";
import proteinMeal from "@assets/generated_images/Protein-rich_fitness_meal_28329687.png";
import pcosMeal from "@assets/generated_images/PCOS-friendly_healthy_meal_1a327607.png";
import nutritionist1 from "@assets/generated_images/Female_nutritionist_professional_portrait_a8930d89.png";
import nutritionist2 from "@assets/generated_images/Male_nutritionist_professional_portrait_5241518d.png";
import customer1 from "@assets/generated_images/Happy_customer_testimonial_photo_4e688e5c.png";
import customer2 from "@assets/generated_images/Business_professional_customer_testimonial_18fae654.png";

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("home");

  //todo: remove mock functionality
  const dietPlans = [
    {
      title: "Weight Loss",
      description: "Balanced meals to help shed fat effectively",
      originalPrice: 17000,
      currentPrice: 15000,
      rating: 4.8,
      reviewCount: 3200,
      badge: "Bestseller",
      image: weightLoss,
    },
    {
      title: "Muscle Gain",
      description: "Protein-rich meals for lean muscle development",
      originalPrice: 18000,
      currentPrice: 15000,
      rating: 4.7,
      reviewCount: 2800,
      badge: "Popular",
      image: proteinMeal,
    },
    {
      title: "PCOS Friendly",
      description: "Low glycemic meals for health management",
      originalPrice: 16500,
      currentPrice: 15000,
      rating: 4.6,
      reviewCount: 2300,
      badge: "Recommended",
      image: pcosMeal,
    },
    {
      title: "Vegan / Vegetarian",
      description: "Plant-based nourishment for every lifestyle",
      originalPrice: 16000,
      currentPrice: 15000,
      rating: 4.5,
      reviewCount: 2100,
      badge: "Healthy Choice",
      image: veganMeal,
    },
  ];

  const nutritionists = [
    {
      name: "Dr. Priya Sharma",
      specialization: "Clinical Nutritionist & Dietitian",
      experience: "12 years experience",
      rating: 4.9,
      image: nutritionist1,
    },
    {
      name: "Dr. Amit Patel",
      specialization: "Sports Nutrition Specialist",
      experience: "10 years experience",
      rating: 4.8,
      image: nutritionist2,
    },
  ];

  const testimonials = [
    {
      name: "Meera",
      role: "Content Writer",
      location: "Bengaluru",
      testimonial:
        "I signed up after seeing their Instagram ad saying 'Meals made with care.' True to that, I got a call from their nutritionist a few days in. She spoke with me about my stress, eating gaps, and even sleep. It felt like therapy through food.",
      image: customer1,
    },
    {
      name: "Nikhil",
      role: "Sales Manager",
      location: "Bengaluru",
      testimonial:
        "I'm always on the move, and I hated planning food. A colleague using Zyael Nutri Box recommended it. I liked that it wasn't just meal delivery—every week I get a short nutrition consultation where they tweak my meals based on my schedule and how I feel.",
      image: customer2,
    },
  ];

  const nutritionData = [
    { label: "Calories", current: 870, target: 1500, unit: " kcal", color: "hsl(var(--chart-1))" },
    { label: "Protein", current: 45, target: 60, unit: "g", color: "hsl(var(--chart-3))" },
    { label: "Carbs", current: 110, target: 200, unit: "g", color: "hsl(var(--chart-2))" },
    { label: "Fats", current: 25, target: 50, unit: "g", color: "hsl(var(--chart-4))" },
  ];

  //todo: remove mock functionality
  const cartItems = [
    {
      id: 1,
      title: "Weight Loss Plan",
      duration: "30 Days Subscription",
      image: weightLoss,
      originalPrice: 17000,
      price: 15000,
      quantity: 1,
    },
    {
      id: 2,
      title: "Muscle Gain Plan",
      duration: "30 Days Subscription",
      image: proteinMeal,
      originalPrice: 18000,
      price: 15000,
      quantity: 1,
    },
  ];

  //todo: remove mock functionality
  const orderHistory = [
    {
      id: "ORD1234",
      date: "November 28, 2025",
      plan: "Weight Loss Plan",
      duration: "30 Days",
      status: "delivered",
      amount: 15000,
      image: weightLoss,
    },
    {
      id: "ORD1233",
      date: "October 30, 2025",
      plan: "PCOS Friendly Plan",
      duration: "30 Days",
      status: "delivered",
      amount: 15000,
      image: pcosMeal,
    },
    {
      id: "ORD1232",
      date: "September 28, 2025",
      plan: "Vegan / Vegetarian Plan",
      duration: "30 Days",
      status: "delivered",
      amount: 15000,
      image: veganMeal,
    },
  ];

  return (
    <motion.div
      {...pageTransitionVariants}
      className="min-h-screen bg-background pb-20"
    >
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div
            key="home"
            {...pageTransitionVariants}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16"
          >
            <HeroBanner
            title="Home-Cooked Goodness, Inspired by Mom"
            subtitle="Every meal is thoughtfully crafted by expert nutritionists, inspired by the warmth of a mother's kitchen"
            ctaText="Start Today →"
            backgroundImage={heroBanner}
            onCtaClick={() => console.log("Start today clicked")}
          />

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              >
                Choose Your Health Goal
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Expertly crafted meal plans designed to help you achieve your wellness goals
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dietPlans.map((plan) => (
                <DietPlanCard
                  key={plan.title}
                  {...plan}
                  onSubscribe={() => console.log(`Subscribe to ${plan.title}`)}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              >
                Meet Our Expert Nutritionists
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Certified professionals dedicated to your health journey
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nutritionists.map((nutritionist) => (
                <NutritionistCard
                  key={nutritionist.name}
                  {...nutritionist}
                  onConsult={() => console.log(`Consult ${nutritionist.name}`)}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              >
                Success Stories
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Real transformations from real people
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} {...testimonial} />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-12 md:p-16 text-center border border-primary/10"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              Join thousands of satisfied customers who have transformed their health with ZyaeL NutriBox. Start your personalized nutrition journey today!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportConfig}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2"
                data-testid="button-subscribe-now"
              >
                Get Started Now →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground mt-6"
            >
              No commitment required • Cancel anytime
            </motion.p>
          </motion.section>
        </motion.div>
        )}

        {activeTab === "cart" && (
          <motion.div
            key="cart"
            {...pageTransitionVariants}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-foreground mb-8"
            >
              Your Cart
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {/* Cart Items */}
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 hover-elevate"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.duration}</p>
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-3 border rounded-lg p-1">
                            <button className="px-3 py-1 hover:bg-muted rounded" data-testid={`button-decrease-${item.id}`}>−</button>
                            <span className="px-3 font-semibold" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                            <button className="px-3 py-1 hover:bg-muted rounded" data-testid={`button-increase-${item.id}`}>+</button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</p>
                            <p className="text-xl font-bold text-primary">₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Price Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Charges</span>
                      <span className="font-semibold text-success">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-semibold text-success">−₹{cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground rounded-full hover-elevate active-elevate-2"
                    size="lg"
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    100% Secure Payment
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            key="orders"
            {...pageTransitionVariants}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-foreground mb-8"
            >
              My Orders
            </motion.h1>

            <div className="space-y-4">
              {orderHistory.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 hover-elevate"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-success/10 text-success' :
                      order.status === 'in-transit' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`} data-testid={`badge-status-${order.id}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={order.image} alt={order.plan} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{order.plan}</p>
                        <p className="text-sm text-muted-foreground">{order.duration}</p>
                      </div>
                      <p className="text-xl font-bold text-primary">₹{order.amount}</p>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" size="sm" className="rounded-full" data-testid={`button-track-${order.id}`}>
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full" data-testid={`button-details-${order.id}`}>
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="rounded-full ml-auto" data-testid={`button-reorder-${order.id}`}>
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div
            key="profile"
            {...pageTransitionVariants}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-foreground mb-8"
            >
              My Profile
            </motion.h1>

            <div className="space-y-6">
              {/* Profile Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">JD</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">John Doe</h3>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full" data-testid="button-edit-profile">
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="font-medium">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </motion.div>

              {/* Dietary Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Gluten-free', 'Low Carb', 'High Protein'].map((pref) => (
                    <span key={pref} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium" data-testid={`badge-preference-${pref.toLowerCase().replace(' ', '-')}`}>
                      {pref}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Subscription Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Active Subscription</h3>
                    <p className="text-sm text-muted-foreground mt-1">Weight Loss Plan - Monthly</p>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Next Renewal</p>
                    <p className="font-semibold">December 15, 2025</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full" data-testid="button-manage-subscription">
                    Manage Plan
                  </Button>
                </div>
              </motion.div>

              {/* Settings Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Settings</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors" data-testid="button-payment-methods">
                    <span className="font-medium">Payment Methods</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors" data-testid="button-delivery-address">
                    <span className="font-medium">Delivery Address</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors" data-testid="button-notifications">
                    <span className="font-medium">Notifications</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors text-destructive" data-testid="button-logout">
                    <span className="font-medium">Logout</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === "track" && (
          <motion.div
            key="track"
            {...pageTransitionVariants}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-foreground mb-3"
              >
                Today's Food Journey
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground"
              >
                Track your daily meals and nutrition progress
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Today's Meals</h2>
                  <div className="space-y-3">
                    <MealStatusCard
                      mealType="Breakfast"
                      status="delivered"
                      time="8:00 AM"
                      onViewDetails={() => console.log("View breakfast details")}
                    />
                    <MealStatusCard
                      mealType="Lunch"
                      status="delivered"
                      time="1:00 PM"
                      onViewDetails={() => console.log("View lunch details")}
                    />
                    <MealStatusCard
                      mealType="Dinner"
                      status="in-transit"
                      time="Expected 7:00 PM"
                      onViewDetails={() => console.log("View dinner details")}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-success/10 to-transparent rounded-xl p-6 border border-success/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Great Progress!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You're making excellent progress! Keep up the consistent meal completion to reach your goals faster. You've consumed 67% of your daily nutrition target.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-4 space-y-4">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Daily Nutrition</h2>
                    <NutritionProgress items={nutritionData} />
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Weekly Streak</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">7</span>
                      <span className="text-sm text-muted-foreground">days<br/>in a row!</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div key={day} className="flex-1 h-2 bg-primary rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </motion.div>
  );
}
