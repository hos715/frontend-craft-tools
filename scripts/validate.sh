#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Validating frontend-craft-tools..."

required_files=(
  index.html
  script.js
  styles.css
  README.md
  CONTRIBUTING.md
  LICENSE
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file"
    exit 1
  fi
done

tool_count=0
for dir in tools/*/; do
  name="$(basename "$dir")"
  html="tools/${name}/${name}.html"
  js="tools/${name}/${name}.js"

  if [[ ! -f "$html" ]]; then
    echo "Missing HTML for tool: $name ($html)"
    exit 1
  fi

  if [[ ! -f "$js" ]]; then
    echo "Missing JS for tool: $name ($js)"
    exit 1
  fi

  if ! grep -q "href=\"tools/${name}/${name}.html\"" index.html; then
    echo "index.html is missing a link to $html"
    exit 1
  fi

  tool_count=$((tool_count + 1))
done

if [[ "$tool_count" -lt 1 ]]; then
  echo "No tools found under tools/"
  exit 1
fi

echo "Found $tool_count tools — all checks passed."
