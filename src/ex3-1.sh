#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 || ! $1 =~ ^-?[0-9]+$ || ! $2 =~ ^-?[0-9]+$ ]]; then
  echo "사용법: $0 <int a> <int b>"; exit 1
fi
a=$1; b=$2
echo "a+b=$((a+b))"
echo "a-b=$((a-b))"
echo "a*b=$((a*b))"
[[ $b -ne 0 ]] && echo "a/b=$((a/b))" || echo "a/b=NaN(0으로 나눔)"
[[ $b -ne 0 ]] && echo "a%b=$((a%b))" || echo "a%b=NaN(0으로 나눔)"
