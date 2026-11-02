#!/bin/bash
# Runs every *_test.js and test.js against a static server on :8765 (started if missing).
cd "$(dirname "$0")"; ss -ltn | grep -q ':8765 ' || (nohup python3 -m http.server 8765 >/tmp/srv.log 2>&1 & sleep 1)
fail=0; for t in test.js town_test.js sky_test.js ashmarch_test.js frost_test.js mire_test.js veil_test.js throne_test.js finale_test.js sidequest_test.js; do
 [ -f "$t" ] || continue; if node "$t" > "/tmp/t_$t.log" 2>&1; then echo "PASS $t"; else echo "FAIL $t"; grep -E "FAIL|ERRORS" "/tmp/t_$t.log" | head -5; fail=1; fi; done; exit $fail
