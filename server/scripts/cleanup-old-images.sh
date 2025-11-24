#!/bin/bash
set -e

# Config
REGISTRY_NAME="mosh-do-docker-reg"    # Registry namespace only
REPO_NAME="mailmate-server"           # Repository name only

echo "Starting cleanup for Repo: $REPO_NAME in Registry: $REGISTRY_NAME..."

# 1. Fetch all tags
# FIX: Removed "$REGISTRY/" from the argument. Added "--registry" flag.
TAGS=$(doctl registry repository list-tags $REPO_NAME \
  --registry $REGISTRY_NAME \
  --format Tag \
  --no-header \
  --access-token $DO_API_TOKEN)

if [ -z "$TAGS" ]; then
  echo "No tags found or error fetching tags."
  exit 0
fi

# 2. Loop and Delete
echo "$TAGS" | while read TAG; do
  # Logic: Keep 'production', 'staging', AND any tag starting with 'v' (e.g., v1.0.2)
  # If you strictly want ONLY prod and staging, remove the `&& "$TAG" != v*` part.
  if [[ "$TAG" != "production" && "$TAG" != "staging" && "$TAG" != v* ]]; then
    
    echo "Deleting old/unwanted image: $REPO_NAME:$TAG"
    
    # FIX: Syntax for delete command
    doctl registry repository delete-tag $REPO_NAME:$TAG \
      --registry $REGISTRY_NAME \
      --access-token $DO_API_TOKEN \
      --force

  else
    echo "Keeping image: $REPO_NAME:$TAG"
  fi
done

echo "Cleanup completed."