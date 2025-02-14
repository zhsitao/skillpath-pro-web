#!/bin/bash

BRANCH_NAME=$(git symbolic-ref --short HEAD)

# clone backend repo and checkout branch
if [ ! -d "/workspace/skillpath-pro-api" ]; then
  git clone https://github.com/${GITHUB_USER}/skillpath-pro-api /workspace/skillpath-pro-api
  cd /workspace/skillpath-pro-api
  git checkout $BRANCH_NAME || git checkout main
  cd -
fi

# frontend repo install
if [ -f "/workspace/skillpath-pro-web/package.json" ]; then
  npm install
fi

# backend repo install
if [ -f "/workspace/skillpath-pro-api/pom.xml" ]; then
  mvn clean install -f /workspace/skill-api/pom.xml
fi
