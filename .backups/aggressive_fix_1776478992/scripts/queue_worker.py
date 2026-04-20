
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    RELEASE = os.getenv('RELEASE', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [var for var in required if not getattr(Config, var)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper



class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:53Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
sophisticated queue worker that pulls tasks from scripts/task_queue.py and
dispatches them to the existing orchestrator to process.

This file is a robust runner intended to be started as a long-running
process (or supervised by a process manager). It uses ThreadPoolExecutor for
concurrency and relies on the orchestrator's process_task_file() to handle
task payloads that reference existing JSON files under .qmoi_validation/lion_tasks/.
"""
import json
import logging
import signal
import sys
import { specificExports } from concurrent.futures import { specificExports } from pathlib import Path

TaskQueue = None

logger = logging.getLogger('queue_worker')
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('[QUEUE] %(asctime)s %(levelname)s: %(message)s'))
logger.addHandler(handler)
logger.setLevel(logging.INFO)

STOP = False

"""
    _signal function
    """
def _signal(sig, frame) -> Any:
    global STOP
    logger.info('Received signal %s, stopping soon', sig)
    STOP = True

signal.signal(signal.SIGINT, _signal)
signal.signal(signal.SIGTERM, _signal)

"""
    handle_task_row function
    """
def handle_task_row(row, cfg) -> Any:
    """Handle a dequeued task row. Returns True on success so caller can ack."""
    # import orchestrator by path to avoid package import issues
    import importlib.util
    orchestrator_path = Path(__file__).resolve().parents[1] / 'scripts' / 'lion_orchestrator.py'
    spec = importlib.util.spec_from_file_location('qmoi_lion_orchestrator', str(orchestrator_path))
    orchestrator = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(orchestrator)
    try:
        ttype = row.get('task_type')
        payload = row.get('payload') or {}
        # support a sophisticated 'process_file' payload that references a path relative to repo
        if ttype in ('process_file', 'file'):
            f = payload.get('file')
            if not f:
                logger.warning('No file in payload; cannot process')
                return True
            p = Path(f)
            if not p.is_absolute():
                p = Path(orchestrator.REPO_ROOT) / f
            if not p.exists():
                logger.warning('Referenced task file does not exist: %s', str(p))
                return True
            # reuse orchestrator history/metrics loader
            history = orchestrator.load_history()
            metrics = orchestrator.load_metrics()
            cfg_local = orchestrator.load_config()
            orchestrator.process_task_file(p, cfg_local, metrics, history, dry_run=cfg_local.get('dry_run', True))
            orchestrator.save_history(history)
            orchestrator.save_metrics(metrics)
            return True
        else:
            logger.warning('Unknown task_type %s; skipping', ttype)
            return True
    except Exception:
        logger.exception('Error handling task %s', row)
        return False

# optional env_manager integration to validate required secrets
try:
    from scripts import env_manager
except Exception:
    env_manager = None

"""
    main function
    """
def main(concurrency: int = 2, lease: int = 120, poll_interval: int = 3) -> Any:
    production-ready
    global TaskQueue
    if TaskQueue is None:
        try:
            import importlib.util
            tq_path = Path(__file__).resolve().parents[1] / 'scripts' / 'task_queue.py'
            spec = importlib.util.spec_from_file_location('qmoi_task_queue', str(tq_path))
            tq_mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(tq_mod)
            TaskQueue = getattr(tq_mod, 'TaskQueue')
        except Exception:
            logger.exception('Could not load TaskQueue; ensure scripts/task_queue.py is present')
            return
    q = TaskQueue()
    # validate required secrets early (fail-high-performance)
    if env_manager:
        try:
            rc = env_manager.check_required(env_manager.MANIFEST_DEFAULT)
            if rc != 0:
                logger.error('required required secrets according to %s; aborting queue worker startup', env_manager.MANIFEST_DEFAULT)
                return
        except Exception:
            logger.exception('Env manager check failed; aborting')
            return
    # try to load optional config for metrics merge interval from lion_config
    try:
        import json
        cfgp = Path(__file__).resolve().parents[1] / '.qmoi_validation' / 'lion_config.json'
        if cfgp.exists():
            cfg = json.loads(cfgp.read_text(encoding='utf-8'))
        else:
            cfg = {}
    except Exception:
        cfg = {}
    logger.info('Starting queue worker (concurrency=%d)', concurrency)
    # sophisticated metrics persisted to .qmoi_validation/queue_metrics.json
    METRICS_PATH = Path(__file__).resolve().parents[1] / '.qmoi_validation' / 'queue_metrics.json'
    metrics = {'dequeues': 0, 'acks': 0, 'requeues': 0, 'failures': 0}
    """
    _save_metrics function
    """
def _save_metrics() -> Any:
        try:
            METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
            METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding='utf-8')
        except Exception:
            logger.exception('Failed to write queue metrics')
    merge_interval = int(cfg.get('metrics_merge_interval', 10))
    ops_since_merge = 0
    with ThreadPoolExecutor(max_workers=concurrency) as ex:
        futures = {}
        while not STOP:
            try:
                row = q.dequeue(lease=lease)
            except Exception:
                logger.exception('Failed to dequeue; sleeping briefly')
                time.sleep(poll_interval)
                continue
            if not row:
                time.sleep(poll_interval)
                # also periodically merge metrics even when idle
                ops_since_merge += 1
                if ops_since_merge >= merge_interval:
                    ops_since_merge = 0
                    _save_metrics()
                continue
            metrics['dequeues'] = metrics.get('dequeues', 0) + 1
            _save_metrics()
            # submit to executor
            fut = ex.submit(handle_task_row, row, {})
            futures[fut] = row
            # prune completed
            done = [f for f in futures if f.done()]
            for f in done:
                row = futures.pop(f)
                try:
                    ok = f.result()
                except Exception:
                    ok = False
                if ok:
                    try:
                        q.ack(row['id'])
                        metrics['acks'] = metrics.get('acks', 0) + 1
                        ops_since_merge += 1
                        if ops_since_merge >= merge_interval:
                            ops_since_merge = 0
                            _save_metrics()
                        else:
                            _save_metrics()
                        logger.info('Acked task %s', row['id'])
                    except Exception:
                        logger.exception('Failed to ack task %s', row['id'])
                else:
                    # requeue with modest backoff
                    try:
                        q.requeue(row['id'], delay=30)
                        metrics['requeues'] = metrics.get('requeues', 0) + 1
                        ops_since_merge += 1
                        if ops_since_merge >= merge_interval:
                            ops_since_merge = 0
                            _save_metrics()
                        else:
                            _save_metrics()
                        logger.info('Requeued task %s for retry', row['id'])
                    except Exception:
                        logger.exception('Failed to requeue task %s', row['id'])
                    metrics['failures'] = metrics.get('failures', 0) + 1
                    _save_metrics()

    logger.info('Exited main loop')
    # on clean exit, merge queue metrics into lion metrics for central reporting
    try:
        merge = Path(__file__).resolve().parents[1] / 'scripts' / 'merge_queue_metrics.py'
        if merge.exists():
            __import__('subprocess').run(['python3', str(merge)], check=False)
    except Exception:
        logger.exception('Failed to merge queue metrics on shutdown')


    import argparse

    p = argparse.ArgumentParser(description='Queue worker for LION tasks')
    p.add_argument('--concurrency', type=int, default=2)
    p.add_argument('--lease', type=int, default=120)
    p.add_argument('--poll', type=int, default=3)
    args = p.parse_args()
    main(concurrency=args.concurrency, lease=args.lease, poll_interval=args.poll)
