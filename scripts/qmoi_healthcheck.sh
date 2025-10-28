#!/usr/bin/env bash
# Production-ready healthcheck for local QMOI services.
# Writes a structured JSON report to .qmoi/healthcheck.json and exits non-zero on failures.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
QM_DIR="$ROOT/.qmoi"
OUT="$QM_DIR/healthcheck.json"
TMP="$OUT.tmp"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
HTTP_TIMEOUT=${HTTP_TIMEOUT:-5}
DISK_WARN_PCT=${DISK_WARN_PCT:-90} # warn when usage >= this percent
mkdir -p "$QM_DIR"

echo "Starting healthcheck at $NOW"
rm -f "$TMP"

add_check()
{
  # add_check name type ok message elapsed_ms meta_json
  name="$1"; typ="$2"; ok="$3"; msg="$4"; elapsed="$5"; meta_json="$6"
  export _E_NAME="$name"
  export _E_TYPE="$typ"
  export _E_OK="$ok"
  export _E_MSG="$msg"
  export _E_ELAPSED="$elapsed"
  export _E_META="$meta_json"
  python3 - <<'PY' >> "$TMP"
import os, json
name=os.environ.get('_E_NAME','')
typ=os.environ.get('_E_TYPE','')
ok=os.environ.get('_E_OK','false').lower()=='true'
msg=os.environ.get('_E_MSG','')
elapsed=int(os.environ.get('_E_ELAPSED','0'))
meta_s=os.environ.get('_E_META','{}')
try:
    meta=json.loads(meta_s)
except Exception:
    meta={}
d={"name":name, "type":typ, "ok":ok, "message":msg, "elapsed_ms":elapsed, "meta":meta}
print(json.dumps(d))
PY
  unset _E_NAME _E_TYPE _E_OK _E_MSG _E_ELAPSED _E_META
}

now_ms() { date +%s%3N; }

check_http()
{
  url="$1"; name="$2"; start=$(now_ms)
  if curl -sS --max-time "$HTTP_TIMEOUT" --retry 1 "$url" >/dev/null 2>&1; then
    ok=true; msg="ok"
  else
    ok=false; msg="unreachable"
  fi
  end=$(now_ms); elapsed=$((end-start))
  add_check "$name" "http" "$ok" "$msg" "$elapsed" '{}'
}

check_proc()
{
  pattern="$1"; name="$2"; start=$(now_ms)
  if pgrep -f "$pattern" >/dev/null 2>&1; then
    ok=true; msg="running"
  else
    ok=false; msg="not running"
  fi
  end=$(now_ms); elapsed=$((end-start))
  add_check "$name" "process" "$ok" "$msg" "$elapsed" '{}'
}

check_webhook_queue()
{
  file="$1"; name="$2"; start=$(now_ms)
  if [ -f "$file" ]; then
    count=$(python3 - <<'PY'
import sys,json
f=sys.argv[1]
try:
    with open(f,'r',encoding='utf-8') as fh:
        s=fh.read().strip()
        if s.startswith('['):
            arr=json.loads(s)
            print(len(arr))
        else:
            print(len([l for l in s.splitlines() if l.strip()]))
except Exception:
    print(0)
PY
 "$file")
    ok=true; msg="ok"
  else
    count=0; ok=true; msg="missing"
  fi
  end=$(now_ms); elapsed=$((end-start))
  add_check "$name" "queue" "$ok" "$msg" "$elapsed" "{\"count\": $count}"
}

check_disk()
{
  path="$1"; name="$2"; start=$(now_ms)
  used_pct=$(df --output=pcent "$path" 2>/dev/null | tail -1 | tr -dc '0-9') || used_pct=0
  if [ -z "$used_pct" ]; then used_pct=0; fi
  if [ "$used_pct" -ge "$DISK_WARN_PCT" ]; then
    ok=false; msg="disk usage at ${used_pct}%"
  else
    ok=true; msg="disk usage ${used_pct}%"
  fi
  end=$(now_ms); elapsed=$((end-start))
  add_check "$name" "disk" "$ok" "$msg" "$elapsed" "{\"used_pct\": $used_pct}"
}

check_config()
{
  cfg="$1"; name="$2"; start=$(now_ms)
  if [ -f "$cfg" ]; then
    if python3 - <<PY
import sys, json
try:
    json.load(open(sys.argv[1], 'r', encoding='utf-8'))
    sys.exit(0)
except Exception as e:
    print(str(e))
    sys.exit(2)
PY
 "$cfg"; then
      ok=true; msg="valid"
    else
      ok=false; msg="invalid json"
    fi
  else
    ok=false; msg="missing"
  fi
  end=$(now_ms); elapsed=$((end-start))
  add_check "$name" "config" "$ok" "$msg" "$elapsed" '{}'
}

# Run checks
check_http "http://127.0.0.1:8765/health" "adapter"
check_http "http://127.0.0.1:8770/health" "gateway"
check_http "http://127.0.0.1:8766/health" "memory"
check_http "http://127.0.0.1:8780/" "admin"
check_proc "qmoi_supervisor.sh" "supervisor"
check_proc "qmoi_friendship_daemon.py" "friendship_daemon"
check_webhook_queue "$QM_DIR/webhook_queue.json" "webhook_queue"
check_disk "$ROOT" "repo_disk"
check_config "$QM_DIR/config.json" "qmoi_config"

# Assemble final JSON
if [ -f "$TMP" ]; then
  results_join=$(paste -sd, "$TMP" 2>/dev/null || true)
else
  results_join=""
fi

if echo "$results_join" | grep -q '"ok": false'; then overall=false; else overall=true; fi

cat > "$OUT" <<JSON
{
  "checked_at": "$NOW",
  "overall_ok": $overall,
  "results": [
$results_join
  ]
}
JSON

echo "Wrote $OUT"
if [ "$overall" = false ]; then
  echo "One or more checks failed" >&2
  exit 2
fi
echo "All checks passed"
exit 0
