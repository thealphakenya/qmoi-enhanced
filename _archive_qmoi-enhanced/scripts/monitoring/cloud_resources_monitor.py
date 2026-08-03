#!/usr/bin/env python3
"""
QMOI Cloud Resources Monitor
Comprehensive cloud resources monitoring for AWS, Azure, Google Cloud, and other providers.
Tracks compute, storage, networking, costs, and performance metrics.
"""

import os
import sys
import json
import time
import logging
import threading
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import requests
import psutil
import boto3
from azure.mgmt.compute import ComputeManagementClient
from azure.identity import DefaultAzureCredential
from google.cloud import compute_v1
from google.auth import default

class CloudResourcesMonitor:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.monitoring_active = False
        self.cloud_providers = {}
        self.resource_metrics = {}
        self.cost_data = {}
        self.performance_data = {}
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/cloud_resources_monitor.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def load_config(self) -> Dict[str, Any]:
        """Load monitoring configuration"""
        config = {
            'monitoring_interval': 300,  # 5 minutes
            'providers': {
                'aws': {
                    'enabled': True,
                    'regions': ['us-east-1', 'us-west-2', 'eu-west-1'],
                    'services': ['ec2', 's3', 'rds', 'lambda', 'cloudwatch']
                },
                'azure': {
                    'enabled': True,
                    'subscriptions': [],
                    'services': ['compute', 'storage', 'database', 'network']
                },
                'gcp': {
                    'enabled': True,
                    'projects': [],
                    'services': ['compute', 'storage', 'sql', 'network']
                }
            },
            'alerts': {
                'cost_threshold': 1000,  # USD
                'cpu_threshold': 80,     # %
                'memory_threshold': 85,  # %
                'storage_threshold': 90  # %
            }
        }
        
        # Load from config file if exists
        config_file = 'config/cloud_monitoring_config.json'
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")
        
        return config
    
    def initialize_cloud_providers(self):
        """Initialize cloud provider clients"""
        try:
            # AWS
            if self.config['providers']['aws']['enabled']:
                self.cloud_providers['aws'] = {
                    'ec2': boto3.client('ec2'),
                    's3': boto3.client('s3'),
                    'rds': boto3.client('rds'),
                    'lambda': boto3.client('lambda'),
                    'cloudwatch': boto3.client('cloudwatch'),
                    'ce': boto3.client('ce')  # Cost Explorer
                }
                self.logger.info("AWS clients initialized")
            
            # Azure
            if self.config['providers']['azure']['enabled']:
                try:
                    credential = DefaultAzureCredential()
                    self.cloud_providers['azure'] = {
                        'compute': ComputeManagementClient(credential, subscription_id=None),
                        'credential': credential
                    }
                    self.logger.info("Azure clients initialized")
                except Exception as e:
                    self.logger.warning(f"Azure initialization failed: {e}")
            
            # Google Cloud
            if self.config['providers']['gcp']['enabled']:
                try:
                    credentials, project = default()
                    self.cloud_providers['gcp'] = {
                        'compute': compute_v1.InstancesClient(credentials=credentials),
                        'project': project
                    }
                    self.logger.info("Google Cloud clients initialized")
                except Exception as e:
                    self.logger.warning(f"Google Cloud initialization failed: {e}")
                    
        except Exception as e:
            self.logger.error(f"Error initializing cloud providers: {e}")
    
    def start_monitoring(self):
        """Start cloud resources monitoring"""
        try:
            self.monitoring_active = True
            self.initialize_cloud_providers()
            
            # Start monitoring threads
            threads = []
            
            # AWS monitoring
            if 'aws' in self.cloud_providers:
                threads.append(threading.Thread(target=self.monitor_aws_resources))
            
            # Azure monitoring
            if 'azure' in self.cloud_providers:
                threads.append(threading.Thread(target=self.monitor_azure_resources))
            
            # Google Cloud monitoring
            if 'gcp' in self.cloud_providers:
                threads.append(threading.Thread(target=self.monitor_gcp_resources))
            
            # Cost monitoring
            threads.append(threading.Thread(target=self.monitor_costs))
            
            # Performance monitoring
            threads.append(threading.Thread(target=self.monitor_performance))
            
            # Start all threads
            for thread in threads:
                thread.daemon = True
                thread.start()
            
            self.logger.info(f"Cloud resources monitoring started with {len(threads)} threads")
            
        except Exception as e:
            self.logger.error(f"Error starting cloud monitoring: {e}")
    
    def stop_monitoring(self):
        """Stop cloud resources monitoring"""
        self.monitoring_active = False
        self.logger.info("Cloud resources monitoring stopped")
    
    def monitor_aws_resources(self):
        """Monitor AWS resources"""
        while self.monitoring_active:
            try:
                aws_data = {
                    'timestamp': datetime.now().isoformat(),
                    'provider': 'aws',
                    'resources': {}
                }
                
                # EC2 instances
                try:
                    ec2_response = self.cloud_providers['aws']['ec2'].describe_instances()
                    instances = []
                    for reservation in ec2_response['Reservations']:
                        for instance in reservation['Instances']:
                            instances.append({
                                'id': instance['InstanceId'],
                                'type': instance['InstanceType'],
                                'state': instance['State']['Name'],
                                'launch_time': instance['LaunchTime'].isoformat(),
                                'tags': instance.get('Tags', [])
                            })
                    aws_data['resources']['ec2'] = instances
                except Exception as e:
                    self.logger.error(f"Error monitoring AWS EC2: {e}")
                
                # S3 buckets
                try:
                    s3_response = self.cloud_providers['aws']['s3'].list_buckets()
                    buckets = []
                    for bucket in s3_response['Buckets']:
                        try:
                            # Get bucket size
                            size = 0
                            objects = self.cloud_providers['aws']['s3'].list_objects_v2(Bucket=bucket['Name'])
                            for obj in objects.get('Contents', []):
                                size += obj['Size']
                            
                            buckets.append({
                                'name': bucket['Name'],
                                'creation_date': bucket['CreationDate'].isoformat(),
                                'size_bytes': size
                            })
                        except Exception as e:
                            self.logger.warning(f"Error getting S3 bucket details for {bucket['Name']}: {e}")
                    
                    aws_data['resources']['s3'] = buckets
                except Exception as e:
                    self.logger.error(f"Error monitoring AWS S3: {e}")
                
                # RDS instances
                try:
                    rds_response = self.cloud_providers['aws']['rds'].describe_db_instances()
                    rds_instances = []
                    for instance in rds_response['DBInstances']:
                        rds_instances.append({
                            'id': instance['DBInstanceIdentifier'],
                            'engine': instance['Engine'],
                            'status': instance['DBInstanceStatus'],
                            'size': instance['DBInstanceClass']
                        })
                    aws_data['resources']['rds'] = rds_instances
                except Exception as e:
                    self.logger.error(f"Error monitoring AWS RDS: {e}")
                
                # Lambda functions
                try:
                    lambda_response = self.cloud_providers['aws']['lambda'].list_functions()
                    functions = []
                    for function in lambda_response['Functions']:
                        functions.append({
                            'name': function['FunctionName'],
                            'runtime': function['Runtime'],
                            'memory_size': function['MemorySize'],
                            'timeout': function['Timeout']
                        })
                    aws_data['resources']['lambda'] = functions
                except Exception as e:
                    self.logger.error(f"Error monitoring AWS Lambda: {e}")
                
                self.resource_metrics['aws'] = aws_data
                
            except Exception as e:
                self.logger.error(f"Error in AWS monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'])
    
    def monitor_azure_resources(self):
        """Monitor Azure resources"""
        while self.monitoring_active:
            try:
                azure_data = {
                    'timestamp': datetime.now().isoformat(),
                    'provider': 'azure',
                    'resources': {}
                }
                
                # Get subscriptions
                try:
                    from azure.mgmt.resource import ResourceManagementClient
                    resource_client = ResourceManagementClient(
                        self.cloud_providers['azure']['credential'], 
                        subscription_id=None
                    )
                    
                    subscriptions = resource_client.subscriptions.list()
                    for subscription in subscriptions:
                        # Get VMs in subscription
                        compute_client = ComputeManagementClient(
                            self.cloud_providers['azure']['credential'],
                            subscription.subscription_id
                        )
                        
                        vms = []
                        for vm in compute_client.virtual_machines.list_all():
                            vms.append({
                                'id': vm.id,
                                'name': vm.name,
                                'location': vm.location,
                                'vm_size': vm.hardware_profile.vm_size,
                                'provisioning_state': vm.provisioning_state
                            })
                        
                        azure_data['resources'][subscription.subscription_id] = {
                            'vms': vms
                        }
                        
                except Exception as e:
                    self.logger.error(f"Error monitoring Azure resources: {e}")
                
                self.resource_metrics['azure'] = azure_data
                
            except Exception as e:
                self.logger.error(f"Error in Azure monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'])
    
    def monitor_gcp_resources(self):
        """Monitor Google Cloud resources"""
        while self.monitoring_active:
            try:
                gcp_data = {
                    'timestamp': datetime.now().isoformat(),
                    'provider': 'gcp',
                    'resources': {}
                }
                
                # Get compute instances
                try:
                    instances = []
                    request = compute_v1.ListInstancesRequest(
                        project=self.cloud_providers['gcp']['project']
                    )
                    
                    for instance in self.cloud_providers['gcp']['compute'].list(request=request):
                        instances.append({
                            'id': instance.id,
                            'name': instance.name,
                            'zone': instance.zone.split('/')[-1],
                            'machine_type': instance.machine_type.split('/')[-1],
                            'status': instance.status
                        })
                    
                    gcp_data['resources']['compute'] = instances
                    
                except Exception as e:
                    self.logger.error(f"Error monitoring GCP compute: {e}")
                
                self.resource_metrics['gcp'] = gcp_data
                
            except Exception as e:
                self.logger.error(f"Error in GCP monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'])
    
    def monitor_costs(self):
        """Monitor cloud costs"""
        while self.monitoring_active:
            try:
                cost_data = {
                    'timestamp': datetime.now().isoformat(),
                    'costs': {}
                }
                
                # AWS costs
                if 'aws' in self.cloud_providers:
                    try:
                        end_date = datetime.now()
                        start_date = end_date - timedelta(days=30)
                        
                        cost_response = self.cloud_providers['aws']['ce'].get_cost_and_usage(
                            TimePeriod={
                                'Start': start_date.strftime('%Y-%m-%d'),
                                'End': end_date.strftime('%Y-%m-%d')
                            },
                            Granularity='MONTHLY',
                            Metrics=['UnblendedCost']
                        )
                        
                        if cost_response['ResultsByTime']:
                            cost = cost_response['ResultsByTime'][0]['Total']['UnblendedCost']['Amount']
                            cost_data['costs']['aws'] = {
                                'amount': float(cost),
                                'currency': cost_response['ResultsByTime'][0]['Total']['UnblendedCost']['Unit']
                            }
                            
                            # Check cost threshold
                            if float(cost) > self.config['alerts']['cost_threshold']:
                                self.logger.warning(f"AWS cost threshold exceeded: ${cost}")
                                
                    except Exception as e:
                        self.logger.error(f"Error monitoring AWS costs: {e}")
                
                self.cost_data = cost_data
                
            except Exception as e:
                self.logger.error(f"Error in cost monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'] * 2)  # Check costs less frequently
    
    def monitor_performance(self):
        """Monitor cloud performance metrics"""
        while self.monitoring_active:
            try:
                performance_data = {
                    'timestamp': datetime.now().isoformat(),
                    'metrics': {}
                }
                
                # AWS CloudWatch metrics
                if 'aws' in self.cloud_providers:
                    try:
                        # Get EC2 CPU utilization
                        cw_response = self.cloud_providers['aws']['cloudwatch'].get_metric_statistics(
                            Namespace='AWS/EC2',
                            MetricName='CPUUtilization',
                            Dimensions=[{'Name': 'InstanceId', 'Value': 'i-1234567890abcdef0'}],
                            StartTime=datetime.now() - timedelta(hours=1),
                            EndTime=datetime.now(),
                            Period=300,
                            Statistics=['Average']
                        )
                        
                        if cw_response['Datapoints']:
                            cpu_avg = cw_response['Datapoints'][0]['Average']
                            performance_data['metrics']['aws_cpu'] = cpu_avg
                            
                            if cpu_avg > self.config['alerts']['cpu_threshold']:
                                self.logger.warning(f"AWS CPU threshold exceeded: {cpu_avg}%")
                                
                    except Exception as e:
                        self.logger.error(f"Error monitoring AWS performance: {e}")
                
                self.performance_data = performance_data
                
            except Exception as e:
                self.logger.error(f"Error in performance monitoring: {e}")
            
            time.sleep(self.config['monitoring_interval'])
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive cloud resources report"""
        try:
            report = {
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_instances': 0,
                    'total_storage_gb': 0,
                    'total_cost_usd': 0,
                    'alerts': []
                },
                'providers': {},
                'recommendations': []
            }
            
            # Process AWS data
            if 'aws' in self.resource_metrics:
                aws_data = self.resource_metrics['aws']
                report['providers']['aws'] = {
                    'instances': len(aws_data.get('resources', {}).get('ec2', [])),
                    'buckets': len(aws_data.get('resources', {}).get('s3', [])),
                    'databases': len(aws_data.get('resources', {}).get('rds', [])),
                    'functions': len(aws_data.get('resources', {}).get('lambda', []))
                }
                report['summary']['total_instances'] += report['providers']['aws']['instances']
            
            # Process Azure data
            if 'azure' in self.resource_metrics:
                azure_data = self.resource_metrics['azure']
                total_azure_vms = 0
                for sub_data in azure_data.get('resources', {}).values():
                    total_azure_vms += len(sub_data.get('vms', []))
                
                report['providers']['azure'] = {
                    'instances': total_azure_vms
                }
                report['summary']['total_instances'] += total_azure_vms
            
            # Process GCP data
            if 'gcp' in self.resource_metrics:
                gcp_data = self.resource_metrics['gcp']
                report['providers']['gcp'] = {
                    'instances': len(gcp_data.get('resources', {}).get('compute', []))
                }
                report['summary']['total_instances'] += report['providers']['gcp']['instances']
            
            # Process cost data
            if self.cost_data:
                total_cost = 0
                for provider_costs in self.cost_data.get('costs', {}).values():
                    total_cost += provider_costs.get('amount', 0)
                report['summary']['total_cost_usd'] = total_cost
            
            # Generate recommendations
            if report['summary']['total_cost_usd'] > self.config['alerts']['cost_threshold']:
                report['recommendations'].append({
                    'type': 'cost_optimization',
                    'priority': 'high',
                    'message': f"Total cloud costs (${report['summary']['total_cost_usd']:.2f}) exceed threshold. Consider resource optimization."
                })
            
            if report['summary']['total_instances'] > 50:
                report['recommendations'].append({
                    'type': 'resource_management',
                    'priority': 'medium',
                    'message': f"High number of instances ({report['summary']['total_instances']}). Review for unused resources."
                })
            
            return report
            
        except Exception as e:
            self.logger.error(f"Error generating report: {e}")
            return {}
    
    def save_report(self, report: Dict[str, Any]):
        """Save monitoring report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            report_file = f'logs/cloud_resources_report_{timestamp}.json'
            
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            
            # Save latest report
            with open('logs/cloud_resources_latest.json', 'w') as f:
                json.dump(report, f, indent=2)
            
            self.logger.info(f"Cloud resources report saved: {report_file}")
            
        except Exception as e:
            self.logger.error(f"Error saving report: {e}")
    
    def run(self):
        """Main monitoring loop"""
        try:
            self.logger.info("Starting QMOI Cloud Resources Monitor")
            self.start_monitoring()
            
            # Generate reports periodically
            while self.monitoring_active:
                time.sleep(3600)  # Generate report every hour
                
                if self.monitoring_active:
                    report = self.generate_report()
                    self.save_report(report)
                    
        except KeyboardInterrupt:
            self.logger.info("Received interrupt signal")
        except Exception as e:
            self.logger.error(f"Error in main monitoring loop: {e}")
        finally:
            self.stop_monitoring()

def main():
    """Main function"""
    monitor = CloudResourcesMonitor()
    monitor.run()

if __name__ == "__main__":
    main() 