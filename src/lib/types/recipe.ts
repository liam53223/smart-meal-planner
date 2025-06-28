/**
 * Multi-Dimensional Recipe Tagging System Types
 * Enables one recipe to serve multiple dietary niches
 */

// Core Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  servings: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Recipe Content
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  
  // Multi-Dimensional Tags
  medicalCompatibility: MedicalCompatibilityTags;
  dietaryRestrictions: DietaryRestrictionTags;
  practicalConsiderations: PracticalConsiderationTags;
  nutritionalFocus: NutritionalFocusTags;
  
  // Metadata
  nutritionalInfo: NutritionalInfo;
  images?: string[];
  source?: string;
  rating?: number;
  reviewCount?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  category?: IngredientCategory;
  substitutions?: IngredientSubstitution[];
}

export interface IngredientSubstitution {
  ingredient: string;
  amount: number;
  unit: string;
  reason: 'allergy' | 'dietary_restriction' | 'availability' | 'preference';
  notes?: string;
}

export interface RecipeInstruction {
  id: string;
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
  temperature?: number; // celsius
  equipment?: string[];
  tips?: string[];
}

// Multi-Dimensional Tagging System
export interface MedicalCompatibilityTags {
  // Digestive Conditions
  ibs_fodmap_low: boolean;
  ibs_fodmap_moderate: boolean;
  crohns_friendly: boolean;
  celiac_safe: boolean;
  gastroparesis_suitable: boolean;
  
  // Metabolic Conditions
  diabetes_friendly: boolean;
  prediabetes_suitable: boolean;
  insulin_resistance_friendly: boolean;
  metabolic_syndrome_appropriate: boolean;
  
  // Autoimmune Conditions
  autoimmune_aip_compliant: boolean;
  rheumatoid_arthritis_friendly: boolean;
  lupus_appropriate: boolean;
  hashimotos_suitable: boolean;
  
  // Cardiovascular Conditions
  heart_healthy: boolean;
  low_sodium: boolean;
  cholesterol_friendly: boolean;
  hypertension_suitable: boolean;
  
  // Kidney Conditions
  kidney_disease_safe: boolean;
  low_phosphorus: boolean;
  low_potassium: boolean;
  dialysis_appropriate: boolean;
  
  // Hormonal Conditions
  pcos_friendly: boolean;
  thyroid_supportive: boolean;
  menopause_supportive: boolean;
  
  // Other Medical Considerations
  anti_inflammatory: boolean;
  gut_healing: boolean;
  blood_sugar_stable: boolean;
  detox_supportive: boolean;
}

export interface DietaryRestrictionTags {
  // Plant-Based
  vegan: boolean;
  vegetarian: boolean;
  pescatarian: boolean;
  
  // Allergen-Free
  gluten_free: boolean;
  dairy_free: boolean;
  egg_free: boolean;
  nut_free: boolean;
  soy_free: boolean;
  shellfish_free: boolean;
  fish_free: boolean;
  
  // Lifestyle Diets
  keto: boolean;
  paleo: boolean;
  whole30: boolean;
  mediterranean: boolean;
  dash: boolean;
  
  // Religious/Cultural
  halal: boolean;
  kosher: boolean;
  hindu_vegetarian: boolean;
  
  // Specialty
  raw_food: boolean;
  macrobiotic: boolean;
  alkaline: boolean;
}

export interface PracticalConsiderationTags {
  // Time Constraints
  quick_prep: boolean; // <15 min prep
  quick_cook: boolean; // <30 min total
  slow_cooker: boolean;
  instant_pot: boolean;
  one_pot: boolean;
  no_cook: boolean;
  
  // Skill Level
  beginner_friendly: boolean;
  intermediate_skill: boolean;
  advanced_technique: boolean;
  
  // Equipment Needed
  basic_equipment_only: boolean;
  oven_required: boolean;
  stovetop_only: boolean;
  blender_required: boolean;
  food_processor_needed: boolean;
  special_equipment: string[];
  
  // Meal Prep & Storage
  batch_cookable: boolean;
  freezer_friendly: boolean;
  meal_prep_suitable: boolean;
  leftover_friendly: boolean;
  portable: boolean;
  
  // Budget Considerations
  budget_friendly: boolean;
  uses_common_ingredients: boolean;
  minimal_ingredients: boolean;
  seasonal_ingredients: boolean;
  
  // Family Considerations
  kid_friendly: boolean;
  family_size_portions: boolean;
  customizable: boolean;
  crowd_pleaser: boolean;
}

export interface NutritionalFocusTags {
  // Macronutrient Focus
  high_protein: boolean;
  low_carb: boolean;
  high_fiber: boolean;
  healthy_fats: boolean;
  complex_carbs: boolean;
  
