/**
 * Flavor Monk Cost Calculator
 * Run with: npx ts-node scripts/calculate-costs.ts
 */

interface CostScenario {
  users: number;
  aiProvider: string;
  hosting: string;
  totalMonthlyCost: number;
  profitAt5: number;
  profitAt10: number;
}

function calculateScenarios(): CostScenario[] {
  const scenarios: CostScenario[] = [];
  
  // Scenario 1: Minimal (100 users)
  scenarios.push({
    users: 100,
    aiProvider: 'OpenAI GPT-3.5',
    hosting: 'Vercel + Supabase',
    totalMonthlyCost: 45,
    profitAt5: 100 * 4.99 - 45,  // $454
    profitAt10: 100 * 9.99 - 45,  // $954
  });
  
  // Scenario 2: Growth (500 users)
  scenarios.push({
    users: 500,
    aiProvider: 'OpenAI GPT-3.5 + Caching',
    hosting: 'Vercel Pro + Supabase',
    totalMonthlyCost: 80,
    profitAt5: 500 * 4.99 - 80,   // $2,415
    profitAt10: 500 * 9.99 - 80,  // $4,915
  });
  
  // Scenario 3: Scale (1000 users)
  scenarios.push({
    users: 1000,
    aiProvider: 'Replicate Llama 70B',
    hosting: 'Vercel Pro + Supabase Pro',
    totalMonthlyCost: 120,
    profitAt5: 1000 * 4.99 - 120,  // $4,870
    profitAt10: 1000 * 9.99 - 120, // $9,870
  });
  
  // Scenario 4: Premium (2000 users)
  scenarios.push({
    users: 2000,
    aiProvider: 'Mix: GPT-3.5 + Llama 70B',
    hosting: 'AWS/GCP with auto-scaling',
    totalMonthlyCost: 250,
    profitAt5: 2000 * 4.99 - 250,  // $9,730
    profitAt10: 2000 * 9.99 - 250, // $19,730
  });
  
  return scenarios;
}

function printLocalHostingWarning() {
  console.log('⚠️  LOCAL HOSTING REALITY CHECK ⚠️\n');
  console.log('Your RTX 5080 System:');
  console.log('- 🔌 Must run 24/7 (never sleep, never restart)');
  console.log('- 💰 Electricity: ~$25-40/month');
  console.log('- 🌐 Requires static IP or dynamic DNS');
  console.log('- 🔒 Major security risks');
  console.log('- 📉 Max ~20 concurrent users');
  console.log('- 🚫 No redundancy (PC crash = all users down)');
  console.log('- 🏠 ISP may terminate service');
  console.log('- 🔥 Fire hazard if cooling fails\n');
}

function printCloudComparison() {
  console.log('☁️  CLOUD DEPLOYMENT BENEFITS ☁️\n');
  console.log('Professional hosting provides:');
  console.log('- ✅ 99.9% uptime guarantee');
  console.log('- ✅ Automatic SSL/HTTPS');
  console.log('- ✅ DDoS protection');
  console.log('- ✅ Global CDN (fast worldwide)');
  console.log('- ✅ Auto-scaling');
  console.log('- ✅ Daily backups');
  console.log('- ✅ Zero maintenance');
  console.log('- ✅ Professional support\n');
}

function printCostBreakdown() {
  console.log('💰 FLAVOR MONK COST BREAKDOWN 💰\n');
  
  const scenarios = calculateScenarios();
  
  console.log('┌─────────┬──────────────────┬──────────────┬─────────────┬─────────────┐');
  console.log('│ Users   │ Infrastructure   │ Monthly Cost │ Profit @$5  │ Profit @$10 │');
  console.log('├─────────┼──────────────────┼──────────────┼─────────────┼─────────────┤');
  
  scenarios.forEach(s => {
    console.log(
      `│ ${s.users.toString().padEnd(7)} │ ${s.hosting.padEnd(16)} │ $${s.totalMonthlyCost.toString().padEnd(11)} │ $${Math.round(s.profitAt5).toString().padEnd(10)} │ $${Math.round(s.profitAt10).toString().padEnd(10)} │`
    );
  });
  
  console.log('└─────────┴──────────────────┴──────────────┴─────────────┴─────────────┘\n');
}

function printRecommendation() {
  console.log('🎯 RECOMMENDED PATH FOR GUMROAD LAUNCH 🎯\n');
  console.log('1️⃣  Week 1: Deploy MVP');
  console.log('   - Frontend: Vercel (free)');
  console.log('   - Database: Supabase ($25/mo)');
  console.log('   - AI: OpenAI GPT-3.5 ($20/mo budget)');
  console.log('   - Total: $45/month\n');
  
  console.log('2️⃣  Month 1-2: Validate & Grow');
  console.log('   - Launch on Gumroad at $4.99/month');
  console.log('   - Target: 100 users = $454/mo profit');
  console.log('   - Gather feedback, improve features\n');
  
  console.log('3️⃣  Month 3+: Scale Based on Growth');
  console.log('   - 500 users → Add caching layer');
  console.log('   - 1000 users → Switch to Llama 70B');
  console.log('   - 2000+ users → Consider dedicated infrastructure\n');
}

function printYourRoleWithRTX5080() {
  console.log('🖥️  YOUR RTX 5080\'s ROLE 🖥️\n');
  console.log('DEVELOPMENT (Perfect for):');
  console.log('- 🧪 Testing with local Ollama');
  console.log('- 🍳 Generating recipe variations');
  console.log('- 📊 Processing large datasets');
  console.log('- 🤖 Fine-tuning models');
  console.log('- 💾 Creating embeddings offline\n');
  
  console.log('NOT FOR PRODUCTION:');
  console.log('- ❌ Serving live customers');
  console.log('- ❌ Running 24/7 server');
  console.log('- ❌ Handling payments');
  console.log('- ❌ Storing user data\n');
}

// Run the calculator
console.clear();
console.log('═══════════════════════════════════════════════════════\n');
console.log('         🧘 FLAVOR MONK DEPLOYMENT CALCULATOR 🧘         \n');
console.log('═══════════════════════════════════════════════════════\n');

printLocalHostingWarning();
printCloudComparison();
printCostBreakdown();
printRecommendation();
printYourRoleWithRTX5080();

console.log('═══════════════════════════════════════════════════════\n');
console.log('📝 NEXT STEPS:');
console.log('1. Sign up for Vercel (https://vercel.com)');
console.log('2. Create Supabase project (https://supabase.com)');
console.log('3. Get OpenAI API key (https://platform.openai.com)');
console.log('4. Run: npm run build && vercel --prod');
console.log('5. List on Gumroad and start selling!\n');

// Cost per user calculation
console.log('📊 DETAILED COST ANALYSIS:');
console.log('- AI tokens per user/month: ~50,000');
console.log('- GPT-3.5 cost: $0.10/user/month');
console.log('- Database cost: $0.05/user/month');
console.log('- Hosting cost: $0.02/user/month');
console.log('- Total cost per user: ~$0.17/month');
console.log('- Gross margin at $4.99: 96.6%');
console.log('- Gross margin at $9.99: 98.3%\n');

export {}; 