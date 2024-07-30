#!/usr/bin/env bash
set -eu

if git grep -rE "console\.(log|dir)|FIXME|\"link:|DEBUG.+= true" -- ":!$0"; then
  exit 1
elif git grep -rE "@/src/" -- ":!$0" src; then
  exit 1
else
  echo "All good"
fi