  // Micronutrient Dense
  vitamin_c_rich: boolean;
  vitamin_d_source: boolean;
  iron_rich: boolean;
  calcium_source: boolean;
  omega3_rich: boolean;
  antioxidant_rich: boolean;
  
  // Calorie Considerations
  low_calorie: boolean;
  calorie_dense: boolean;
  portion_controlled: boolean;
  
  // Special Nutritional Focus
  probiotic_rich: boolean;
  prebiotic_rich: boolean;
  electrolyte_rich: boolean;
  hydrating: boolean;
  energy_boosting: boolean;
  recovery_focused: boolean;
}

// Nutritional Information
export interface NutritionalInfo {
  perServing: {
    calories: number;
    protein: number; // grams
    carbohydrates: number; // grams
    fat: number; // grams
    fiber: number; // grams
    sugar: number; // grams
    sodium: number; // mg
    cholesterol: number; // mg
    saturatedFat: number; // grams
    transFat: number; // grams
    unsaturatedFat: number; // grams
  };
  
  micronutrients?: {
    vitaminA?: number; // IU
    vitaminC?: number; // mg
    vitaminD?: number; // IU
    vitaminE?: number; // mg
    vitaminK?: number; // mcg
    thiamine?: number; // mg
    riboflavin?: number; // mg
    niacin?: number; // mg
    vitaminB6?: number; // mg
    folate?: number; // mcg
    vitaminB12?: number; // mcg
    calcium?: number; // mg
    iron?: number; // mg
    magnesium?: number; // mg
    phosphorus?: number; // mg
    potassium?: number; // mg
    zinc?: number; // mg
  };
  
  glycemicInfo?: {
    glycemicIndex?: number;
    glycemicLoad?: number;
  };
  
  allergenInfo: {
    contains: string[];
    mayContain: string[];
    crossContaminationRisk: string[];
  };
}

// Recipe Filtering & Search
export interface RecipeFilter {
  // Basic Filters
  searchTerm?: string;
  category?: RecipeCategory[];
  cuisine?: string[];
  difficulty?: ('easy' | 'medium' | 'hard')[];
  
  // Time Constraints
  maxPrepTime?: number;
  maxCookTime?: number;
  maxTotalTime?: number;
  
  // Dietary Requirements
  medicalConditions?: string[];
  allergies?: string[];
  dietaryRestrictions?: string[];
  
  // Nutritional Requirements
  maxCalories?: number;
  minProtein?: number;
  maxCarbs?: number;
  maxSodium?: number;
  
  // Practical Constraints
  equipment?: string[];
  skillLevel?: ('beginner' | 'intermediate' | 'advanced')[];
  servings?: number;
  budgetRange?: ('budget' | 'moderate' | 'premium')[];
  
  // User Preferences
  excludeIngredients?: string[];
  favoriteIngredients?: string[];
  spiceLevel?: ('none' | 'mild' | 'medium' | 'hot' | 'very_hot')[];
  
  // Sort Options
  sortBy?: 'relevance' | 'rating' | 'prep_time' | 'calories' | 'protein' | 'created_date';
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface RecipeSearchResult {
  recipes: Recipe[];
  totalCount: number;
  page: number;
  totalPages: number;
  filters: AppliedFilter[];
  suggestions?: string[];
}

export interface AppliedFilter {
  type: string;
  value: string;
  displayName: string;
  removable: boolean;
}

// Recipe Categories
export type RecipeCategory = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'dessert'
  | 'appetizer'
  | 'side_dish'
  | 'salad'
  | 'soup'
  | 'beverage'
  | 'sauce'
  | 'condiment';

export type IngredientCategory =
  | 'protein'
  | 'vegetable'
  | 'fruit'
  | 'grain'
  | 'dairy'
  | 'fat'
  | 'spice'
  | 'herb'
  | 'condiment'
  | 'sweetener'
  | 'liquid'
  | 'other';

// Recipe Analysis & Scoring
export interface RecipeCompatibilityScore {
  overallScore: number; // 0-100
  medicalCompatibility: number; // 0-100
  dietaryCompatibility: number; // 0-100
  practicalFeasibility: number; // 0-100
  nutritionalAlignment: number; // 0-100
  personalPreference: number; // 0-100
  
  breakdown: {
    positiveFactors: string[];
    negativeFactors: string[];
    warnings: string[];
    recommendations: string[];
  };
}

export interface RecipeRecommendation {
  recipe: Recipe;
  compatibilityScore: RecipeCompatibilityScore;
  reasonForRecommendation: string[];
  modifications?: RecipeModification[];
  alternatives?: Recipe[];
}

export interface RecipeModification {
  type: 'ingredient_substitution' | 'portion_adjustment' | 'cooking_method' | 'seasoning_adjustment';
  description: string;
  reason: string;
  impact: 'minor' | 'moderate' | 'significant';
  originalValue?: string;
  modifiedValue: string;
} 