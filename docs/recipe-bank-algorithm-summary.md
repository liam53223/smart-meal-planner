# 🧠 Recipe Bank Algorithm Summary
## Intelligent, Dynamic, Research-Based System

### Overview
The recipe bank uses a **multi-layered intelligent algorithm** that dynamically adapts relationships based on your comprehensive research data. It can expand for broad exploration or contract for precise matches based on query context.

## 🔄 Dynamic Relationship System

### 1. **Expansion/Contraction Intelligence**
The system automatically determines whether to cast a wide net or narrow focus:

```
Expansion Level = 0 (Narrow) → 1 (Broad)
```

**Factors determining expansion:**
- **Query Specificity** (30% weight)
  - "exactly chicken parmesan" → 0.2 (narrow)
  - "something with chicken" → 0.8 (broad)
  
- **Constraint Strictness** (25% weight)
  - Multiple allergies/conditions → narrower search
  - Tight budget/time → narrower search
  
- **User Experience** (15% weight)
  - New users → broader options
  - Experienced users → can handle specific matches
  
- **Time Pressure** (10% weight)
  - <20 min available → narrow to quick recipes
  
- **Exploratory Intent** (20% weight)
  - "Give me ideas" → broad search
  - "I need exactly this" → narrow search

### 2. **Research-Based Relationship Weights**

Based on your comprehensive questionnaire data:

#### Health Condition Priorities
```javascript
diabetes: {
  carbs: 0.9,      // Very important
  sugar: 0.95,     // Critical
  fiber: 0.8,      // Important
  glycemicIndex: 0.85
}

heartDisease: {
  saturatedFat: 0.9,
  sodium: 0.85,
  omega3: 0.8
}

pcos: {
  glycemicIndex: 0.9,
  antiInflammatory: 0.85,
  protein: 0.7
}
```

#### Goal-Based Optimization
```javascript
weightLoss: {
  calories: 0.9,
  protein: 0.7,
  fiber: 0.8,
  satiety: 0.85
}

muscleGain: {
  protein: 0.95,
  calories: 0.7,
  carbs: 0.8,
  timing: 0.6
}
```

#### Behavioral Adaptations
```javascript
lowMotivation: {
  simplicity: 0.9,
  time: 0.85,
  familiarity: 0.7
}

highMotivation: {
  variety: 0.8,
  complexity: 0.6,
  novelty: 0.7
}
```

### 3. **Multi-Dimensional Scoring**

Each recipe gets scored across 6 dimensions:

1. **Health Alignment (25%)**
   - Matches medical conditions
   - Meets nutritional goals
   - Avoids problematic ingredients

2. **Preference Alignment (20%)**
   - Uses liked ingredients
   - Avoids disliked ones
   - Matches cuisine preferences

3. **Behavioral Fit (15%)**
   - Complexity matches skill
   - Time fits schedule
   - Aligns with motivation

4. **Complexity Match (15%)**
   - Adapts to cooking skill
   - Considers available time
   - Factors in equipment

5. **Historical Success (15%)**
   - Previous ratings
   - Similar recipe performance
   - Learning from feedback

6. **Novelty Balance (10%)**
   - New vs familiar
   - Based on change readiness
   - Prevents boredom/overwhelm

### 4. **Intelligent Features**

#### Appliance Flexibility
```javascript
// Primary: Air Fryer
// System automatically considers:
alternatives = {
  'air fryer': ['oven', 'convection oven'],
  'instant pot': ['slow cooker', 'pressure cooker']
}
// Expansion level determines how many alternatives to include
```

#### Seasonal Cost Awareness
```javascript
// August query for tomato recipe
'tomato': summerMonths.includes(currentMonth) 
  ? baseCost * 0.7  // 30% discount
  : baseCost
```

#### Flavor Profile Analysis
```javascript
// Analyzes ingredient combinations
flavorProfile = {
  sweet: 2,
  salty: 1,
  umami: 3,
  balance: 'complex'  // 4+ active flavors
}
```

#### Micronutrient Optimization
- Targets specific deficiencies
- Suggests fortifying ingredients
- Tracks micronutrient density

### 5. **Query Examples**

**Narrow Search Example:**
- Query: "Quick air fryer chicken for diabetes"
- Expansion: 0.2
- Results: 5-10 very specific matches
- Filters: Strict carb limits, <20min, air fryer only

**Broad Search Example:**
- Query: "Healthy dinner ideas"
- Expansion: 0.8
- Results: 30-50 varied options
- Filters: Flexible on time/method, various cuisines

**Adaptive Example:**
- User: Low motivation, beginner, owns microwave
- System: Automatically favors ultra-simple, familiar recipes
- Gradually introduces complexity as success builds

### 6. **Learning & Improvement**

The system continuously learns through:

1. **Feedback Integration**
   - 5-star recipe → ingredients get preference boost
   - 1-star recipe → ingredients get negative weight
   
2. **Pattern Recognition**
   - Identifies successful combinations
   - Learns timing preferences
   - Maps appliance preferences

3. **A/B Testing**
   - Tests new recommendation strategies
   - Measures engagement/success
   - Automatically adopts improvements

### 7. **Evidence-Based Spice Integration**

Based on clinical research:
```javascript
if (healthCondition.includes('inflammation')) {
  prioritizeSpiceBlends(['golden_antiinflammatory']);
  // Turmeric + black pepper + ginger
  // Clinical evidence: Level A (Multiple RCTs)
}
```

## 🎯 The Result

An algorithm that:
- **Expands** when users need inspiration
- **Contracts** when users need specific solutions
- **Learns** from every interaction
- **Adapts** to individual patterns
- **Optimizes** for health outcomes
- **Respects** constraints and preferences
- **Balances** nutrition, taste, and practicality

This creates a truly personalized experience where the recipe bank feels like it "knows" each user, providing exactly what they need when they need it. 