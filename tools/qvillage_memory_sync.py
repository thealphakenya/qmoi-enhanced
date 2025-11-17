#!/usr/bin/env python3
"""
QVillage ↔ QMOI Memory ↔ HF Spaces Bidirectional Sync Engine.
Runs as a background service (cron job or daemon).
Ensures eventual consistency across all three systems.

Usage:
    python qvillage_memory_sync.py              # Run continuous sync (hourly)
    python qvillage_memory_sync.py --run-once   # Run single sync cycle
    python qvillage_memory_sync.py --dry-run    # Test without making changes
"""

import asyncio
import json
import logging
import os
import sys
import argparse
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, asdict
import hashlib
from pathlib import Path

try:
    import httpx
except ImportError:
    print("Installing required packages...")
    os.system("pip install httpx")
    import httpx

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class SyncMetadata:
    """Metadata for tracking sync state."""
    last_sync_time: str
    total_items_synced: int
    conflicts_resolved: int
    errors: List[str]
    status: str  # "success", "partial", "error"


class QVillageSyncEngine:
    """Bidirectional sync engine for QVillage ↔ QMOI ↔ HF Spaces."""
    
    def __init__(
        self,
        qvillage_url: str = None,
        qmoi_memory_url: str = None,
        hf_space_url: str = None,
        hf_token: str = None,
        dry_run: bool = False,
    ):
        self.qvillage_url = qvillage_url or os.getenv("QVILLAGE_API_URL", "http://localhost:3000")
        self.qmoi_memory_url = qmoi_memory_url or os.getenv("QMOI_MEMORY_URL", "http://localhost:3001")
        self.hf_space_url = hf_space_url or os.getenv("HF_SPACE_URL", "https://huggingface.co/spaces/alphaqmoi/qvillage")
        self.hf_token = hf_token or os.getenv("HF_API_TOKEN")
        self.dry_run = dry_run
        self.sync_log = []
        
        if not self.hf_token:
            logger.warning("HF_API_TOKEN not set. HF sync will be skipped.")
        
        logger.info(f"QVillageSyncEngine initialized (dry_run={dry_run})")
        logger.info(f"  QVillage: {self.qvillage_url}")
        logger.info(f"  QMOI Memory: {self.qmoi_memory_url}")
        logger.info(f"  HF Space: {self.hf_space_url}")
    
    async def _fetch_json(self, url: str, **kwargs) -> Optional[Dict]:
        """Safely fetch JSON from URL."""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, **kwargs)
                response.raise_for_status()
                return response.json()
        except httpx.RequestError as e:
            logger.error(f"Request error fetching {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    async def _post_json(self, url: str, data: Dict, **kwargs) -> Optional[Dict]:
        """Safely POST JSON to URL."""
        if self.dry_run:
            logger.info(f"[DRY RUN] POST {url} with data: {json.dumps(data, indent=2)}")
            return {"status": "dry_run"}
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=data, **kwargs)
                response.raise_for_status()
                return response.json()
        except httpx.RequestError as e:
            logger.error(f"Request error POST {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Error POST {url}: {e}")
            return None
    
    def _compute_checksum(self, data: Dict) -> str:
        """Compute SHA256 checksum of data for conflict detection."""
        data_str = json.dumps(data, sort_keys=True)
        return hashlib.sha256(data_str.encode()).hexdigest()
    
    def _resolve_conflict(self, conflict: Dict) -> Dict[str, Any]:
        """
        Resolve a single conflict based on conflict type and rules.
        
        Rules:
        - USER_DATA: user version always wins
        - COMMUNITY_DATA: newest (by timestamp) wins
        - SYSTEM_DATA: recalculated/aggregated
        """
        conflict_type = conflict.get("type", "unknown")
        
        if conflict_type in ["reading_list", "kb_entry", "user_profile"]:
            # User data: local always wins
            strategy = "user_local_wins"
            winner = "local"
        elif conflict_type in ["paper_vote", "discussion_comment", "trending_rank"]:
            # Community data: newest wins
            local_time = datetime.fromisoformat(conflict.get("local_timestamp", "1970-01-01T00:00:00"))
            remote_time = datetime.fromisoformat(conflict.get("remote_timestamp", "1970-01-01T00:00:00"))
            strategy = "timestamp_newest"
            winner = "remote" if remote_time > local_time else "local"
        else:
            # Default: manual resolution
            strategy = "manual"
            winner = None
        
        return {
            "strategy": strategy,
            "winner": winner,
            "action": "apply" if winner else "notify_user",
            "timestamp": datetime.utcnow().isoformat(),
        }
    
    async def sync_papers_to_hf(self, papers: List[Dict]) -> Dict[str, Any]:
        """
        Sync new papers from QVillage to HF Space (read-only mirror).
        Only syncs public papers.
        """
        if not self.hf_token:
            logger.warning("Skipping paper sync to HF (no token)")
            return {"synced": 0, "status": "skipped"}
        
        try:
            # Filter to public papers only
            public_papers = [p for p in papers if p.get("is_public", True)]
            
            if not public_papers:
                logger.info("No public papers to sync to HF")
                return {"synced": 0, "status": "success"}
            
            logger.info(f"Syncing {len(public_papers)} public papers to HF Space")
            
            # POST to HF Space API
            result = await self._post_json(
                f"{self.hf_space_url}/api/papers/batch",
                {
                    "papers": public_papers[:50],  # Rate limit: 50 per request
                    "timestamp": datetime.utcnow().isoformat(),
                },
                headers={"Authorization": f"Bearer {self.hf_token}"}
            )
            
            if result:
                logger.info(f"✓ Synced {result.get('synced', 0)} papers to HF Space")
                return {"synced": result.get("synced", 0), "status": "success"}
            else:
                return {"synced": 0, "status": "error"}
        
        except Exception as e:
            logger.error(f"Error syncing papers to HF: {e}")
            return {"synced": 0, "status": "error", "error": str(e)}
    
    async def sync_user_contributions_to_qmoi(self, user_id: str) -> Dict[str, Any]:
        """Sync user KB contributions from QVillage to QMOI memory."""
        try:
            # Get user contributions from QVillage
            contributions = await self._fetch_json(
                f"{self.qvillage_url}/api/users/{user_id}/contributions"
            )
            
            if not contributions:
                logger.warning(f"No contributions found for user {user_id}")
                return {"synced": 0, "status": "not_found"}
            
            contrib_list = contributions.get("contributions", [])
            if not contrib_list:
                logger.info(f"User {user_id} has no new contributions")
                return {"synced": 0, "status": "success"}
            
            logger.info(f"Syncing {len(contrib_list)} contributions from user {user_id} to QMOI memory")
            
            # Prepare batch event for QMOI memory
            events = [
                {
                    "type": "kb_contribution",
                    "user_id": user_id,
                    "data": contrib,
                    "timestamp": datetime.utcnow().isoformat(),
                }
                for contrib in contrib_list
            ]
            
            result = await self._post_json(
                f"{self.qmoi_memory_url}/api/events/batch",
                {"events": events}
            )
            
            if result:
                logger.info(f"✓ Synced {len(contrib_list)} contributions to QMOI memory")
                return {"synced": len(contrib_list), "status": "success"}
            else:
                return {"synced": 0, "status": "error"}
        
        except Exception as e:
            logger.error(f"Error syncing contributions for user {user_id}: {e}")
            return {"synced": 0, "status": "error", "error": str(e)}
    
    async def sync_hf_engagement_to_qvillage(self) -> Dict[str, Any]:
        """Sync user engagement metrics from HF Space back to QVillage."""
        if not self.hf_token:
            logger.warning("Skipping HF engagement sync (no token)")
            return {"synced": 0, "status": "skipped"}
        
        try:
            # Get engagement stats from HF Space
            engagement = await self._fetch_json(
                f"{self.hf_space_url}/api/engagement",
                headers={"Authorization": f"Bearer {self.hf_token}"}
            )
            
            if not engagement:
                logger.warning("Could not fetch engagement stats from HF Space")
                return {"synced": 0, "status": "error"}
            
            logger.info(f"Syncing engagement stats from HF Space to QVillage")
            
            # POST engagement stats to QVillage
            result = await self._post_json(
                f"{self.qvillage_url}/api/engagement/batch",
                {
                    "source": "hf_space",
                    "stats": engagement,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
            
            if result:
                logger.info(f"✓ Synced engagement stats to QVillage")
                return {"synced": 1, "status": "success"}
            else:
                return {"synced": 0, "status": "error"}
        
        except Exception as e:
            logger.error(f"Error syncing HF engagement: {e}")
            return {"synced": 0, "status": "error", "error": str(e)}
    
    async def detect_and_resolve_conflicts(self) -> Tuple[int, List[Dict]]:
        """Detect conflicts and apply resolution rules."""
        try:
            # Fetch unresolved conflicts from QVillage
            conflicts_resp = await self._fetch_json(
                f"{self.qvillage_url}/api/sync/conflicts?status=unresolved"
            )
            
            if not conflicts_resp:
                logger.info("No conflicts to resolve")
                return (0, [])
            
            conflicts = conflicts_resp.get("conflicts", [])
            if not conflicts:
                logger.info("No unresolved conflicts")
                return (0, [])
            
            logger.info(f"Resolving {len(conflicts)} conflicts...")
            
            resolved = []
            for conflict in conflicts:
                resolution = self._resolve_conflict(conflict)
                
                # Apply resolution
                result = await self._post_json(
                    f"{self.qvillage_url}/api/sync/conflicts/{conflict['id']}/resolve",
                    resolution
                )
                
                if result:
                    logger.info(f"✓ Resolved conflict {conflict['id']}: {resolution['strategy']}")
                    resolved.append(result)
                else:
                    logger.error(f"✗ Failed to resolve conflict {conflict['id']}")
            
            return (len(resolved), resolved)
        
        except Exception as e:
            logger.error(f"Error resolving conflicts: {e}")
            return (0, [])
    
    async def perform_consistency_check(self) -> Dict[str, Any]:
        """
        Verify eventual consistency across all three systems.
        Returns status report.
        """
        logger.info("Performing consistency check...")
        
        try:
            # Fetch paper counts from each system
            qv_papers = await self._fetch_json(f"{self.qvillage_url}/api/papers/count")
            hf_papers = await self._fetch_json(
                f"{self.hf_space_url}/api/papers/count",
                headers={"Authorization": f"Bearer {self.hf_token}"} if self.hf_token else {}
            )
            
            qv_count = qv_papers.get("count", 0) if qv_papers else 0
            hf_count = hf_papers.get("count", 0) if hf_papers else 0
            
            # Papers on HF should be <= papers on QVillage
            consistency_ok = hf_count <= qv_count
            
            report = {
                "qvillage_papers": qv_count,
                "hf_space_papers": hf_count,
                "consistency": "ok" if consistency_ok else "warning",
                "timestamp": datetime.utcnow().isoformat(),
            }
            
            logger.info(f"Consistency check: {json.dumps(report, indent=2)}")
            return report
        
        except Exception as e:
            logger.error(f"Error performing consistency check: {e}")
            return {"consistency": "error", "error": str(e)}
    
    async def run_full_sync(self) -> SyncMetadata:
        """Run complete bidirectional sync cycle."""
        logger.info("=" * 60)
        logger.info("STARTING FULL SYNC CYCLE")
        logger.info("=" * 60)
        
        start_time = datetime.utcnow()
        total_synced = 0
        conflicts_resolved = 0
        errors = []
        
        try:
            # Step 1: Fetch all papers from QVillage
            logger.info("[1/6] Fetching papers from QVillage...")
            papers_resp = await self._fetch_json(f"{self.qvillage_url}/api/papers/all")
            papers = papers_resp.get("papers", []) if papers_resp else []
            logger.info(f"  → Found {len(papers)} papers")
            
            # Step 2: Sync papers to HF Space
            logger.info("[2/6] Syncing papers to HF Space...")
            paper_sync = await self.sync_papers_to_hf(papers)
            total_synced += paper_sync.get("synced", 0)
            if paper_sync.get("status") == "error":
                errors.append(f"Paper sync failed: {paper_sync.get('error')}")
            
            # Step 3: Fetch active users and sync contributions
            logger.info("[3/6] Syncing user contributions to QMOI memory...")
            users_resp = await self._fetch_json(f"{self.qvillage_url}/api/users/active?limit=100")
            users = users_resp.get("users", []) if users_resp else []
            logger.info(f"  → Found {len(users)} active users")
            
            for user in users[:10]:  # Rate limit to first 10 users per cycle
                result = await self.sync_user_contributions_to_qmoi(user["id"])
                total_synced += result.get("synced", 0)
                if result.get("status") == "error":
                    errors.append(f"User {user['id']} contribution sync failed")
            
            # Step 4: Sync HF engagement back to QVillage
            logger.info("[4/6] Syncing HF engagement to QVillage...")
            engagement = await self.sync_hf_engagement_to_qvillage()
            total_synced += engagement.get("synced", 0)
            
            # Step 5: Detect and resolve conflicts
            logger.info("[5/6] Detecting and resolving conflicts...")
            resolved, _ = await self.detect_and_resolve_conflicts()
            conflicts_resolved = resolved
            
            # Step 6: Verify consistency
            logger.info("[6/6] Performing consistency check...")
            consistency = await self.perform_consistency_check()
            if consistency.get("consistency") == "warning":
                errors.append("Consistency warning: HF space paper count differs from QVillage")
            
            # Summary
            end_time = datetime.utcnow()
            duration = (end_time - start_time).total_seconds()
            
            status = "success" if not errors else ("partial" if total_synced > 0 else "error")
            
            metadata = SyncMetadata(
                last_sync_time=end_time.isoformat(),
                total_items_synced=total_synced,
                conflicts_resolved=conflicts_resolved,
                errors=errors,
                status=status,
            )
            
            logger.info("=" * 60)
            logger.info("SYNC COMPLETE")
            logger.info(f"  Items synced: {total_synced}")
            logger.info(f"  Conflicts resolved: {conflicts_resolved}")
            logger.info(f"  Errors: {len(errors)}")
            logger.info(f"  Duration: {duration:.1f}s")
            logger.info(f"  Status: {status.upper()}")
            logger.info("=" * 60)
            
            return metadata
        
        except Exception as e:
            logger.error(f"Fatal error during sync: {e}", exc_info=True)
            return SyncMetadata(
                last_sync_time=datetime.utcnow().isoformat(),
                total_items_synced=total_synced,
                conflicts_resolved=conflicts_resolved,
                errors=errors + [str(e)],
                status="error",
            )


async def main():
    """Main entry point for sync engine."""
    parser = argparse.ArgumentParser(description="QVillage Memory Sync Engine")
    parser.add_argument(
        "--run-once",
        action="store_true",
        help="Run single sync cycle and exit"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Test mode (no actual changes)"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=3600,
        help="Sync interval in seconds (default: 3600 = 1 hour)"
    )
    
    args = parser.parse_args()
    
    engine = QVillageSyncEngine(dry_run=args.dry_run)
    
    if args.run_once:
        # Single sync and exit
        metadata = await engine.run_full_sync()
        sys.exit(0 if metadata.status == "success" else 1)
    else:
        # Continuous sync loop
        logger.info(f"Starting continuous sync loop (interval: {args.interval}s)")
        while True:
            try:
                await engine.run_full_sync()
            except Exception as e:
                logger.error(f"Sync cycle failed: {e}", exc_info=True)
            
            logger.info(f"Waiting {args.interval}s until next sync...")
            await asyncio.sleep(args.interval)


if __name__ == "__main__":
    asyncio.run(main())
