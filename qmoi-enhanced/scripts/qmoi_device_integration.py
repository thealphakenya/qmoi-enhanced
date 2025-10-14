#!/usr/bin/env python3
"""
QMOI Device Integration System
Integrates device ownership detection and unlock systems for comprehensive device liberation.
Provides unified interface for QMOI's device management features.
"""

import os
import sys
import json
import logging
import asyncio
import time
from datetime import datetime
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
import requests
import threading
import queue

# Add scripts directory to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from device_ownership_detector import DeviceOwnershipDetector, DeviceRestriction
from device_unlock_system import DeviceUnlockSystem, UnlockResult

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class DeviceStatus:
    """Current device status"""
    is_restricted: bool
    restrictions: List[DeviceRestriction]
    unlock_attempts: List[UnlockResult]
    last_detection: datetime
    last_unlock: Optional[datetime]
    device_info: Dict[str, Any]
    qmoi_master_mode: bool

@dataclass
class IntegrationConfig:
    """Configuration for device integration"""
    auto_detection_enabled: bool
    detection_interval: int  # seconds
    auto_unlock_enabled: bool
    master_mode_enabled: bool
    notification_enabled: bool
    log_level: str

class QMOIDeviceIntegration:
    """Main integration class for QMOI device management"""
    
    def __init__(self, config: Optional[IntegrationConfig] = None):
        self.config = config or IntegrationConfig(
            auto_detection_enabled=True,
            detection_interval=300,  # 5 minutes
            auto_unlock_enabled=False,
            master_mode_enabled=True,
            notification_enabled=True,
            log_level="INFO"
        )
        
        self.detector = DeviceOwnershipDetector()
        self.unlock_system = DeviceUnlockSystem()
        self.device_status = DeviceStatus(
            is_restricted=False,
            restrictions=[],
            unlock_attempts=[],
            last_detection=datetime.now(),
            last_unlock=None,
            device_info={},
            qmoi_master_mode=False
        )
        
        self.detection_queue = queue.Queue()
        self.unlock_queue = queue.Queue()
        self.running = False
        self.detection_thread = None
        self.unlock_thread = None
        
    def start_integration(self):
        """Start the device integration system"""
        logger.info("🚀 Starting QMOI Device Integration System...")
        self.running = True
        
        # Start detection thread
        if self.config.auto_detection_enabled:
            self.detection_thread = threading.Thread(target=self._detection_worker, daemon=True)
            self.detection_thread.start()
            logger.info("🔍 Detection worker started")
        
        # Start unlock thread
        self.unlock_thread = threading.Thread(target=self._unlock_worker, daemon=True)
        self.unlock_thread.start()
        logger.info("🔓 Unlock worker started")
        
        # Initial detection
        self._perform_detection()
        
        logger.info("✅ QMOI Device Integration System started successfully")
    
    def stop_integration(self):
        """Stop the device integration system"""
        logger.info("🛑 Stopping QMOI Device Integration System...")
        self.running = False
        
        if self.detection_thread:
            self.detection_thread.join(timeout=5)
        
        if self.unlock_thread:
            self.unlock_thread.join(timeout=5)
        
        logger.info("✅ QMOI Device Integration System stopped")
    
    def _detection_worker(self):
        """Background worker for device detection"""
        while self.running:
            try:
                # Wait for detection interval
                time.sleep(self.config.detection_interval)
                
                if self.running:
                    self._perform_detection()
                    
            except Exception as e:
                logger.error(f"Error in detection worker: {e}")
                time.sleep(10)  # Wait before retrying
    
    def _unlock_worker(self):
        """Background worker for device unlock"""
        while self.running:
            try:
                # Wait for unlock requests
                try:
                    unlock_request = self.unlock_queue.get(timeout=1)
                    self._process_unlock_request(unlock_request)
                except queue.Empty:
                    continue
                    
            except Exception as e:
                logger.error(f"Error in unlock worker: {e}")
                time.sleep(5)  # Wait before retrying
    
    def _perform_detection(self):
        """Perform device restriction detection"""
        try:
            logger.info("🔍 Performing device restriction detection...")
            
            # Detect restrictions
            restrictions = self.detector.detect_all_restrictions()
            
            # Update device status
            self.device_status.restrictions = restrictions
            self.device_status.is_restricted = len(restrictions) > 0
            self.device_status.last_detection = datetime.now()
            self.device_status.device_info = self.detector.device_info
            
            # Log detection results
            if restrictions:
                logger.warning(f"🚨 Found {len(restrictions)} device restriction(s):")
                for restriction in restrictions:
                    logger.warning(f"  - {restriction.organization}: {restriction.description} ({restriction.severity})")
                
                # Auto-unlock if enabled
                if self.config.auto_unlock_enabled:
                    logger.info("🔓 Auto-unlock enabled, triggering unlock...")
                    self._queue_unlock_request("auto", restrictions)
            else:
                logger.info("✅ No device restrictions detected")
            
            # Generate detection report
            detection_report = self.detector.generate_detection_report()
            self._save_report("detection", detection_report)
            
        except Exception as e:
            logger.error(f"Error during detection: {e}")
    
    def _queue_unlock_request(self, request_type: str, restrictions: List[DeviceRestriction]):
        """Queue an unlock request"""
        unlock_request = {
            'type': request_type,
            'restrictions': restrictions,
            'timestamp': datetime.now(),
            'request_id': f"unlock_{int(time.time())}"
        }
        
        self.unlock_queue.put(unlock_request)
        logger.info(f"🔓 Queued unlock request: {request_type}")
    
    def _process_unlock_request(self, request: Dict[str, Any]):
        """Process an unlock request"""
        try:
            request_type = request['type']
            restrictions = request['restrictions']
            
            logger.info(f"🔓 Processing unlock request: {request_type}")
            
            unlock_results = []
            
            # Process each restriction
            for restriction in restrictions:
                logger.info(f"🔓 Unlocking {restriction.organization} restrictions...")
                
                # Choose unlock method based on restriction type
                if restriction.type == 'mkopa':
                    result = self.unlock_system.unlock_mkopa_device()
                elif restriction.type == 'watu':
                    result = self.unlock_system.unlock_watu_device()
                else:
                    result = self.unlock_system.unlock_generic_device(restriction.organization)
                
                unlock_results.append(result)
                
                if result.success:
                    logger.info(f"✅ Successfully unlocked {restriction.organization}")
                else:
                    logger.error(f"❌ Failed to unlock {restriction.organization}: {result.message}")
            
            # Enable master mode if requested
            if self.config.master_mode_enabled:
                logger.info("👑 Enabling QMOI master mode...")
                master_result = self.unlock_system.enable_master_mode()
                unlock_results.append(master_result)
                
                if master_result.success:
                    self.device_status.qmoi_master_mode = True
                    logger.info("✅ QMOI master mode enabled")
                else:
                    logger.error(f"❌ Failed to enable master mode: {master_result.message}")
            
            # Update device status
            self.device_status.unlock_attempts.extend(unlock_results)
            self.device_status.last_unlock = datetime.now()
            
            # Generate unlock report
            unlock_report = self.unlock_system.generate_unlock_report()
            self._save_report("unlock", unlock_report)
            
            # Send notifications
            if self.config.notification_enabled:
                self._send_notifications(unlock_results)
            
            logger.info(f"✅ Unlock request completed: {len([r for r in unlock_results if r.success])}/{len(unlock_results)} successful")
            
        except Exception as e:
            logger.error(f"Error processing unlock request: {e}")
    
    def _save_report(self, report_type: str, report: Dict[str, Any]):
        """Save a report to file"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"qmoi_device_{report_type}_report_{timestamp}.json"
            filepath = os.path.join("reports", filename)
            
            # Ensure reports directory exists
            os.makedirs("reports", exist_ok=True)
            
            with open(filepath, 'w') as f:
                json.dump(report, f, indent=2)
            
            logger.info(f"📊 {report_type.capitalize()} report saved: {filename}")
            
        except Exception as e:
            logger.error(f"Error saving {report_type} report: {e}")
    
    def _send_notifications(self, unlock_results: List[UnlockResult]):
        """Send notifications about unlock results"""
        try:
            success_count = len([r for r in unlock_results if r.success])
            total_count = len(unlock_results)
            
            if success_count == total_count:
                message = f"🎉 Device successfully liberated! All {total_count} unlock attempts succeeded."
            elif success_count > 0:
                message = f"⚠️ Partial success: {success_count}/{total_count} unlock attempts succeeded."
            else:
                message = f"❌ Unlock failed: All {total_count} unlock attempts failed."
            
            # Send to various notification channels
            self._send_whatsapp_notification(message)
            self._send_email_notification(message)
            self._send_dashboard_notification(message)
            
        except Exception as e:
            logger.error(f"Error sending notifications: {e}")
    
    def _send_whatsapp_notification(self, message: str):
        """Send WhatsApp notification"""
        try:
            # This would integrate with WhatsApp API
            logger.info(f"📱 WhatsApp notification: {message}")
        except Exception as e:
            logger.error(f"Error sending WhatsApp notification: {e}")
    
    def _send_email_notification(self, message: str):
        """Send email notification"""
        try:
            # This would integrate with email service
            logger.info(f"📧 Email notification: {message}")
        except Exception as e:
            logger.error(f"Error sending email notification: {e}")
    
    def _send_dashboard_notification(self, message: str):
        """Send dashboard notification"""
        try:
            # This would update the QMOI dashboard
            logger.info(f"📊 Dashboard notification: {message}")
        except Exception as e:
            logger.error(f"Error sending dashboard notification: {e}")
    
    def get_device_status(self) -> DeviceStatus:
        """Get current device status"""
        return self.device_status
    
    def trigger_manual_detection(self) -> List[DeviceRestriction]:
        """Trigger manual device detection"""
        logger.info("🔍 Triggering manual device detection...")
        self._perform_detection()
        return self.device_status.restrictions
    
    def trigger_manual_unlock(self, restrictions: Optional[List[DeviceRestriction]] = None):
        """Trigger manual device unlock"""
        if restrictions is None:
            restrictions = self.device_status.restrictions
        
        if restrictions:
            logger.info("🔓 Triggering manual device unlock...")
            self._queue_unlock_request("manual", restrictions)
        else:
            logger.info("✅ No restrictions to unlock")
    
    def enable_master_mode(self) -> UnlockResult:
        """Enable QMOI master mode"""
        logger.info("👑 Enabling QMOI master mode...")
        result = self.unlock_system.enable_master_mode()
        
        if result.success:
            self.device_status.qmoi_master_mode = True
            logger.info("✅ QMOI master mode enabled successfully")
        else:
            logger.error(f"❌ Failed to enable master mode: {result.message}")
        
        return result
    
    def get_detection_report(self) -> Dict[str, Any]:
        """Get detection report"""
        return self.detector.generate_detection_report()
    
    def get_unlock_report(self) -> Dict[str, Any]:
        """Get unlock report"""
        return self.unlock_system.generate_unlock_report()
    
    def get_integration_status(self) -> Dict[str, Any]:
        """Get integration system status"""
        return {
            'running': self.running,
            'config': {
                'auto_detection_enabled': self.config.auto_detection_enabled,
                'detection_interval': self.config.detection_interval,
                'auto_unlock_enabled': self.config.auto_unlock_enabled,
                'master_mode_enabled': self.config.master_mode_enabled,
                'notification_enabled': self.config.notification_enabled
            },
            'device_status': {
                'is_restricted': self.device_status.is_restricted,
                'restriction_count': len(self.device_status.restrictions),
                'unlock_attempt_count': len(self.device_status.unlock_attempts),
                'qmoi_master_mode': self.device_status.qmoi_master_mode,
                'last_detection': self.device_status.last_detection.isoformat(),
                'last_unlock': self.device_status.last_unlock.isoformat() if self.device_status.last_unlock else None
            },
            'threads': {
                'detection_thread_alive': self.detection_thread.is_alive() if self.detection_thread else False,
                'unlock_thread_alive': self.unlock_thread.is_alive() if self.unlock_thread else False
            }
        }

def create_integration_api():
    """Create API endpoints for device integration"""
    try:
        from flask import Flask, request, jsonify
        
        app = Flask(__name__)
        integration = QMOIDeviceIntegration()
        
        @app.route('/api/device/status', methods=['GET'])
        def get_device_status():
            """Get current device status"""
            status = integration.get_device_status()
            return jsonify({
                'is_restricted': status.is_restricted,
                'restrictions': [
                    {
                        'type': r.type,
                        'severity': r.severity,
                        'description': r.description,
                        'organization': r.organization,
                        'restrictions': r.restrictions,
                        'unlock_methods': r.unlock_methods,
                        'detected_at': r.detected_at.isoformat()
                    }
                    for r in status.restrictions
                ],
                'qmoi_master_mode': status.qmoi_master_mode,
                'last_detection': status.last_detection.isoformat(),
                'last_unlock': status.last_unlock.isoformat() if status.last_unlock else None
            })
        
        @app.route('/api/device/detect', methods=['POST'])
        def trigger_detection():
            """Trigger manual device detection"""
            restrictions = integration.trigger_manual_detection()
            return jsonify({
                'success': True,
                'restrictions_found': len(restrictions),
                'restrictions': [
                    {
                        'type': r.type,
                        'severity': r.severity,
                        'description': r.description,
                        'organization': r.organization
                    }
                    for r in restrictions
                ]
            })
        
        @app.route('/api/device/unlock', methods=['POST'])
        def trigger_unlock():
            """Trigger manual device unlock"""
            data = request.get_json()
            restrictions = data.get('restrictions', [])
            
            integration.trigger_manual_unlock(restrictions)
            return jsonify({
                'success': True,
                'message': 'Unlock request queued'
            })
        
        @app.route('/api/device/master-mode', methods=['POST'])
        def enable_master_mode():
            """Enable QMOI master mode"""
            result = integration.enable_master_mode()
            return jsonify({
                'success': result.success,
                'message': result.message,
                'method_used': result.method_used,
                'duration_seconds': result.duration_seconds,
                'errors': result.errors,
                'warnings': result.warnings
            })
        
        @app.route('/api/device/reports/detection', methods=['GET'])
        def get_detection_report():
            """Get detection report"""
            report = integration.get_detection_report()
            return jsonify(report)
        
        @app.route('/api/device/reports/unlock', methods=['GET'])
        def get_unlock_report():
            """Get unlock report"""
            report = integration.get_unlock_report()
            return jsonify(report)
        
        @app.route('/api/device/status/integration', methods=['GET'])
        def get_integration_status():
            """Get integration system status"""
            status = integration.get_integration_status()
            return jsonify(status)
        
        return app
        
    except ImportError:
        logger.error("Flask not available, API endpoints not created")
        return None

def main():
    """Main function to run device integration"""
    try:
        logger.info("🚀 Starting QMOI Device Integration System...")
        
        # Create integration system
        integration = QMOIDeviceIntegration()
        
        # Start integration
        integration.start_integration()
        
        # Keep running
        try:
            while True:
                time.sleep(60)  # Check every minute
                
                # Log status periodically
                status = integration.get_integration_status()
                if status['running']:
                    logger.info(f"✅ Integration running - Restrictions: {status['device_status']['restriction_count']}, Master Mode: {status['device_status']['qmoi_master_mode']}")
                
        except KeyboardInterrupt:
            logger.info("🛑 Received interrupt signal")
        finally:
            integration.stop_integration()
        
    except Exception as e:
        logger.error(f"❌ Error in device integration: {e}")

if __name__ == "__main__":
    main() 