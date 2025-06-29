-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "primaryGoal" TEXT,
    "preferencesJson" TEXT
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cookingSkillLevel" TEXT NOT NULL DEFAULT 'BEGINNER',
    "maxPrepTimeMinutes" INTEGER NOT NULL DEFAULT 30,
    "budgetRange" TEXT NOT NULL DEFAULT 'MODERATE',
    "householdSize" INTEGER NOT NULL DEFAULT 2,
    "hasOven" BOOLEAN NOT NULL DEFAULT true,
    "hasStove" BOOLEAN NOT NULL DEFAULT true,
    "hasMicrowave" BOOLEAN NOT NULL DEFAULT true,
    "hasBlender" BOOLEAN NOT NULL DEFAULT false,
    "hasAirFryer" BOOLEAN NOT NULL DEFAULT false,
    "hasSlowCooker" BOOLEAN NOT NULL DEFAULT false,
    "hasInstantPot" BOOLEAN NOT NULL DEFAULT false,
    "mealsPerDay" INTEGER NOT NULL DEFAULT 3,
    "snacksPerDay" INTEGER NOT NULL DEFAULT 2,
    "batchCookingPreference" BOOLEAN NOT NULL DEFAULT false,
    "energyRestrictionGoal" TEXT,
    "targetCaloriesMin" INTEGER,
    "targetCaloriesMax" INTEGER,
    "cuisinePreferences" TEXT DEFAULT '',
    "spiceTolerance" INTEGER NOT NULL DEFAULT 3,
    "flavorIntensity" INTEGER NOT NULL DEFAULT 3,
    "knifeSkillLevel" TEXT NOT NULL DEFAULT 'basic',
    "preferredTechniques" TEXT DEFAULT '',
    "recipeComplexityComfort" INTEGER NOT NULL DEFAULT 3,
    "weeklyFoodBudget" REAL,
    "shoppingFrequency" TEXT NOT NULL DEFAULT 'weekly',
    "mealPlanningApproach" INTEGER NOT NULL DEFAULT 3,
    "textureLimitations" TEXT,
    "foodsToAvoid" TEXT,
    "mealTimingPreference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_conditions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_health_conditions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "healthConditionId" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MODERATE',
    "diagnosedDate" DATETIME,
    CONSTRAINT "user_health_conditions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_health_conditions_healthConditionId_fkey" FOREIGN KEY ("healthConditionId") REFERENCES "health_conditions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "allergens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_allergies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "allergenId" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MODERATE',
    CONSTRAINT "user_allergies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_allergies_allergenId_fkey" FOREIGN KEY ("allergenId") REFERENCES "allergens" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "appliances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_appliances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userPreferencesId" TEXT NOT NULL,
    "applianceId" TEXT NOT NULL,
    "usageFrequency" INTEGER NOT NULL DEFAULT 3,
    CONSTRAINT "user_appliances_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "user_preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_appliances_applianceId_fkey" FOREIGN KEY ("applianceId") REFERENCES "appliances" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_behaviors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userPreferencesId" TEXT NOT NULL,
    "portionControlMotivation" INTEGER NOT NULL DEFAULT 3,
    "habitChangeReadiness" TEXT DEFAULT '',
    "socialEatingPattern" INTEGER NOT NULL DEFAULT 3,
    "successTrackingPreference" TEXT NOT NULL DEFAULT 'visual',
    "activityLevel" TEXT NOT NULL DEFAULT 'moderate',
    "healthConditionPriority" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_behaviors_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "user_preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "spice_blends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "activeCompounds" TEXT NOT NULL,
    "clinicalEvidence" TEXT NOT NULL,
    "primaryBenefit" TEXT NOT NULL,
    "effectiveDoseGrams" REAL NOT NULL,
    "bioavailabilityHack" TEXT,
    "quickApplications" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipe_spice_blends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "spiceBlendId" TEXT NOT NULL,
    "amountGrams" REAL NOT NULL,
    CONSTRAINT "recipe_spice_blends_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_spice_blends_spiceBlendId_fkey" FOREIGN KEY ("spiceBlendId") REFERENCES "spice_blends" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "servings" INTEGER NOT NULL DEFAULT 4,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "prepTimeMinutes" INTEGER NOT NULL,
    "cookTimeMinutes" INTEGER NOT NULL,
    "totalTimeMinutes" INTEGER NOT NULL,
    "complexity" INTEGER NOT NULL DEFAULT 3,
    "costTier" TEXT NOT NULL DEFAULT 'moderate',
    "requiredAppliances" TEXT NOT NULL DEFAULT '',
    "goalTags" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recipe_instructions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    CONSTRAINT "recipe_instructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nutritional_info" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "calories" REAL,
    "protein" REAL,
    "carbohydrates" REAL,
    "fat" REAL,
    "fiber" REAL,
    "sugar" REAL,
    "sodium" REAL,
    "cholesterol" REAL,
    "vitaminC" REAL,
    "vitaminD" REAL,
    "calcium" REAL,
    "iron" REAL,
    "potassium" REAL,
    CONSTRAINT "nutritional_info_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medical_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "condition" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipe_medical_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "medicalTagId" TEXT NOT NULL,
    CONSTRAINT "recipe_medical_tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_medical_tags_medicalTagId_fkey" FOREIGN KEY ("medicalTagId") REFERENCES "medical_tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dietary_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipe_dietary_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "dietaryTagId" TEXT NOT NULL,
    CONSTRAINT "recipe_dietary_tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_dietary_tags_dietaryTagId_fkey" FOREIGN KEY ("dietaryTagId") REFERENCES "dietary_tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "practical_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipe_practical_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "practicalTagId" TEXT NOT NULL,
    CONSTRAINT "recipe_practical_tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_practical_tags_practicalTagId_fkey" FOREIGN KEY ("practicalTagId") REFERENCES "practical_tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nutritional_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "recipe_nutritional_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "nutritionalTagId" TEXT NOT NULL,
    CONSTRAINT "recipe_nutritional_tags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recipe_nutritional_tags_nutritionalTagId_fkey" FOREIGN KEY ("nutritionalTagId") REFERENCES "nutritional_tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weekStartDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "meal_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meal_plan_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "servings" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "meal_plan_items_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plans" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_plan_items_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shopping_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mealPlanId" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "shopping_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "shopping_lists_mealPlanId_fkey" FOREIGN KEY ("mealPlanId") REFERENCES "meal_plans" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shopping_list_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shoppingListId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT,
    "purchased" BOOLEAN NOT NULL DEFAULT false,
    "estimatedPrice" REAL,
    CONSTRAINT "shopping_list_items_shoppingListId_fkey" FOREIGN KEY ("shoppingListId") REFERENCES "shopping_lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_favorite_recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_favorite_recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_favorite_recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ab_tests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ab_tests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "health_conditions_name_key" ON "health_conditions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_health_conditions_userId_healthConditionId_key" ON "user_health_conditions"("userId", "healthConditionId");

