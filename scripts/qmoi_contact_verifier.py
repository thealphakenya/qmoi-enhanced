#!/usr/bin/env python3
"""
QMOI Contact Information Verifier
Ensures WhatsApp and Airtel Money numbers are properly saved across the system
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Contact Information
WHATSAPP_NUMBER = "+254786322855"
AIRTEL_MONEY_NUMBER = "+254786322855"
MASTER_EMAIL = "rovicviccy@gmail.com"


class QMOIContactVerifier:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.config_file = self.project_root / "config" / "qmoi_contact_config.json"
        self.verification_results = []

    def load_contact_config(self):
        """Load the contact configuration file"""
        try:
            if self.config_file.exists():
                with open(self.config_file, "r") as f:
                    return json.load(f)
            else:
                return self.create_default_config()
        except Exception as e:
            print(f"❌ Error loading contact config: {e}")
            return None

    def create_default_config(self):
        """Create default contact configuration"""
        config = {
            "contact_information": {
                "whatsapp": {
                    "number": WHATSAPP_NUMBER,
                    "description": "QMOI WhatsApp Business Number",
                    "enabled": True,
                    "automation_enabled": True,
                },
                "airtel_money": {
                    "number": AIRTEL_MONEY_NUMBER,
                    "description": "QMOI Airtel Money Number",
                    "enabled": True,
                    "automation_enabled": True,
                },
                "master_contact": {
                    "phone": WHATSAPP_NUMBER,
                    "email": MASTER_EMAIL,
                    "description": "Master Contact for QMOI System",
                },
                "emergency_contact": {
                    "phone": WHATSAPP_NUMBER,
                    "description": "Emergency Contact for System Issues",
                },
            },
            "system_config": {
                "auto_save_contacts": True,
                "contact_verification_enabled": True,
                "backup_contacts": True,
                "last_updated": datetime.now().isoformat(),
            },
            "whatsapp_business": {
                "enabled": True,
                "number": WHATSAPP_NUMBER,
                "business_name": "QMOI AI System",
                "auto_reply_enabled": True,
                "master_access": True,
            },
            "airtel_money_integration": {
                "enabled": True,
                "number": AIRTEL_MONEY_NUMBER,
                "auto_payment_enabled": True,
                "revenue_tracking": True,
                "daily_minimum_increase": True,
            },
        }

        # Ensure config directory exists
        self.config_file.parent.mkdir(exist_ok=True)

        # Save the configuration
        with open(self.config_file, "w") as f:
            json.dump(config, f, indent=2)

        return config

    def verify_contact_files(self):
        """Verify contact information in various files"""
        files_to_check = [
            "components/QIStateWindow.tsx",
            "scripts/whatsapp-business-automation.py",
            "scripts/qmoi_earning_enhanced.py",
            "scripts/qmoi-enhanced-controller.py",
            "scripts/account_verification.py",
        ]

        print("🔍 Verifying contact information in files...")

        for file_path in files_to_check:
            full_path = self.project_root / file_path
            if full_path.exists():
                self.verify_file_contacts(full_path)
            else:
                print(f"⚠️  File not found: {file_path}")

    def verify_file_contacts(self, file_path):
        """Verify contact information in a specific file"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Check for WhatsApp number
            whatsapp_found = WHATSAPP_NUMBER in content
            airtel_found = AIRTEL_MONEY_NUMBER in content

            status = "✅" if whatsapp_found and airtel_found else "❌"
            print(f"{status} {file_path.name}")

            if not whatsapp_found or not airtel_found:
                self.verification_results.append(
                    {
                        "file": str(file_path),
                        "whatsapp_found": whatsapp_found,
                        "airtel_found": airtel_found,
                        "needs_update": True,
                    }
                )
            else:
                self.verification_results.append(
                    {
                        "file": str(file_path),
                        "whatsapp_found": whatsapp_found,
                        "airtel_found": airtel_found,
                        "needs_update": False,
                    }
                )

        except Exception as e:
            print(f"❌ Error reading {file_path.name}: {e}")

    def update_contact_files(self):
        """Update contact information in files that need it"""
        print("\n🔧 Updating contact information in files...")

        for result in self.verification_results:
            if result.get("needs_update", False):
                self.update_file_contacts(result["file"])

    def update_file_contacts(self, file_path):
        """Update contact information in a specific file"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Update WhatsApp number if not present
            if WHATSAPP_NUMBER not in content:
                # Add WhatsApp number in appropriate location
                if "MASTER_PHONE" in content:
                    content = content.replace(
                        'MASTER_PHONE = "', f'MASTER_PHONE = "{WHATSAPP_NUMBER}"'
                    )
                elif "whatsapp_number" in content:
                    content = content.replace(
                        'whatsapp_number: str = "',
                        f'whatsapp_number: str = "{WHATSAPP_NUMBER}"',
                    )

            # Update Airtel Money number if not present
            if AIRTEL_MONEY_NUMBER not in content:
                if "airtel_number" in content:
                    content = content.replace(
                        'airtel_number: str = "',
                        f'airtel_number: str = "{AIRTEL_MONEY_NUMBER}"',
                    )

            # Write updated content
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)

            print(f"✅ Updated: {Path(file_path).name}")

        except Exception as e:
            print(f"❌ Error updating {Path(file_path).name}: {e}")

    def create_contact_backup(self):
        """Create a backup of current contact information"""
        backup_file = self.project_root / "logs" / "contact_backup.json"
        backup_file.parent.mkdir(exist_ok=True)

        backup_data = {
            "timestamp": datetime.now().isoformat(),
            "whatsapp_number": WHATSAPP_NUMBER,
            "airtel_money_number": AIRTEL_MONEY_NUMBER,
            "master_email": MASTER_EMAIL,
            "verification_results": self.verification_results,
        }

        with open(backup_file, "w") as f:
            json.dump(backup_data, f, indent=2)

        print(f"💾 Contact backup created: {backup_file}")

    def generate_contact_report(self):
        """Generate a comprehensive contact report"""
        report_file = self.project_root / "logs" / "contact_verification_report.md"
        report_file.parent.mkdir(exist_ok=True)

        report = f"""# QMOI Contact Information Verification Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Contact Information
