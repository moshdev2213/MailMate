#!/bin/bash
set -e

# Config
REGISTRY="mosh-do-docker-reg"         # DO registry namespace
REPO="mailmate-server"                # repository name in that registry
FULL_REPO="$REGISTRY/$REPO"           # full repository path

# Fetch all tags
TAGS=$(doctl registry repository list-tags $FULL_REPO --format Tag --no-header)

# Delete all except prod and staging
echo "$TAGS" | while read TAG; do
  if [[ "$TAG" != "production" && "$TAG" != "staging" ]]; then
    echo "Deleting old/unwanted image: $REPO:$TAG"
    doctl registry repository delete-tag $FULL_REPO $TAG --force
  else
    echo "Keeping image: $REPO:$TAG"
  fi
done

echo "Cleanup completed. Only 'production' and 'staging' images retained."