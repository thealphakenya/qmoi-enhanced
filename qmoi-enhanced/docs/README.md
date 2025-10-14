# Q-City Documentation

## Overview

Q-City is a comprehensive system management and monitoring platform that provides advanced features for network management, resource optimization, and system monitoring. This documentation provides detailed information about the system's features, architecture, and usage.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Network Management](#network-management)
7. [Resource Optimization](#resource-optimization)
8. [Error Handling](#error-handling)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Features

### Core Features

- **Network Management**
  - Automatic WiFi connection
  - Network topology visualization
  - Connection quality monitoring
  - Network profile management
  - Zero-rated connection support

- **Resource Monitoring**
  - Real-time CPU usage tracking
  - Memory utilization monitoring
  - Disk space management
  - Network bandwidth monitoring
  - Resource usage history

- **System Optimization**
  - Automatic resource optimization
  - Performance tuning
  - Memory management
  - Disk cleanup
  - Network optimization

- **Error Detection and Recovery**
  - Comprehensive error scanning
  - Automatic error fixing
  - Error reporting
  - System health monitoring
  - Backup management

### UI Features

- **Modern Interface**
  - Dark/Light theme support
  - Responsive design
  - Real-time updates
  - Interactive graphs
  - Customizable layout

- **Dashboard**
  - System status overview
  - Resource usage graphs
  - Network status
  - Active tasks
  - Quick actions

- **Network Management**
  - Network topology view
  - Connection status
  - Available networks
  - Network search
  - Connection settings

- **Resource Monitoring**
  - Real-time graphs
  - Historical data
  - Resource limits
  - Performance metrics
  - Alert system

## Architecture

### System Components

1. **UI Layer**
   - `qcity_ui_enhancement.py`: Main UI implementation
   - `styles.css`: UI styling
   - `assets/`: UI resources

2. **Network Layer**
   - `wifi_manager.py`: WiFi connection management
   - `network_monitor.py`: Network monitoring
   - `connection_optimizer.py`: Network optimization

3. **Resource Layer**
   - `resource_monitor.py`: Resource monitoring
   - `optimization_manager.py`: Resource optimization
   - `performance_tuner.py`: Performance tuning

4. **Error Handling Layer**
   - `error_fixer.py`: Error detection and fixing
   - `error_reporter.py`: Error reporting
   - `backup_manager.py`: Backup management

5. **Deployment Layer**
   - `deploy.py`: Deployment management
   - `config_manager.py`: Configuration management
   - `update_manager.py`: Update management

### Data Flow

1. **Network Management**

   ```
   User Interface -> WiFi Manager -> Network Monitor -> Connection Optimizer
   ```

2. **Resource Monitoring**

   ```
   Resource Monitor -> Performance Tuner -> Optimization Manager -> UI Update
   ```

3. **Error Handling**
   ```
   Error Scanner -> Error Fixer -> Error Reporter -> Backup Manager
   ```

## Installation

### Prerequisites

- Python 3.8 or higher
- Windows 10/11
- Administrator privileges
- Network adapter with WiFi capability

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/q-city.git
   cd q-city
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Initialize configuration:

   ```bash
   python scripts/setup.py
   ```

4. Start Q-City:
   ```bash
   python scripts/main.py
   ```

## Configuration

### Configuration Files

1. **Main Configuration** (`config/qcity_config.json`)

   ```json
   {
     "version": "1.0.0",
     "environment": "production",
     "theme": "dark",
     "auto_connect": true,
     "resource_limits": {
       "cpu": 80,
       "memory": 80,
       "disk": 80
     }
   }
   ```

2. **Network Configuration** (`config/network_config.json`)

   ```json
   {
     "auto_connect": true,
     "saved_networks": [],
     "connection_timeout": 30,
     "retry_attempts": 3
   }
   ```

3. **Resource Configuration** (`config/resource_config.json`)
   ```json
   {
     "monitoring_interval": 1,
     "optimization_threshold": 80,
     "cleanup_schedule": "daily"
   }
   ```

## Usage

### Starting Q-City

1. **Normal Start**

   ```bash
   python scripts/main.py
   ```

2. **Debug Mode**

   ```bash
   python scripts/main.py --debug
   ```

3. **Custom Config**
   ```bash
   python scripts/main.py --config path/to/config.json
   ```

### Using the UI

1. **Dashboard**
   - View system status
   - Monitor resources
   - Check network status
   - Manage tasks

2. **Network Management**
   - Connect to networks
   - View network topology
   - Monitor connection quality
   - Manage network profiles

3. **Resource Monitoring**
   - View resource usage
   - Set resource limits
   - Monitor performance
   - Optimize resources

4. **Error Management**
   - View error reports
   - Fix errors automatically
   - Manage backups
   - Monitor system health

## Network Management

### WiFi Connection

1. **Automatic Connection**
   - Saves network profiles
   - Auto-connects on startup
   - Handles connection failures
   - Manages multiple networks

2. **Connection Quality**
   - Monitors signal strength
   - Tracks connection stability
   - Optimizes connection settings
   - Handles interference

3. **Network Profiles**
   - Saves network credentials
   - Manages connection priorities
   - Handles network switching
   - Supports zero-rated networks

### Network Optimization

1. **Connection Optimization**
   - Bandwidth management
   - Latency optimization
   - Connection stability
   - Network prioritization

2. **Zero-Rated Support**
   - Identifies zero-rated networks
   - Manages data usage
   - Optimizes for zero-rated
   - Handles network switching

## Resource Optimization

### CPU Optimization

1. **Usage Monitoring**
   - Real-time CPU tracking
   - Process management
   - Load balancing
   - Performance tuning

2. **Optimization Features**
   - Automatic throttling
   - Process prioritization
   - Temperature management
   - Power optimization

### Memory Management

1. **Memory Monitoring**
   - Usage tracking
   - Leak detection
   - Page file management
   - Cache optimization

2. **Optimization Features**
   - Automatic cleanup
   - Memory defragmentation
   - Cache management
   - Virtual memory tuning

### Disk Management

1. **Disk Monitoring**
   - Space tracking
   - I/O monitoring
   - Health checking
   - Performance tracking

2. **Optimization Features**
   - Automatic cleanup
   - Defragmentation
   - Cache management
   - I/O optimization

## Error Handling

### Error Detection

1. **System Errors**
   - Hardware errors
   - Software errors
   - Network errors
   - Resource errors

2. **Error Categories**
   - Critical errors
   - Warning errors
   - Information errors
   - Debug errors

### Error Recovery

1. **Automatic Recovery**
   - Error fixing
   - System restoration
   - Backup recovery
   - Configuration repair

2. **Manual Recovery**
   - Error reporting
   - Recovery options
   - System restore
   - Configuration reset

## Deployment

### Deployment Options

1. **Local Deployment**
   - Single machine
   - Multiple machines
   - Network deployment
   - Custom deployment

2. **Cloud Deployment**
   - AWS deployment
   - Azure deployment
   - GCP deployment
   - Custom cloud

### Deployment Process

1. **Preparation**
   - System requirements
   - Network setup
   - Configuration
   - Backup

2. **Deployment Steps**
   - Installation
   - Configuration
   - Testing
   - Monitoring

## Troubleshooting

### Common Issues

1. **Network Issues**
   - Connection failures
   - Slow connections
   - Interference
   - Configuration problems

2. **Resource Issues**
   - High CPU usage
   - Memory leaks
   - Disk space
   - Performance problems

3. **System Issues**
   - Crashes
   - Freezes
   - Errors
   - Configuration problems

### Solutions

1. **Network Solutions**
   - Connection reset
   - Network reset
   - Configuration fix
   - Driver update

2. **Resource Solutions**
   - Process management
   - Memory cleanup
   - Disk cleanup
   - Performance tuning

3. **System Solutions**
   - System restore
   - Configuration reset
   - Update installation
   - Clean installation

## Support

### Getting Help

1. **Documentation**
   - User guide
   - API documentation
   - Troubleshooting guide
   - FAQ

2. **Support Channels**
   - Email support
   - Forum support
   - Chat support
   - Phone support

### Contributing

1. **Development**
   - Code contribution
   - Bug reporting
   - Feature requests
   - Documentation

2. **Community**
   - User forum
   - Developer forum
   - Bug tracker
   - Feature requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## QMOI Permission Self-Healing, Notification, and Audit System

QMOI now features robust self-healing and notification for file permissions:

- **Automatic Permission Self-Healing:** Checks and fixes its own and critical files' permissions at startup and every 10 minutes.
- **Multi-Channel Notifications:** Notifies the master via desktop, WhatsApp, and email (configurable in `config/qmoi_config.json`).
- **Audit Logging:** All actions are logged in `logs/qmoi_permission_audit.log`.

### Configuration

See `config/qmoi_config.json` for notification and email settings.

### Manual Fix

Run `python scripts/qmoi_permission_fix.py` to manually fix permissions.

### Audit Log

See `logs/qmoi_permission_audit.log` for a full trace of permission and notification actions.
