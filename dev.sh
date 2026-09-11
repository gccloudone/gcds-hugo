#!/bin/bash
set -euo pipefail

# This repository is a Hugo *theme*, not a site: it has no content/ or config
# of its own, so serving it directly renders empty pages. Preview it through
# exampleSite instead, with the module replaced by this working tree so local
# edits to layouts/ show up live.

THEME_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "\033[0;32mStarting Hugo...\033[0m"

HUGO_MODULE_REPLACEMENTS="github.com/gccloudone/gcds-hugo -> ${THEME_DIR}" \
  hugo server --source "${THEME_DIR}/exampleSite" \
              --watch \
              "$@"
