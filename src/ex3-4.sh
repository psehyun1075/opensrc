#!/usr/bin/env bash
set -euo pipefail
scores=()
grade_of(){ local s=$1; (( s>=90 )) && echo A || echo B; }
gpa_of(){ local g=$1; [[ $g == A ]] && echo 4.0 || echo 3.0; }

while :; do
  cat <<'MENU'
===================
1) 과목 성적 추가
2) 입력된 모든 점수 보기
3) 평균 점수 확인
4) 평균 등급(GPA) 변환
5) 종료
===================
MENU
  read -rp "선택: " m
  case "$m" in
    1) read -rp "점수(0~100) 입력: " s
       [[ $s =~ ^[0-9]+$ && $s -ge 0 && $s -le 100 ]] || { echo "유효하지 않음"; continue; }
       scores+=("$s"); echo "추가됨.";;
    2) ((${#scores[@]})) || { echo "데이터 없음"; continue; }
       echo "모든 점수: ${scores[*]}";;
    3) ((${#scores[@]})) || { echo "데이터 없음"; continue; }
       sum=0; for v in "${scores[@]}"; do ((sum+=v)); done
       echo "평균: $(echo "scale=2;$sum/${#scores[@]}" | bc -l)";;
    4) ((${#scores[@]})) || { echo "데이터 없음"; continue; }
       sum=0; for v in "${scores[@]}"; do ((sum+=v)); done
       avg=$(echo "scale=2;$sum/${#scores[@]}" | bc -l)
       g=$( (( ${avg%.*} >= 90 )) && echo A || echo B )
       gpa=$(gpa_of "$g")
       echo "평균등급: $g (GPA=${gpa})";;
    5) echo "종료"; break;;
    *) echo "1~5 입력";;
  esac
done
