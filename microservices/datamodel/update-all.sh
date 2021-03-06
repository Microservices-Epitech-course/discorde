#!/usr/bin/bash

# if [ "$1" != "no-publish" ]; then
# npm run publish-version
# fi


VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')


cd ../jbdm/ && npm install "@discorde/datamodel@$VERSION" &
cd ../sven/ && npm install "@discorde/datamodel@$VERSION" &
cd ../hermes/ && npm install "@discorde/datamodel@$VERSION" &
cd ../kamoulox/ && npm install "@discorde/datamodel@$VERSION" &
cd ../yahoo/ && npm install "@discorde/datamodel@$VERSION" &
cd ../marine/ && npm install "@discorde/datamodel@$VERSION" &
cd ../../ && npm install "@discorde/datamodel@$VERSION" &

wait