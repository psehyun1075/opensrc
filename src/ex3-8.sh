#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"
DB="${ROOT}/DB"
TRAIN="${ROOT}/train"

mkdir -p "$DB"
echo "[1] DB 디렉터리 확인/생성: $DB"

echo "[2] 5개 파일 생성"
for i in {1..5}; do
  echo "sample-$i" > "${DB}/file${i}.txt"
done

echo "[3] 압축(tar.gz)"
tar -czf "${ROOT}/db_files.tar.gz" -C "$DB" .

echo "[4] train 디렉터리 생성 및 심볼릭 링크"
mkdir -p "$TRAIN"
for i in {1..5}; do
  ln -sf "../DB/file${i}.txt" "${TRAIN}/file${i}.txt"
done

echo "완료: $(ls -l "$TRAIN")"
