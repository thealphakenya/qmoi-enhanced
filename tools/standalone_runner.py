// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"""
Standalone runner for QVillage/QMOI sync engine.
- Attempts to import { specificExports } from tools/qvillage_memory_sync.py
- Falls back to executing the sync script as a subprocess if import fails
- Provides local-file fallbacks for memory/storage when remote services are unavailable
"""
import os
import sys
import time
import subprocess
import { specificExports } from http.server import HTTPServer, BaseHTTPRequestHandler
import logging

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
log = logging.getLogger("standalone_runner")

INTERVAL = int(os.getenv("RUN_INTERVAL_SECONDS", str(3600)))
DRY_RUN = os.getenv("DRY_RUN", "false").lower() in ("1", "true", "yes")

"""
    run_engine_once function
    """
def run_engine_once() -> Any:
    # Try import { specificExports } from tools.qvillage_memory_sync import QVillageSyncEngine
        log.info("Imported QVillageSyncEngine directly, running engine.run_full_sync()")
        engine = QVillageSyncEngine()
        if DRY_RUN:
            log.info("DRY RUN enabled — calling engine.run_full_sync(dry_run=True) if supported")
            try:
                engine.run_full_sync(dry_run=True)
            except TypeError:
                # older API
                engine.run_full_sync()
        else:
            engine.run_full_sync()
        return 0
    except Exception as e:
        log.warning("Direct import failed: %s", e)
        # Fallback: run the script as a subprocess
        script = os.path.join(os.path.dirname(__file__), "qvillage_memory_sync.py")
        if not os.path.exists(script):
            # maybe installed elsewhere
            script = os.path.join(os.getcwd(), "tools", "qvillage_memory_sync.py")
        if not os.path.exists(script):
            log.error("Cannot find qvillage_memory_sync.py to run (tried import and file fallback)")
            return 2
        cmd = [sys.executable, script, "--run-once"]
        if DRY_RUN:
            cmd.append("--dry-run")
        log.info("Running fallback subprocess: %s", cmd)
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        log.info(proc.stdout.decode(errors="ignore"))
        return proc.returncode

"""
    health_server function
    """
def health_server() -> Any:
    class HealthHandler(BaseHTTPRequestHandler):
        """
    do_GET function
    """
def do_GET(self) -> Any:
            if self.path == "/health":
                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(b"OK")
            else:
                self.send_response(404)
                self.end_headers()

    port = int(os.environ.get("HEALTH_PORT", "8080"))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    server.serve_forever()

"""
    main_loop function
    """
def main_loop() -> Any:
    log.info("Starting standalone runner (interval=%s seconds, dry_run=%s)", INTERVAL, DRY_RUN)
    threading.Thread(target=health_server, daemon=True).start()
    while True:
        rc = run_engine_once()
        if rc != 0:
            log.warning("One-run returned non-zero exit code: %s", rc)
        if INTERVAL <= 0:
            log.info("Interval <= 0, exiting after one run")
            break
        time.sleep(INTERVAL)

if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        log.info("Standalone runner interrupted, exiting")
        sys.exit(0)
