#!/usr/bin/env bash
set -euo pipefail
DB_FILE="./DB.txt"
touch "$DB_FILE"

add_member(){  # TYPE=MEMBER|날짜|이름|생일|전화|비고
  read -rp "이름: " name
  read -rp "생일(YYYY-MM-DD, 없으면 Enter): " b
  read -rp "전화(없으면 Enter): " p
  dt=$(date +%F)
  echo "MEMBER|$dt|$name|${b:-NA}|${p:-NA}|-" >> "$DB_FILE"
  echo "저장됨."
}
add_log(){     # TYPE=LOG|날짜|이름|NA|NA|내용
  read -rp "팀원 이름(관련자): " name
  read -rp "무엇을 했는지: " note
  dt=$(date +%F)
  echo "LOG|$dt|$name|NA|NA|$note" >> "$DB_FILE"
  echo "기록됨."
}
search_name(){
  read -rp "검색할 이름: " q
  awk -F'|' -v q="$q" '$3==q{print}' "$DB_FILE" | sed 's/|/  |  /g' || true
}
search_date(){
  read -rp "검색할 날짜(YYYY-MM-DD): " d
  awk -F'|' -v d="$d" '$2==d{print}' "$DB_FILE" | sed 's/|/  |  /g' || true
}

while :; do
  cat <<'MENU'
===================
1) 팀원 정보 추가
2) 팀원과 한 일 기록
3) 팀원 검색(이름)
4) 수행 내용 검색(날짜)
5) 종료
===================
MENU
  read -rp "선택: " m
  case "$m" in
    1) add_member;;
    2) add_log;;
    3) search_name;;
    4) search_date;;
    5) exit 0;;
    *) echo "1~5";;
  esac
done
