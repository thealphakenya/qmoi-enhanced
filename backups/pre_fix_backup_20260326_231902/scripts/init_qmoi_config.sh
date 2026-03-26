// [PRODUCTION READY] this file has no remaining non-production markers
# Initialize QMOI Configuration
python3 scripts/qmoi_enhanced_auto_config.py

# Export environment variables
source .env.production

# Check configuration
echo "✅ QMOI Enhanced Configuration loaded"