#!/bin/sh
# Lint the site's stylesheet with the pinned stylelint in tools/css-lint.
# Usage: ./scripts/lint-css.sh          check only
#        ./scripts/lint-css.sh --fix    fix what can be fixed automatically
set -e
cd "$(dirname "$0")/../tools/css-lint"
# Install exactly the versions in package-lock.json, the first time only.
[ -d node_modules ] || npm ci --silent
npx --no-install stylelint --config .stylelintrc.json "../../assets/css/**/*.css" "$@"
