
export interface DaySchedule {
    activity: 'Rest' | 'Upper Body Strength' | 'Lower Body Strength' | 'Full Body Strength' | 'HIIT' | 'Cardio (Running)' | 'Cardio (Swimming)' | 'Cardio (Cycling)';
    duration: 'No Workout' | '15-30 minutes' | '30-45 minutes' | '45-60 minutes' | '60-90 minutes';
}

export interface WeeklySchedule {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
}

export interface UserDetails {
  age: string;
  gender: 'male' | 'female' | 'other';
  weight: string;
  height: string;
  goal: 'lose' | 'gain' | 'maintain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very';
  healthConditions: string;
  budget: 'standard' | 'budget-friendly';
  dietaryPreferences: string;
  foodsToExclude: string;
  weeklySchedule: WeeklySchedule;
  availableEquipment: string;
}

export interface Meal {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  calories: number;
}

export interface DailyMealPlan {
  day: string;
  meals: Meal;
}

export interface Exercise {
  name: string;
  description: string;
}

export interface DailyExercisePlan {
  day: string;
  workoutType: string;
  exercises: Exercise[];
  completedExercises: Record<string, boolean>;
}

export interface StretchingRoutine {
    title: string;
    stretches: {
        name: string;
        description: string;
    }[];
}

export interface WellnessPlan {
  summary: string;
  dailyCalorieGoal: number;
  dailyWaterGoal: number;
  mealPlan: DailyMealPlan[];
  exercisePlan: DailyExercisePlan[];
  stretchingPlan: StretchingRoutine;
}

export interface WeightLog {
    date: string;
    weight: string;
}

export interface MeasurementLog {
    id: string;
    date: string;
    measurements: {
        chest?: string;
        waist?: string;
        hips?: string;
        leftArm?: string;
        rightArm?: string;
        leftThigh?: string;
        rightThigh?: string;
    };
}

export interface MealLog {
    id: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    description: string;
    calories?: number;
}

export interface LoggedExerciseSet {
    reps: number;
    weight: number;
}

export interface LoggedExercise {
    id: string;
    name: string;
    type: 'Strength' | 'Cardio';
    sets: LoggedExerciseSet[]; // For strength
    duration: number; // in minutes, for cardio
    distance: number; // in km, for cardio
}

export interface WorkoutLog {
    id:string;
    date: string; // YYYY-MM-DD
    exercises: LoggedExercise[];
    notes?: string;
}

export interface WaterLog {
    date: string; // YYYY-MM-DD
    amount: number; // in ml
}

export interface Recipe {
    recipeName: string;
    description: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    ingredients: string[];
    instructions: string[];
    notes?: string;
}

export interface RecipePreferences {
    mealType: string;
    ingredients: string;
    dietaryNeeds: string;
}

export interface ChatHistoryContent {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface ShoppingListCategory {
    categoryName: string;
    items: string[];
}

export interface ShoppingList {
    categories: ShoppingListCategory[];
}

export interface Profile {
    id: string;
    name: string;
    avatar: string;
    userDetails: UserDetails;
    plan: WellnessPlan | null;
    progress: WeightLog[];
    measurements: MeasurementLog[];
    mealLogs: MealLog[];
    workoutLogs: WorkoutLog[];
    waterLogs: WaterLog[];
    chatHistory: ChatHistoryContent[];
}
