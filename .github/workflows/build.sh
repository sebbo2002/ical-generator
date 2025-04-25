#!/usr/bin/env bash
set -e

echo "########################"
echo "# build.sh"
echo "# Branch = ${BRANCH}"
echo "# node version = $(node -v)"
echo "# npm version = $(npm -v)"
echo "########################"

# Typescript Build in ./dist
npm run build

if [ "$BRANCH" != "develop" ] && [ "$BRANCH" != "main" ] && [ "$BRANCH" != "" ]; then
    echo "Skip documentation as branch is not develop and not main (is: ${BRANCH}).";
    exit 0;
fi;


mkdir -p ./docs/
rm -rf ./docs/coverage/ ./docs/reference/ ./docs/tests/


# TypeDoc in ./docs/referece
npx typedoc

# Test Report in ./docs/tests
npx mocha --reporter mochawesome
mv -f ./mochawesome-report/mochawesome.html ./mochawesome-report/index.html
mv -f ./mochawesome-report ./docs/tests

# Coverage Report in ./doc/coverage
npm run coverage

# Run eslint and prettier
npm run lint
