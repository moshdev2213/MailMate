#!/bin/bash
set -e

# Configuration
REGISTRY="registry.digitalocean.com"
REPO="mosh-do-docker-reg/mailmate-server"

# Fetch all tags
TAGS=$(doctl registry repository list-tags $REPO --format Tag --no-header)

# Loop through tags and delete any that are NOT prod or staging
echo "$TAGS" | while read TAG; do
  if [[ "$TAG" != "production" && "$TAG" != "staging" ]]; then
    echo "Deleting old/unwanted image: $REPO:$TAG"
    doctl registry repository delete $REPO --tag $TAG --force
  else
    echo "Keeping image: $REPO:$TAG"
  fi
done

echo "Cleanup completed. Only 'production' and 'staging' images retained."
