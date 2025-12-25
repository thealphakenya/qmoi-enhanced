"""AWS Route53 provider integration.

Implements the ProviderBase interface for AWS Route53 DNS management.
Requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.
"""
from __future__ import annotations

import os
import boto3
from botocore.exceptions import ClientError
from typing import Dict, Any

from .provider_base import ProviderBase, ProviderError

# Try to load automatic credentials shim for test/dev environments
try:
    from scripts import auto_creds
except Exception:
    auto_creds = None


class Route53Provider(ProviderBase):
    def __init__(self, log_path: str = None):
        super().__init__('aws_route53', log_path)
        # Ensure AWS credentials exist. Prefer environment variables.
        # Auto-provision fallback only when explicitly enabled by
        # `QMOI_AUTO_CREDENTIALS=1` (so tests that expect credential
        # enforcement still see ProviderError when creds are missing).
        if not os.getenv('AWS_ACCESS_KEY_ID') or not os.getenv('AWS_SECRET_ACCESS_KEY'):
            if os.environ.get('QMOI_AUTO_CREDENTIALS') == '1' and auto_creds:
                creds = auto_creds.get_aws_credentials()
                if creds.get('AWS_ACCESS_KEY_ID'):
                    os.environ.setdefault('AWS_ACCESS_KEY_ID', creds.get('AWS_ACCESS_KEY_ID'))
                if creds.get('AWS_SECRET_ACCESS_KEY'):
                    os.environ.setdefault('AWS_SECRET_ACCESS_KEY', creds.get('AWS_SECRET_ACCESS_KEY'))
            else:
                # Enforce credentials for normal/test environments
                raise ProviderError('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required')
        try:
            self.client = boto3.client('route53')
        except Exception as e:
            raise ProviderError(f'Failed to initialize Route53 client: {e}')

    def _get_zone_id(self, domain: str) -> str:
        """Get the Route53 hosted zone ID for a domain."""
        try:
            response = self.client.list_hosted_zones_by_name(DNSName=domain)
            for zone in response['HostedZones']:
                if zone['Name'].rstrip('.') == domain:
                    return zone['Id']
            raise ProviderError(f'No hosted zone found for {domain}')
        except ClientError as e:
            raise ProviderError(f'Failed to get zone ID: {e}')

    def plan_dns_change(self, domain: str, records: Dict[str, Any]) -> Dict[str, Any]:
        """Plan DNS changes for Route53."""
        zone_id = self._get_zone_id(domain)

        # Get current records
        try:
            current_records = self.client.list_resource_record_sets(
                HostedZoneId=zone_id
            )['ResourceRecordSets']
        except ClientError as e:
            raise ProviderError(f'Failed to list records: {e}')

        changes = []
        for name, details in records.items():
            existing = next(
                (r for r in current_records if r['Name'].rstrip('.') == name),
                None
            )

            change = {
                'Action': 'UPSERT',
                'ResourceRecordSet': {
                    'Name': name,
                    'Type': details['type'],
                    'TTL': details.get('ttl', 300),
                    'ResourceRecords': [{'Value': details['content']}]
                }
            }

            # For alias records
            if details.get('alias'):
                change['ResourceRecordSet'].pop('TTL', None)
                change['ResourceRecordSet'].pop('ResourceRecords', None)
                change['ResourceRecordSet']['AliasTarget'] = details['alias']

            changes.append(change)

        plan = {
            'zone_id': zone_id,
            'changes': changes,
            'dry_run': True
        }

        self.log_operation('plan_dns', {
            'domain': domain,
            'changes': len(changes)
        })

        return plan

    def apply_dns_change(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Apply Route53 DNS changes."""
        if plan.get('dry_run', True):
            raise ProviderError('Cannot apply plan in dry run mode')
        if not os.getenv('QMOI_PROVISION_DNS'):
            raise ProviderError('QMOI_PROVISION_DNS must be set to 1')

        zone_id = plan['zone_id']
        changes = plan['changes']

        try:
            result = self.client.change_resource_record_sets(
                HostedZoneId=zone_id,
                ChangeBatch={'Changes': changes}
            )

            self.log_operation('apply_dns', {
                'zone_id': zone_id,
                'change_id': result['ChangeInfo']['Id'],
                'status': result['ChangeInfo']['Status'],
                'applied': len(changes)
            }, applied=True)

            return {
                'applied': changes,
                'change_info': result['ChangeInfo'],
                'rollback_plan': {
                    'zone_id': zone_id,
                    'changes': [
                        {**c, 'Action': 'DELETE'}
                        for c in changes if c['Action'] == 'CREATE'
                    ],
                    'dry_run': False
                } if changes else None
            }

        except ClientError as e:
            raise ProviderError(f'Failed to apply changes: {e}')

    def verify_dns(self, domain: str) -> Dict[str, Any]:
        """Verify Route53 DNS records."""
        zone_id = self._get_zone_id(domain)
        errors = []

        try:
            records = self.client.list_resource_record_sets(
                HostedZoneId=zone_id
            )['ResourceRecordSets']

            import dns.resolver
            for record in records:
                # Skip NS and SOA
                if record['Type'] in ('NS', 'SOA'):
                    continue

                try:
                    name = record['Name'].rstrip('.')
                    answers = dns.resolver.resolve(name, record['Type'])

                    # Compare values
                    if 'ResourceRecords' in record:
                        expected = {r['Value'] for r in record['ResourceRecords']}
                        actual = {str(rdata) for rdata in answers}
                        if not expected.issubset(actual):
                            errors.append({
                                'record': record,
                                'error': f'Record values mismatch. Expected {expected}, got {actual}'
                            })

                    # For alias records, just verify resolution
                    elif 'AliasTarget' in record:
                        if not answers:
                            errors.append({
                                'record': record,
                                'error': 'Alias record does not resolve'
                            })

                except Exception as e:
                    errors.append({
                        'record': record,
                        'error': str(e)
                    })

            self.log_operation('verify_dns', {
                'domain': domain,
                'records': len(records),
                'errors': len(errors)
            })

            return {
                'verified': len(errors) == 0,
                'errors': errors
            }

        except ClientError as e:
            raise ProviderError(f'Failed to verify records: {e}')


if __name__ == '__main__':
    provider = Route53Provider()
    plan = provider.plan_dns_change('example.com', {
        'test.example.com': {
            'type': 'A',
            'content': '1.2.3.4'
        }
    })
    print('Plan:', plan)
