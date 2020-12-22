#!/usr/bin/bash

VERSION=$1

cd ../jbdm/ && npm install $VERSION &
cd ../sven/ && npm install $VERSION &
cd ../hermes/ && npm install $VERSION &
cd ../kamoulox/ && npm install $VERSION &
cd ../yahoo/ && npm install $VERSION &
cd ../marine/ && npm install $VERSION &