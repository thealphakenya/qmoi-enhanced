# QMOI Enhanced - Operations Guide

## 🎯 **System Overview**

The QMOI Enhanced AI system is a comprehensive, production-ready platform with 8 AI services, orchestration, monitoring, APIs, and web interfaces.

---

## 🚀 **Quick Start**

### **Start the Complete System**
```bash
cd /workspaces/qmoi-enhanced
./start_production.sh
```

### **Check System Status**
```bash
./status.sh
```

### **Access Web Dashboard**
- Open browser to: `http://localhost:5000`
- Real-time monitoring and control
- Task submission interface
- System metrics dashboard

### **Access API Endpoints**
- Base URL: `http://localhost:3000`
- RESTful API for all AI services
- Programmatic access to system functions

---

## 🤖 **AI Services**

### **Core Services**
1. **AI Anomaly Service** - Neural network anomaly detection
2. **ML Service** - Machine learning algorithms
3. **NLP Service** - Natural language processing
4. **CV Service** - Computer vision systems
5. **Autonomous Service** - Reinforcement learning
6. **Advanced Analytics** - Predictive modeling
7. **Performance Optimizer** - System monitoring
8. **AI Orchestrator** - Task coordination

### **Service Management**
```bash
# Full system control
./control_system.sh

# Individual service control
python3 run_ai_anomaly_service.py      # Start anomaly detection
python3 run_ml_service.py              # Start ML service
python3 run_nlp_service.py             # Start NLP service
python3 run_cv_service.py              # Start CV service
python3 run_autonomous_service.py      # Start autonomous learning
python3 run_advanced_analytics_service.py     # Start analytics
python3 run_advanced_performance_optimizer.py # Start performance monitoring
python3 run_ai_api_server.py          # Start API server
python3 run_web_dashboard.py           # Start web dashboard
```

---

## 📊 **Monitoring & Control**

### **Real-time Monitoring**
```bash
# Interactive monitoring dashboard
./monitor_system.sh

# Quick status check
./status.sh

# Web dashboard (browser)
http://localhost:5000
```

### **System Control**
```bash
# Full control interface
./control_system.sh

# Available operations:
# - Start/Stop/Restart all services
# - Start/Stop/Restart individual services
# - Test AI orchestrator
# - View system metrics
# - View service logs
```

### **Log Management**
```bash
# View all logs
tail -f *.log

# Individual service logs
tail -f ai_orchestrator.log
tail -f advanced_performance_optimizer.log
tail -f advanced_analytics_service.log
tail -f ai_anomaly_service.log
tail -f web_dashboard.log
tail -f ai_api_server.log
```

---

## 🔌 **API Endpoints**

### **Base URL:** `http://localhost:3000`

### **Health & Status**
```
GET  /health              - System health check
GET  /system-info         - Comprehensive system information
GET  /recommendations     - AI-powered recommendations
```

### **AI Task Submission**
```
POST /anomaly-detection   - Submit anomaly detection task
POST /machine-learning    - Submit ML task
POST /nlp-analysis        - Submit NLP analysis task
POST /computer-vision     - Submit CV task
POST /predictive-analytics - Submit predictive analytics task
```

### **Task Management**
```
GET  /task/<task_id>      - Get task status and results
```

### **API Usage Examples**

#### **Anomaly Detection**
```bash
curl -X POST http://localhost:3000/anomaly-detection \
  -H "Content-Type: application/json" \
  -d '{"data": [1, 2, 3, 4, 5]}'
```

#### **NLP Analysis**
```bash
curl -X POST http://localhost:3000/nlp-analysis \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test message for analysis"}'
```

#### **System Health**
```bash
curl http://localhost:3000/health
```

---

## 🌐 **Web Dashboard**

### **Access:** `http://localhost:5000`

### **Features**
- **Real-time Status** - Live service status and metrics
- **System Metrics** - CPU, memory, disk, and task monitoring
- **Task Submission** - Web form for submitting AI tasks
- **Control Panel** - Start/stop services, run maintenance
- **Activity Log** - Recent system activity and logs
- **Log Viewer** - Detailed log inspection

### **Dashboard Sections**
1. **Service Status Grid** - Visual status of all AI services
2. **System Metrics** - Resource usage and performance
3. **Control Panel** - System management buttons
4. **Task Submission** - AI task input form
5. **Activity Log** - Recent system events

---

