import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Mail, 
  Lock, 
  Phone,
  Dumbbell,
  Target,
  Heart,
  Scale,
  Activity,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  // Step 1: Account
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  
  // Step 2: Physical
  gender: z.string().min(1, "Please select your gender"),
  age: z.coerce.number().min(12).max(120),
  height: z.coerce.number().min(50).max(300),
  weight: z.coerce.number().min(20).max(500),
  goalWeight: z.coerce.number().min(20).max(500),
  
  // Step 3: Lifestyle
  primaryGoal: z.string().min(1, "Please select a primary goal"),
  dietaryPreference: z.string().min(1, "Please select your diet"),
  healthConditions: z.string().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { registerMutation } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      phone: "",
      gender: "",
      age: 25,
      height: 170,
      weight: 70,
      goalWeight: 65,
      primaryGoal: "",
      dietaryPreference: "non-veg",
      healthConditions: "",
    },
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1: return ["name", "email", "username", "password", "phone"];
      case 2: return ["gender", "age", "height", "weight", "goalWeight"];
      case 3: return ["primaryGoal", "dietaryPreference"];
      default: return [];
    }
  };

  const onSubmit = (values: SignupValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        setLocation("/management/client");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="bg-[#006442] w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="text-white h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
          <p className="text-slate-500 font-medium mt-2">Step {step} of 4: {getStepTitle(step)}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="bg-[#006442] h-full"
            initial={{ width: "25%" }}
            animate={{ width: `${step * 25}%` }}
          />
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-md">
          <CardContent className="p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input placeholder="John Doe" className="pl-12 h-14 rounded-2xl bg-white border-slate-200 focus:border-[#006442]" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                  <Input placeholder="john@example.com" className="pl-12 h-14 rounded-2xl bg-white border-slate-200" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                  <Input placeholder="+91 XXXXX XXXXX" className="pl-12 h-14 rounded-2xl bg-white border-slate-200" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Username</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe" className="h-14 rounded-2xl bg-white border-slate-200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                  <Input type="password" placeholder="••••••••" className="pl-12 h-14 rounded-2xl bg-white border-slate-200" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-200">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Age</FormLabel>
                              <FormControl>
                                <Input type="number" className="h-14 rounded-2xl bg-white border-slate-200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Height (cm)</FormLabel>
                              <FormControl>
                                <Input type="number" className="h-14 rounded-2xl bg-white border-slate-200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Weight (kg)</FormLabel>
                              <FormControl>
                                <Input type="number" className="h-14 rounded-2xl bg-white border-slate-200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="goalWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Goal (kg)</FormLabel>
                              <FormControl>
                                <Input type="number" className="h-14 rounded-2xl bg-white border-slate-200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="primaryGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Primary Health Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-200">
                                  <SelectValue placeholder="What are you aiming for?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                <SelectItem value="pcos">PCOS Management</SelectItem>
                                <SelectItem value="diabetic">Diabetes Management</SelectItem>
                                <SelectItem value="general">Healthy Lifestyle</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dietaryPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Dietary Preference</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-200">
                                  <SelectValue placeholder="Select your diet" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="veg">Vegetarian</SelectItem>
                                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                                <SelectItem value="egg">Eggitarian</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="healthConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#006442] font-bold uppercase tracking-widest text-[10px]">Existing Health Conditions (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Thyroid, Lactose Intolerance..." className="h-14 rounded-2xl bg-white border-slate-200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="p-6 bg-green-50 rounded-[24px] border border-green-100 flex gap-4">
                        <CheckCircle2 className="text-[#006442] h-6 w-6 shrink-0" />
                        <p className="text-slate-600 text-sm font-medium">
                          By clicking Finish, you agree to our Terms of Service and Privacy Policy. We use your data only to personalize your clinical nutrition experience.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {step > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      className="h-14 rounded-2xl border-slate-200 flex-1 font-bold text-slate-600"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" /> Back
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="h-14 rounded-2xl bg-[#006442] flex-1 font-bold text-white shadow-xl shadow-green-900/10"
                    >
                      Continue <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={registerMutation.isPending}
                      className="h-14 rounded-2xl bg-[#006442] flex-1 font-bold text-white shadow-xl shadow-green-900/10"
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        "Finish Account Setup"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStepTitle(step: number) {
  switch (step) {
    case 1: return "Account Details";
    case 2: return "Physical Stats";
    case 3: return "Lifestyle & Goals";
    case 4: return "Final Review";
    default: return "";
  }
}
