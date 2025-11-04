#!/usr/bin/env bash
# set -e  제거!  (의도치 않은 중단 방지)
set -uo pipefail
LC_ALL=C

read -rp "점수들(0~100, 공백 구분) 입력: " -a sc
if (( ${#sc[@]} < 2 )); then
  echo "최소 2개 필요"; exit 1
fi

sum=0; cnt=0

grade_of() {
  local s=$1
  if (( s >= 90 )); then
    echo A
  else
    echo B
  fi
}

echo "개별 등급:"
for s in "${sc[@]}"; do
  # 숫자/범위 검증을 '명시적 if'로 처리 (false라도 스크립트가 안 죽도록)
  if ! [[ $s =~ ^[0-9]+$ ]]; then
    echo "잘못된 점수(숫자 아님): $s"; exit 1
  fi
  if (( s < 0 || s > 100 )); then
    echo "범위(0~100) 초과: $s"; exit 1
  fi

  g=$(grade_of "$s")
  printf "  %s -> %s\n" "$s" "$g"

  (( sum += s ))
  (( cnt++ ))
done

# 평균 계산 (bc 없으면 안내)
if ! command -v bc >/dev/null 2>&1; then
  echo "bc가 필요합니다. 설치: sudo apt-get update && sudo apt-get install -y bc"
  exit 1
fi

avg=$(printf "scale=2; %s/%s\n" "$sum" "$cnt" | bc -l)
avg_int=${avg%.*}
avg_grade=$([[ $avg_int -ge 90 ]] && echo A || echo B)

echo "평균점수: $avg"
echo "평균등급: $avg_grade"