## 🔧 **Maintenance & Operations**

### **Automated Maintenance**
```bash
# Run full maintenance routine
./maintenance.sh

# Maintenance tasks:
# - Clean old log files
# - Remove temporary files
# - Check disk space
# - Verify service health
# - Create configuration backups
# - Optimize performance
# - Update system metrics
```

### **Backup & Recovery**
- **Automatic Backups** - Configuration files backed up daily
- **Log Rotation** - Old logs compressed and archived
- **Service Recovery** - Automatic restart of failed services

### **System Verification**
```bash
# Complete system verification
./verify_deployment.sh

# Quick status check
./status.sh
```

---

## 📈 **Performance Monitoring**

### **Real-time Metrics**
- **CPU Usage** - System processor utilization
- **Memory Usage** - RAM consumption
- **Disk Usage** - Storage space utilization
- **Active Tasks** - Current task queue status
- **Service Health** - Individual service status
- **Response Times** - Task processing performance

### **Performance Optimization**
- **Automatic Monitoring** - Continuous system analysis
- **Resource Optimization** - Memory and CPU management
- **Task Prioritization** - Intelligent task scheduling
- **Health Checks** - Proactive service monitoring

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Service Not Starting**
```bash
# Check logs for errors
tail -f <service_name>.log

# Restart individual service
./control_system.sh  # Then select restart option
```

#### **High Resource Usage**
```bash
# Check system metrics
./status.sh

# Run maintenance
./maintenance.sh

# Restart services
./control_system.sh
```

#### **API Not Responding**
```bash
# Check API server status
ps aux | grep ai_api_server

# Restart API server
pkill -f ai_api_server
python3 run_ai_api_server.py &
```

#### **Web Dashboard Not Loading**
```bash
# Check web dashboard status
ps aux | grep web_dashboard

# Restart web dashboard
pkill -f web_dashboard
python3 run_web_dashboard.py &
```

### **Log Analysis**
```bash
# Search for errors
grep -r "ERROR" *.log

# Search for specific service
grep -r "anomaly_service" *.log

# Monitor in real-time
tail -f ai_orchestrator.log | grep -E "(ERROR|WARNING)"
```

---

## 📋 **Operational Checklist**

### **Daily Operations**
- [ ] Check system status: `./status.sh`
- [ ] Review system metrics
- [ ] Monitor service health
- [ ] Check recent logs for errors
- [ ] Run maintenance: `./maintenance.sh`

### **Weekly Operations**
- [ ] Review backup integrity
- [ ] Analyze performance trends
- [ ] Update system configurations
- [ ] Verify API functionality
- [ ] Test web dashboard

### **Monthly Operations**
- [ ] Full system audit
- [ ] Performance optimization review
- [ ] Security assessment
- [ ] Documentation updates

---

## 🔐 **Security Considerations**

- **API Access** - Consider adding authentication for production
- **Network Security** - Configure firewalls and access controls
- **Data Privacy** - Implement data encryption and access controls
- **Log Security** - Secure log files and monitor access
- **Service Isolation** - Consider containerization for production

---

## 📞 **Support & Resources**

### **Quick Commands**
```bash
# Emergency stop all services
pkill -f "run_.*.py"

# Full system restart
./start_production.sh

# System health check
./verify_deployment.sh

# View all running services
ps aux | grep "run_.*.py"
```

### **Log Locations**
- `ai_orchestrator.log` - Main orchestration logs
- `advanced_performance_optimizer.log` - Performance monitoring
- `advanced_analytics_service.log` - Analytics operations
- `web_dashboard.log` - Web interface logs
- `ai_api_server.log` - API server logs
- Individual service logs for each AI service

### **Configuration Files**
- `.env` - Environment configuration
- `requirements.txt` - Python dependencies
- Various JSON config files for services

---

## 🎉 **System Status: FULLY OPERATIONAL**

The QMOI Enhanced AI system is now a complete, production-ready platform with:
- ✅ **8 AI Services** running and coordinated
- ✅ **Real-time Monitoring** and control
- ✅ **Web Dashboard** for visual management
- ✅ **REST API** for programmatic access
- ✅ **Automated Maintenance** and optimization
- ✅ **Comprehensive Logging** and troubleshooting
- ✅ **Performance Monitoring** and optimization
- ✅ **Task Orchestration** and management

**The system is ready for production use!** 🚀✨

*Last updated: April 20, 2026*