#!/bin/bash
# QMOI Health Monitor Script
# Continuous health monitoring and alerting

echo "🩺 QMOI Health Monitor - $(date)"

# Run health validation
python health_validator.py

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ All systems healthy"
elif [ $? -eq 1 ]; then
    echo "⚠️  Minor health issues detected"
else
    echo "🚨 Critical health issues - immediate attention required"
fi

echo "📊 Health check completed at $(date)"
