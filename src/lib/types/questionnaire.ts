/**
 * Universal Questionnaire System Types
 * Supports conditional logic and multi-niche adaptation
 */

export type DietaryGoal = 'weight_loss' | 'muscle_gain' | 'medical_condition' | 'lifestyle_diet' | 'general_health';

export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';
export type BudgetRange = 'budget' | 'moderate' | 'premium';
export type Severity = 'mild' | 'moderate' | 'severe';

// Core Questionnaire Flow
export interface QuestionnaireFlow {
  // Tier 1: Primary Goal Assessment (Universal)
  primaryGoal: DietaryGoal;
  
  // Tier 2: Conditional Sections (Goal-specific)
  medicalConditions?: MedicalConditionQuestions;
  fitnessGoals?: FitnessGoalQuestions;
  lifestylePreferences?: LifestyleQuestions;
  
  // Tier 3: Universal Practical Questions
  practicalConstraints: PracticalConstraints;
  
  // Tier 4: Safety and Preferences
  allergies: AllergyInfo[];
  additionalPreferences?: AdditionalPreferences;
}

// Medical Condition Path
export interface MedicalConditionQuestions {
  primaryCondition: string;
  secondaryConditions?: string[];
  severity: Severity;
  diagnosisDate?: Date;
  currentTreatment?: string;
  dietaryRestrictions?: string[];
  symptomTriggers?: string[];
  healthGoals: string[];
}

// Fitness Goals Path
export interface FitnessGoalQuestions {
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'athletic_performance';
  targetWeight?: number;
  currentWeight?: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  workoutFrequency: number; // days per week
  specificSport?: string;
  timeframe?: number; // weeks
}

// Lifestyle Diet Path
export interface LifestyleQuestions {
  dietaryPreference: 'vegan' | 'vegetarian' | 'pescatarian' | 'keto' | 'paleo' | 'mediterranean' | 'other';
  motivations: string[];
  experience: 'new' | 'some_experience' | 'experienced';
  socialConsiderations?: string[];
  culturalPreferences?: string[];
}

// Universal Practical Constraints
export interface PracticalConstraints {
  cookingSkill: CookingSkill;
  maxPrepTime: number; // minutes
  budgetRange: BudgetRange;
  householdSize: number;
  
  // Equipment Available
  equipment: {
    oven: boolean;
    stove: boolean;
    microwave: boolean;
    blender: boolean;
    airFryer: boolean;
    slowCooker: boolean;
    instantPot: boolean;
    foodProcessor: boolean;
    grill: boolean;
  };
  
  // Meal Preferences
  mealsPerDay: number;
  snacksPerDay: number;
  batchCookingPreference: boolean;
  mealPrepDays?: string[];
}

// Allergy and Safety Information
export interface AllergyInfo {
  allergen: string;
  severity: Severity;
  category: 'food' | 'environmental' | 'medication';
  crossReactivity?: string[];
}

// Additional Preferences
export interface AdditionalPreferences {
  cuisinePreferences?: string[];
  dislikedIngredients?: string[];
  texturePreferences?: string[];
  spiceLevel: 'none' | 'mild' | 'medium' | 'hot' | 'very_hot';
  organicPreference?: boolean;
  localPreference?: boolean;
  sustainabilityImportance?: number; // 1-5 scale
}

// Questionnaire State Management
export interface QuestionnaireState {
  currentStep: number;
  totalSteps: number;
  completedSections: string[];
  responses: Partial<QuestionnaireFlow>;
  validationErrors: ValidationError[];
  isComplete: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// Conditional Logic Types
export interface ConditionalQuestion {
  id: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'date' | 'scale';
  options?: string[];
  required: boolean;
  dependsOn?: {
    field: string;
    value: any;
    operator: 'equals' | 'includes' | 'greater_than' | 'less_than';
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidator?: string;
  };
  medicalSafetyCheck?: boolean;
}

export interface QuestionSection {
  id: string;
  title: string;
  description?: string;
  questions: ConditionalQuestion[];
  showIf?: {
    primaryGoal?: DietaryGoal[];
    conditions?: string[];
  };
}

// User Profile Generation
export interface GeneratedUserProfile {
  id: string;
  primaryGoal: DietaryGoal;
  healthConditions: HealthConditionProfile[];
  allergies: AllergyProfile[];
  preferences: UserPreferences;
  dietaryRestrictions: string[];
  nutritionalTargets: NutritionalTargets;
  practicalConstraints: PracticalConstraints;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

export interface HealthConditionProfile {
  condition: string;
  severity: Severity;
  dietaryImpact: string[];
  nutritionalConsiderations: string[];
  restrictedIngredients: string[];
  recommendedNutrients: string[];
}

export interface AllergyProfile {
  allergen: string;
  severity: Severity;
  avoidanceList: string[];
  crossReactivityWarnings: string[];
  emergencyProtocol?: string;
}

export interface UserPreferences {
  cookingSkillLevel: CookingSkill;
  maxPrepTimeMinutes: number;
  budgetRange: BudgetRange;
  householdSize: number;
  equipmentAvailable: string[];
  mealsPerDay: number;
  snacksPerDay: number;
  batchCookingPreference: boolean;
  cuisinePreferences: string[];
  spiceLevel: string;
}

export interface NutritionalTargets {
  dailyCalories?: number;
  macroTargets?: {
    protein: number; // grams
    carbohydrates: number; // grams
    fat: number; // grams
  };
  micronutrientFocus?: string[];
  specialConsiderations?: string[];
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  mitigation: string[];
  monitoringRequired: boolean;
}

// API Response Types
export interface QuestionnaireSubmissionResponse {
  success: boolean;
  userProfile: GeneratedUserProfile;
  recommendedRecipes: string[];
  suggestedMealPlan?: string;
  nextSteps: string[];
  errors?: string[];
}

export interface QuestionnaireValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completionPercentage: number;
} 