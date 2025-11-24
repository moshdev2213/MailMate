#!/bin/bash
set -e

# Config
REGISTRY="mosh-do-docker-reg"         # DO registry namespace
REPO="mailmate-server"                # repository name in that registry

# Fetch all tags
TAGS=$(doctl registry repository list-tags $REPO --registry $REGISTRY --format Tag --no-header)

# Delete all except prod and staging
echo "$TAGS" | while read TAG; do
  if [[ "$TAG" != "production" && "$TAG" != "staging" ]]; then
    echo "Deleting old/unwanted image: $REPO:$TAG"
    doctl registry repository delete $REPO --registry $REGISTRY --tag $TAG --force
  else
    echo "Keeping image: $REPO:$TAG"
  fi
done

echo "Cleanup completed. Only 'production' and 'staging' images retained."