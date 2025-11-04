#!/usr/bin/env bash
set -euo pipefail
cpu_usage() {
  if command -v nvidia-smi >/dev/null 2>&1; then
    echo "[GPU]"; nvidia-smi || true
  fi
  echo "[CPU]"; top -bn1 | awk '/Cpu\(s\)/{print}'
}
mem_usage(){ echo "[MEM]"; free -h; }
disk_usage(){ echo "[DISK]"; df -h --output=source,size,used,avail,pcent,target | sed 1d; }
user_info(){ echo "[USERS]"; who; }

while :; do
  cat <<'M'
===================
1) 사용자 정보
2) GPU/CPU 사용률
3) 메모리 사용량
4) 디스크 사용량
5) 종료
===================
M
  read -rp "선택: " m
  case "$m" in
    1) user_info;;
    2) cpu_usage;;
    3) mem_usage;;
    4) disk_usage;;
    5) exit 0;;
    *) echo "1~5";;
  esac
done
