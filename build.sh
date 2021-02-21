#!/usr/bin/env bash

echo "########################"
echo "# build.sh"
echo "# Branch = ${BRANCH}"
echo "########################"

npx tsc

if [ "$BRANCH" != "develop" ] && [ "$BRANCH" != "main" ] && [ "$BRANCH" != "" ]; then
    echo "Skip documentation as branch is not develop and not main (is: ${BRANCH}).";
    exit 0;
fi;


rm -rf ./doc
npx typedoc

npx mocha --reporter mochawesome
mv ./mochawesome-report/mochawesome.html ./mochawesome-report/index.html
mkdir -p ./doc
mv ./mochawesome-report ./doc/tests

npm run coverage
