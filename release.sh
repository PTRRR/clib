#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh <version>"
    echo "Example: ./deploy.sh 1.0.0"
    exit 1
fi

VERSION="v$1"

# Build the project
npm run build

# Update package.json version
npm version $1 --no-git-tag-version

# Git operations
git add .
git commit -m "Release $VERSION"
git tag -a $VERSION -m "Release $VERSION"
git push origin main
git push origin $VERSION

echo "Successfully deployed version $VERSION"