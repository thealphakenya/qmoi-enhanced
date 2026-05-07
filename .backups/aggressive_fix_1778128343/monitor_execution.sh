#!/bin/bash
# QMOI production Hardening Execution Monitor
# Real-time monitoring of bulk fixes and synchronization

while true; do
    clear
    echo "===================================================================================="
    echo "QMOI production HARDENING - REAL-TIME EXECUTION MONITOR"
    echo "===================================================================================="
    echo "Time: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    echo ""
    
    # Check processes
    echo "📊 ACTIVE PROCESSES:"
    pgrep -f "bulk_production_fixer|qmoi_md_autoupdater|production_readiness" | while read pid; do
        cmd=$(ps -p $pid -o cmd= | cut -d' ' -f3- | head -c 60)
        cpu=$(ps -p $pid -o %cpu= | xargs)
        mem=$(ps -p $pid -o %mem= | xargs)
        echo "  • $cmd (CPU: $cpu% | MEM: $mem%)"
    done
    
    echo ""
    echo "📈 OUTPUT FILES GENERATED:"
    ls -lh *.log bulk_fixer_report_*.txt 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
    
    echo ""
    echo "📄 KEY TRACKING FILES:"
    echo "  undone.txt: $(wc -l < undone.txt 2>/dev/null || echo "N/A") lines"
    echo "  MATCHES.md: $(ls -lh MATCHES.md 2>/dev/null | awk '{print $5}' || echo "not generated")"
    echo "  ALLHEALTHS.md: $(ls -lh ALLHEALTHS.md 2>/dev/null | awk '{print $5}' || echo "not generated")"
    
    echo ""
    echo "⏳ Press Ctrl+C to stop monitoring"
    sleep 10
done
