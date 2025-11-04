#!/usr/bin/env bash
set -euo pipefail
read -rp "x 값들을 공백으로 2개 이상 입력: " -a xs
(( ${#xs[@]} >= 2 )) || { echo "최소 2개 필요"; exit 1; }
for x in "${xs[@]}"; do
  y=$(echo "scale=6; 0.5*($x*$x)" | bc -l)
  printf "x=%s -> y=%.6f\n" "$x" "$y"
done
