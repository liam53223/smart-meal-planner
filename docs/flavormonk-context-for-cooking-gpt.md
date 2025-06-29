# FlavorMonk - Smart Meal Planning App Context

## 🎯 Project Overview
I'm building **FlavorMonk** (formerly Smart Meal Planner), a personalized meal planning SaaS app that uses AI to create custom meal plans based on users' health conditions, preferences, and available appliances.

**Target Market**: Health-conscious individuals who want personalized nutrition but struggle with meal planning
**Pricing**: $4.99/month subscription
**Tech Stack**: Next.js, TypeScript, Prisma, SQLite (dev) / PostgreSQL (prod), Ollama (local AI) + DeepSeek (cloud AI)

## 🌟 Key Differentiators
1. **Appliance Optimization**: Recipes adapt to user's specific appliances (air fryer, Instant Pot, etc.)
2. **Medical Condition Support**: Tailored for PCOS, diabetes, IBS, autoimmune conditions
3. **Evidence-Based Spice Blends**: Clinical research-backed spice combinations for health benefits
4. **Kojo AI Personality**: Engaging chatbot with 5 moods that adapts to conversation
5. **Hybrid AI Approach**: 80% local (free), 20% cloud for complex queries

## 📊 Current Status
- **Recipe Bank**: 345 recipes loaded (target: 500)
- **Recipe Categories**: Breakfast (75), Lunch (90), Dinner (105), Snacks (60), Other (15)
- **Completion**: ~70% architecture done, ~30% implementation done
- **Missing**: User auth, payment system, actual UI pages

## 🍳 Recipe System Design
Each recipe includes:
- Name, description, ingredients, instructions
- Prep/cook time, servings, complexity (1-5)
- Nutritional info (calories, protein, carbs, fat, fiber, sodium)
- Appliance requirements
- Health goal tags (weight_loss, muscle_gain, heart_health, etc.)
- Cost tier (budget, moderate, premium)

## 🤔 Questions for Cooking GPT

### 1. **Recipe Quality & Variety**
"I have 345 recipes in my database. What key recipe types or cuisines am I likely missing that users expect? What would make my recipe collection feel more complete?"

### 2. **Appliance Adaptation**
"I want recipes to automatically adapt for different appliances. For example, a chicken recipe might have variations for oven (25 min), air fryer (18 min), or Instant Pot (12 min). What are the key conversion rules I should implement for each appliance?"

### 3. **Meal Planning Intelligence**
"What logic should I use to create weekly meal plans that are: (a) nutritionally balanced, (b) use overlapping ingredients to reduce waste, (c) vary in complexity throughout the week, and (d) respect user's time constraints?"

### 4. **Recipe Success Predictors**
"Based on your knowledge, what makes a recipe likely to be actually cooked vs just saved? I want to optimize for recipes people will actually make."

### 5. **Spice & Flavor Intelligence**
"I'm implementing evidence-based spice blends (turmeric+black pepper, cinnamon for blood sugar, etc.). What other scientifically-backed spice combinations should I include?"

### 6. **Shopping List Optimization**
"How should I group ingredients in shopping lists to match typical grocery store layouts? What's the best way to handle ingredient substitutions?"

### 7. **Cultural Sensitivity**
"How can I ensure my recipe adaptations respect cultural authenticity while making them accessible? For example, adapting Indian recipes for American kitchens without losing authenticity."

### 8. **Quick Meal Hacks**
"What are the top 10 'cooking hacks' or techniques that would help busy users save time without sacrificing nutrition or flavor?"

## 💡 Specific Areas for Feedback

1. **Recipe Gaps**: What essential recipes am I missing?
2. **User Experience**: What features would make users actually stick to their meal plans?
3. **Health Optimization**: How to balance taste with health goals?
4. **Batch Cooking**: Best approach for meal prep functionality?
5. **Dietary Restrictions**: How to handle multiple restrictions elegantly?

## 🎯 Ultimate Goal
Create an app that makes healthy cooking so easy and personalized that users actually cook more at home, save money, and improve their health - all for $4.99/month.

**Current Challenge**: I have good architecture but need to ensure the recipe content and meal planning logic will actually deliver value to users.

What insights can you provide to make FlavorMonk the best meal planning app for busy, health-conscious people? 