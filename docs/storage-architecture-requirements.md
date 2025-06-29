# 📦 Storage Architecture & Requirements
## Where Everything Lives & How Much Space You Need

### 🗄️ Data Storage Layers

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                         │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                       │
├─────────────────────────────────────────────────────────┤
│  SQLite DB     │  Vector DB      │  File Storage        │
│  (Core Data)   │  (AI Search)    │  (Images/Cache)      │
└─────────────────────────────────────────────────────────┘
```

## 🗂️ What's Stored Where

### 1. **SQLite Database** (Primary Storage)
Currently using SQLite, but can migrate to PostgreSQL for production.

```sql
-- Core Recipe Data (Shared by all users)
recipes: ~500 recipes × 2KB avg = 1MB
recipe_ingredients: ~500 × 8 ingredients = 4,000 records × 100B = 400KB
recipe_instructions: ~500 × 5 steps = 2,500 records × 200B = 500KB
nutritional_info: ~500 records × 200B = 100KB

-- Per-User Data
users: ~1KB per user (profile, preferences)
user_preferences: ~2KB per user (all settings)
user_allergies: ~100B per allergy × avg 3 = 300B
user_health_conditions: ~200B per condition × avg 2 = 400B
user_appliances: ~100B per appliance × avg 5 = 500B
user_behaviors: ~500B per user

-- User-Generated Data (Grows over time)
feedbacks: ~200B per rating × 50 recipes/user = 10KB/user
meal_plans: ~1KB per week × 52 weeks = 52KB/user/year
shopping_lists: ~2KB per week × 52 weeks = 104KB/user/year
user_favorite_recipes: ~100B × 30 favorites = 3KB/user

-- Total per user: ~200KB first year, ~350KB after 2 years
```

### 2. **Vector Database (ChromaDB)** 
For AI-powered semantic search and recommendations.

```javascript
// Embedded on user's machine or cloud
vector_embeddings: {
  recipes: 500 × 1536 dimensions × 4 bytes = 3MB
  user_preferences: 1 per user × 1536 × 4 = 6KB/user
  successful_queries: ~50 per user × 1536 × 4 = 300KB/user
}

// Total: ~3MB base + 306KB per active user
```

### 3. **Local Storage / Cache**
Browser or app cache for offline functionality.

```javascript
localStorage: {
  current_meal_plan: ~10KB
  recent_recipes: ~20KB  
  user_preferences: ~5KB
  offline_queue: ~15KB
}
// Total: ~50KB per user device
```

### 4. **File Storage (Optional)**
For recipe images, user uploads, PDFs.

```
recipe_images: 500 × 200KB (compressed) = 100MB
user_uploads: ~5MB per user (meal photos, receipts)
generated_pdfs: ~500KB per user (meal plans, shopping lists)
```

## 💾 Storage Requirements by Deployment Type

### **Option 1: Local SQLite (Current)**
Perfect for: Personal use, <100 users

```
Database size: ~10MB base + 350KB/user/year
Location: /meal-planner/dev.db
Backup: Simple file copy

Example for 50 users after 1 year:
Base: 10MB + (50 × 200KB) = 20MB total
```

### **Option 2: Supabase (Recommended for SaaS)**
Perfect for: 100-10,000 users

```javascript
// Supabase Free Tier
Database: 500MB (supports ~1,400 active users)
File Storage: 1GB (recipe images + user uploads)
Bandwidth: 2GB/month

// Supabase Pro ($25/month)
Database: 8GB (supports ~23,000 active users)
File Storage: 100GB
Bandwidth: 50GB/month
```

### **Option 3: Self-Hosted PostgreSQL**
Perfect for: Full control, unlimited users

```yaml
# Docker Compose Setup
services:
  postgres:
    image: postgres:15
    volumes:
      - ./data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: meal_planner
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password
    # Allocate based on users:
    # 100 users: 100MB
    # 1,000 users: 1GB  
    # 10,000 users: 10GB
```

## 📊 Storage Scaling Calculations

### **Per User Storage Growth**

```
Year 1: 200KB (profile + initial data)
Year 2: 350KB (+ meal plans, feedbacks)
Year 3: 500KB (+ full history)
Plateau: ~600KB (old data pruned)
```

### **By User Count**

| Users | Database | Vectors | Files | Total |
|-------|----------|---------|-------|-------|
| 10    | 12MB     | 6MB     | 50MB  | 68MB  |
| 100   | 30MB     | 33MB    | 100MB | 163MB |
| 1,000 | 210MB    | 309MB   | 500MB | 1GB   |
| 10,000| 2GB      | 3GB     | 5GB   | 10GB  |

## 🚀 Optimization Strategies

### 1. **Data Compression**
```javascript
// Compress JSON fields
const compressedPreferences = zlib.gzipSync(
  JSON.stringify(userPreferences)
).toString('base64');
// Reduces size by ~70%
```

### 2. **Intelligent Archiving**
```sql
-- Move old meal plans to archive after 6 months
INSERT INTO meal_plans_archive 
SELECT * FROM meal_plans 
WHERE created_at < NOW() - INTERVAL '6 months';

DELETE FROM meal_plans 
WHERE created_at < NOW() - INTERVAL '6 months';
```

### 3. **Vector DB Optimization**
```python
# Use quantization for vectors
vectors = quantize_embeddings(embeddings, bits=8)
# Reduces vector storage by 75%
```

### 4. **Smart Caching**
```typescript
// Cache popular recipes in Redis
const popularRecipes = await redis.get('popular_recipes');
if (!popularRecipes) {
  const recipes = await db.getPopularRecipes();
  await redis.setex('popular_recipes', 3600, recipes);
}
```

## 🏗️ Infrastructure Recommendations

### **For MVP (0-100 users)**
```yaml
Storage: SQLite local file
Backup: Daily file copy to cloud
Cost: $0 (runs on your server)
```

### **For Growth (100-1,000 users)**
```yaml
Database: Supabase or Railway ($25/month)
Vectors: Pinecone free tier
Files: Cloudflare R2 ($0.015/GB)
Backup: Automated daily
Cost: ~$30-50/month
```

### **For Scale (1,000+ users)**
```yaml
Database: PostgreSQL on AWS RDS
Vectors: Dedicated Weaviate instance  
Files: AWS S3 with CloudFront CDN
Cache: Redis cluster
Backup: Continuous replication
Cost: ~$200-500/month
```

## 🛡️ Data Privacy & Security

### **What's Stored**
```javascript
// Personal Data (encrypted)
- Email, name
- Health conditions
- Dietary restrictions
- Meal history

// Anonymous Data
- Recipe ratings
- Popular ingredients
- Cooking times
```

### **GDPR Compliance**
```typescript
// User data export
async function exportUserData(userId: string) {
  const data = {
    profile: await db.user.findUnique({ where: { id: userId } }),
    preferences: await db.userPreferences.findUnique({ where: { userId } }),
    mealPlans: await db.mealPlan.findMany({ where: { userId } }),
    feedbacks: await db.feedback.findMany({ where: { userId } })
  };
  
  return JSON.stringify(data, null, 2);
}

// User data deletion
async function deleteUserData(userId: string) {
  await db.user.delete({ where: { id: userId } });
  // Cascades to all related data
}
```

## 💡 Key Insights

1. **Storage is Cheap**: Even 10,000 active users = ~10GB total
2. **Start Small**: SQLite handles 100s of users easily
3. **Vector Storage**: Biggest growth area (for AI features)
4. **User Data**: ~600KB max per user (very manageable)
5. **Recipe Data**: Shared across all users (efficient)

The system is designed to scale efficiently - you could run 1,000 users on a $25/month database! 