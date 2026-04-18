#!/usr/bin/env python3
"""Automated backup management system"""

import os
import subprocess
import json
from datetime import datetime, timedelta

class BackupManager:
    def __init__(self):
        self.backup_dir = '/backups'
        self.retention_days = {
            'daily': 30,
            'weekly': 90,
            'monthly': 365
        }
    
    def backup_database(self):
        """Backup production database"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = f'{self.backup_dir}/db_backup_{timestamp}.sql.gz'
        
        print(f"Starting database backup: {backup_file}")
        
        try:
            # Backup command
            cmd = f"mysqldump -u root -p$DB_PASSWORD --all-databases | gzip > {backup_file}"
            subprocess.run(cmd, shell=True, check=True)
            
            # Verify backup
            size = os.path.getsize(backup_file)
            print(f"✅ Database backup successful: {size} bytes")
            
            # Upload to S3
            subprocess.run(
                f"aws s3 cp {backup_file} s3://qmoi-backups/database/",
                shell=True, check=True
            )
            print(f"✅ Backup uploaded to S3")
            
            # Replicate to off-site
            subprocess.run(
                f"aws s3 cp s3://qmoi-backups/database/{os.path.basename(backup_file)} "
                f"s3://qmoi-backups-replica/database/ --region us-west-2",
                shell=True, check=True
            )
            print(f"✅ Backup replicated to off-site location")
            
            return True
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return False
    
    def backup_configuration(self):
        """Backup application configuration"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_file = f'{self.backup_dir}/config_backup_{timestamp}.tar.gz'
        
        print(f"Starting configuration backup: {backup_file}")
        
        try:
            cmd = f"tar czf {backup_file} /etc /opt/qmoi-enhanced/config"
            subprocess.run(cmd, shell=True, check=True)
            
            size = os.path.getsize(backup_file)
            print(f"✅ Configuration backup successful: {size} bytes")
            
            # Upload to S3
            subprocess.run(
                f"aws s3 cp {backup_file} s3://qmoi-backups/config/",
                shell=True, check=True
            )
            print(f"✅ Configuration backup uploaded to S3")
            
            return True
        except Exception as e:
            print(f"❌ Configuration backup failed: {e}")
            return False
    
    def cleanup_old_backups(self):
        """Clean up old backup files"""
        print("Cleaning up old backups...")
        
        for backup_type, retention_days in self.retention_days.items():
            cutoff_date = datetime.now() - timedelta(days=retention_days)
            
            try:
                subprocess.run(
                    f"aws s3 ls s3://qmoi-backups/{backup_type}/ | "
                    f"awk '$1 <= {cutoff_date.strftime('%Y-%m-%d')} {{print $4}}' | "
                    f"xargs -I {{}} aws s3 rm s3://qmoi-backups/{backup_type}/{{}}",
                    shell=True, check=True
                )
                print(f"✅ Cleaned up {backup_type} backups older than {retention_days} days")
            except Exception as e:
                print(f"⚠️  Issue cleaning {backup_type}: {e}")
    
    def restore_backup(self, backup_file):
        """Restore from backup"""
        print(f"Restoring from backup: {backup_file}")
        
        try:
            if backup_file.endswith('.sql.gz'):
                cmd = f"gunzip < {backup_file} | mysql -u root -p$DB_PASSWORD"
            elif backup_file.endswith('.tar.gz'):
                cmd = f"tar xzf {backup_file} -C /"
            else:
                print("Unknown backup format")
                return False
            
            subprocess.run(cmd, shell=True, check=True)
            print(f"✅ Restore complete")
            return True
        except Exception as e:
            print(f"❌ Restore failed: {e}")
            return False
    
    def verify_backup_integrity(self, backup_file):
        """Verify backup integrity"""
        print(f"Verifying backup integrity: {backup_file}")
        
        try:
            if backup_file.endswith('.sql.gz'):
                cmd = f"gunzip -t {backup_file}"
            elif backup_file.endswith('.tar.gz'):
                cmd = f"tar -tzf {backup_file} > /dev/null"
            else:
                return False
            
            subprocess.run(cmd, shell=True, check=True)
            print(f"✅ Backup integrity verified")
            return True
        except Exception as e:
            print(f"❌ Backup verification failed: {e}")
            return False
    
    def run_full_backup_cycle(self):
        """Run complete backup cycle"""
        print("\n" + "="*50)
        print("FULL BACKUP CYCLE")
        print("="*50 + "\n")
        
        self.backup_database()
        self.backup_configuration()
        self.cleanup_old_backups()
        
        print("\n✅ Backup cycle complete\n")

if __name__ == '__main__':
    manager = BackupManager()
    manager.run_full_backup_cycle()
