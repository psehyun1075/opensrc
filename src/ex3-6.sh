#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 2 ]]; then echo "사용법: $0 <arg1> <arg2> [...]"; exit 1; fi
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "${SCRIPT_DIR}/helper.py" "$@"
