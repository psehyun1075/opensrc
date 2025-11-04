#!/usr/bin/env python3
import sys
print("[helper.py] START")
print(f"[helper.py] ARGC={len(sys.argv)-1}")
for i, a in enumerate(sys.argv[1:], 1):
    print(f"[helper.py] ARG{i}={a}")
print("[helper.py] END")
