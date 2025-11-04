#!/usr/bin/env bash
set -euo pipefail

BASHRC="${HOME}/.bashrc"
PROFILE="${HOME}/.profile"
KEY='MYENV'
VAL='Hello Shell'
LINE="export ${KEY}=\"${VAL}\""

add_line_if_missing() {
  local file="$1"
  [[ -f "$file" ]] || touch "$file"
  grep -qxF "$LINE" "$file" || echo "$LINE" >> "$file"
}

echo "[1] ${BASHRC} / ${PROFILE} 에 ${KEY} 추가"
add_line_if_missing "$BASHRC"
add_line_if_missing "$PROFILE"

export MYENV="$VAL"
echo "현재 셸 \$MYENV='${MYENV}'"

echo "[2] 대화형 서브셸에서 값 확인(bash -ic: .bashrc 사용)"
bash -ic 'echo "interactive subshell MYENV=${MYENV:-<unset>}"'

echo "[3] 로그인 서브셸에서 값 확인(bash -lc: .profile 사용)"
bash -lc 'echo "login subshell MYENV=${MYENV:-<unset>}"'

echo "[4] 해제 테스트"
unset MYENV
echo "현재 셸 after unset: '${MYENV:-<unset>}'"
bash -ic 'echo "interactive after unset MYENV=${MYENV:-<unset>}"'
bash -lc 'echo "login      after unset MYENV=${MYENV:-<unset>}"'