-- CreateIndex
CREATE UNIQUE INDEX "allergens_name_key" ON "allergens"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_allergies_userId_allergenId_key" ON "user_allergies"("userId", "allergenId");

-- CreateIndex
CREATE UNIQUE INDEX "appliances_name_key" ON "appliances"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_appliances_userPreferencesId_applianceId_key" ON "user_appliances"("userPreferencesId", "applianceId");

-- CreateIndex
CREATE UNIQUE INDEX "user_behaviors_userPreferencesId_key" ON "user_behaviors"("userPreferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "spice_blends_name_key" ON "spice_blends"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_spice_blends_recipeId_spiceBlendId_key" ON "recipe_spice_blends"("recipeId", "spiceBlendId");

-- CreateIndex
CREATE UNIQUE INDEX "nutritional_info_recipeId_key" ON "nutritional_info"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "medical_tags_name_key" ON "medical_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_medical_tags_recipeId_medicalTagId_key" ON "recipe_medical_tags"("recipeId", "medicalTagId");

-- CreateIndex
CREATE UNIQUE INDEX "dietary_tags_name_key" ON "dietary_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_dietary_tags_recipeId_dietaryTagId_key" ON "recipe_dietary_tags"("recipeId", "dietaryTagId");

-- CreateIndex
CREATE UNIQUE INDEX "practical_tags_name_key" ON "practical_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_practical_tags_recipeId_practicalTagId_key" ON "recipe_practical_tags"("recipeId", "practicalTagId");

-- CreateIndex
CREATE UNIQUE INDEX "nutritional_tags_name_key" ON "nutritional_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_nutritional_tags_recipeId_nutritionalTagId_key" ON "recipe_nutritional_tags"("recipeId", "nutritionalTagId");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_lists_mealPlanId_key" ON "shopping_lists"("mealPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_recipes_userId_recipeId_key" ON "user_favorite_recipes"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_userId_recipeId_key" ON "feedbacks"("userId", "recipeId");
