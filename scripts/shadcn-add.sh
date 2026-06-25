#!/usr/bin/env bash
set -euo pipefail

UI_DIR="src/components/ui"
SHADCN_FLAGS=(-y)
COMPONENTS=()

usage() {
  cat <<'EOF'
Usage: shadcn-add.sh [options] <component> [component...]

Add shadcn/ui components and reorganize them into folder structure:
  src/components/ui/<name>/<name>.tsx
  src/components/ui/<name>/index.ts

Options:
  -o, --overwrite   Pass --overwrite to shadcn (replace existing files)
  -h, --help        Show this help message

Examples:
  ./scripts/shadcn-add.sh switch
  ./scripts/shadcn-add.sh checkbox dropdown-menu
  npm run ui:add -- switch -o
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -o | --overwrite)
      SHADCN_FLAGS+=(-o)
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
    *)
      COMPONENTS+=("$1")
      shift
      ;;
  esac
done

if [[ ${#COMPONENTS[@]} -eq 0 ]]; then
  usage >&2
  exit 1
fi

cd "$(dirname "$0")/.."

echo "Adding components: ${COMPONENTS[*]}"
npx shadcn@latest add "${COMPONENTS[@]}" "${SHADCN_FLAGS[@]}"

for name in "${COMPONENTS[@]}"; do
  flat="${UI_DIR}/${name}.tsx"
  dir="${UI_DIR}/${name}"
  target="${dir}/${name}.tsx"
  index="${dir}/index.ts"

  if [[ -f "$target" ]]; then
    if [[ -f "$flat" ]]; then
      rm "$flat"
      echo "Removed duplicate flat file: ${flat}"
    fi

    if [[ ! -f "$index" ]]; then
      printf "export * from './%s';\n" "$name" >"$index"
      echo "Created missing barrel: ${index}"
    else
      echo "Already organized: ${name}"
    fi
    continue
  fi

  if [[ ! -f "$flat" ]]; then
    echo "Warning: expected ${flat} after shadcn add; skipping reorganize for ${name}" >&2
    continue
  fi

  mkdir -p "$dir"
  mv "$flat" "$target"
  printf "export * from './%s';\n" "$name" >"$index"
  echo "Reorganized ${name} -> ${dir}/"
done
