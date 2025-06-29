# Flavor Monk Setup Script for Windows
# Optimized for RTX 5080 16GB + AMD Ryzen 9800X3D

Write-Host "🧘 Welcome to Flavor Monk Setup!" -ForegroundColor Cyan
Write-Host "🚀 Optimizing for your RTX 5080 + 9800X3D..." -ForegroundColor Green

# Set environment variables for optimal GPU performance
$env:OLLAMA_GPU_LAYERS = "99"
$env:OLLAMA_NUM_GPU = "1"
$env:CUDA_VISIBLE_DEVICES = "0"
$env:OLLAMA_NUM_THREAD = "16"

Write-Host "`n📊 System Configuration:" -ForegroundColor Yellow
Write-Host "   GPU Layers: All (99)"
Write-Host "   CPU Threads: 16 (optimal for 9800X3D)"
Write-Host "   VRAM Target: 16GB"

# Check if Ollama is running
Write-Host "`n🔍 Checking Ollama status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -ErrorAction Stop
    Write-Host "✅ Ollama is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ollama is not running. Starting Ollama..." -ForegroundColor Red
    Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# Pull optimized models
Write-Host "`n📥 Downloading optimized models for RTX 5080..." -ForegroundColor Yellow

# Main model - Llama 3.1 70B quantized for 16GB VRAM
Write-Host "`n🦙 Pulling Llama 3.1 70B (Q4_K_M - fits in 16GB)..." -ForegroundColor Cyan
& ollama pull llama3.1:70b-instruct-q4_K_M

# Embedding model for ChromaDB
Write-Host "`n🔤 Pulling embedding model..." -ForegroundColor Cyan
& ollama pull nomic-embed-text:latest

# Alternative model for structured data
Write-Host "`n🎯 Pulling Mistral Large..." -ForegroundColor Cyan
& ollama pull mistral-large:latest

# Create ChromaDB directory
Write-Host "`n📁 Creating ChromaDB directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".\chroma-db" | Out-Null

# Run database migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Yellow
npm run prisma:generate
npm run prisma:migrate

# Load recipes into the database
Write-Host "`n🍳 Loading recipe database (this may take a few minutes)..." -ForegroundColor Yellow
npm run load-recipes

Write-Host "`n✨ Setup Complete!" -ForegroundColor Green
Write-Host "`n🎉 Your Flavor Monk is ready with:" -ForegroundColor Cyan
Write-Host "   ✅ GPU-accelerated Llama 3.1 70B"
Write-Host "   ✅ ChromaDB with 4000+ recipes"
Write-Host "   ✅ Appliance-optimized variations"
Write-Host "   ✅ Semantic recipe search"

Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Run 'npm run dev' to start the app"
Write-Host "   2. Open http://localhost:3001"
Write-Host "   3. Complete the questionnaire"
Write-Host "   4. Chat with Kojo - your AI nutrition monk!"

Write-Host "`n🔥 Performance tips for your RTX 5080:" -ForegroundColor Magenta
Write-Host "   - You can handle batch sizes up to 512 for embeddings"
Write-Host "   - The 70B model will use ~14GB VRAM"
Write-Host "   - Keep 2GB free for ChromaDB operations"
Write-Host "   - Your 9800X3D handles parallel processing beautifully"

Read-Host "`nPress Enter to continue..." 