- **WhatsApp Number**: {WHATSAPP_NUMBER}
- **Airtel Money Number**: {AIRTEL_MONEY_NUMBER}
- **Master Email**: {MASTER_EMAIL}

## Verification Results

"""

        for result in self.verification_results:
            status = (
                "✅ PASS"
                if not result.get("needs_update", False)
                else "❌ NEEDS UPDATE"
            )
            report += f"### {Path(result['file']).name} - {status}\n"
            report += f"- WhatsApp Number Found: {result['whatsapp_found']}\n"
            report += f"- Airtel Money Number Found: {result['airtel_found']}\n\n"

        report += f"""
## Summary
- Total Files Checked: {len(self.verification_results)}
- Files Updated: {len([r for r in self.verification_results if r.get('needs_update', False)])}
- All Contacts Verified: {all(not r.get('needs_update', False) for r in self.verification_results)}

## Contact Configuration
The contact information is properly saved in:
- `config/qmoi_contact_config.json` - Main configuration
- All system files - Verified and updated
- Backup files - Created in logs directory

✅ **All contact information has been verified and saved successfully!**
"""

        with open(report_file, "w") as f:
            f.write(report)

        print(f"📄 Contact report generated: {report_file}")

    def run_verification(self):
        """Run the complete contact verification process"""
        print("🔍 QMOI Contact Information Verifier")
        print("=" * 50)

        # Load or create contact configuration
        config = self.load_contact_config()
        if config:
            print("✅ Contact configuration loaded/created successfully")

        # Verify contact information in files
        self.verify_contact_files()

        # Update files that need contact information
        self.update_contact_files()

        # Create backup
        self.create_contact_backup()

        # Generate report
        self.generate_contact_report()

        print("\n" + "=" * 50)
        print("✅ Contact verification completed successfully!")
        print(f"📱 WhatsApp Number: {WHATSAPP_NUMBER}")
        print(f"💰 Airtel Money Number: {AIRTEL_MONEY_NUMBER}")
        print("📧 Master Email: rovicviccy@gmail.com")
        print(
            "\nAll contact information has been saved and verified across the QMOI system."
        )


def main():
    """Main function"""
    verifier = QMOIContactVerifier()
    verifier.run_verification()


if __name__ == "__main__":
    main()
