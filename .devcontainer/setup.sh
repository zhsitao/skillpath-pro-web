#!/bin/bash

BRANCH_NAME=$(git symbolic-ref --short HEAD)

# clone backend repo and checkout branch
if [ ! -d "/workspaces/skillpath-pro-api" ]; then
  git clone https://github.com/${GITHUB_USER}/skillpath-pro-api /workspaces/skillpath-pro-api
  cd /workspaces/skillpath-pro-api
  git checkout $BRANCH_NAME || git checkout main
  cd -
fi

# frontend repo install
if [ -f "/workspaces/skillpath-pro-web/package.json" ]; then
  npm install
fi

# backend repo install
if [ -f "/workspaces/skillpath-pro-api/pom.xml" ]; then
  mvn clean install -f /workspaces/skill-api/pom.xml
fi
