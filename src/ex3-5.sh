#!/usr/bin/env bash
set -euo pipefail
run_cmd() {
  local cmd=$1; shift || true
  # 안전을 위해 ;, & 등 특수문자 차단(기본 방어)
  local s="$*"
  if [[ $s =~ [\;\&\|\>] ]]; then
    echo "위험한 문자 포함: $s"; return 2
  fi
  # 옵션을 그대로 전달
  eval "$cmd $s"
}
if [[ $# -lt 1 ]]; then
  echo "사용법: $0 <command> [options...]"
  echo "예) $0 ls -l"; exit 1
fi
run_cmd "$@"
