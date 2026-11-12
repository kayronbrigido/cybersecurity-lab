#!/bin/bash

BASE_URL="http://127.0.0.1:8080"

ALICE_TOKEN="alice-lab-token"
BOB_TOKEN="bob-lab-token"

check_status() {
  local description="$1"
  local expected="$2"
  local token="$3"
  local invoice="$4"

  local actual

  actual=$(curl -s \
    -o /dev/null \
    -w "%{http_code}" \
    -H "Authorization: Bearer $token" \
    "$BASE_URL/api/invoices/$invoice")

  if [ "$actual" = "$expected" ]; then
    echo "[PASS] $description"
  else
    echo "[FAIL] $description"
    echo "Expected: $expected | Actual: $actual"
  fi
}

check_status \
  "Alice access your invoice" \
  200 "$ALICE_TOKEN" "INV-1001"

check_status \
  "Bob access your invoice" \
  200 "$BOB_TOKEN" "INV-2001"

check_status \
  "Alice cannot access invoice of Bob" \
  404 "$ALICE_TOKEN" "INV-2001"

check_status \
  "Bob cannot access invoice of Alice" \
  404 "$BOB_TOKEN" "INV-1001"