#!/bin/bash -ex

export ARTIFACTORY_REGISTRY_INTERNAL=stardog-testing-docker.jfrog.io


# Create the docker tag by the git tag if there is one otherwise
# we default to the branch name (develop/main)
export BRANCH=${CIRCLE_BRANCH:-unstable}
export GIT_TAG=${CIRCLE_TAG:-$BRANCH}
export TAG=${TAG:-$GIT_TAG}

# Check to see if we are pushing the main branch if so change the Docker tag
# and push images to the internal registry. When CIRCLE_TAG is set that indicates
# we are doing a release and the voicebox-service image is pushed to the internal registry
if [ "${TAG}" = "main" ]; then
  echo "Building images for main"
  # Switch the tag to include timestamp
  TAG=${TAG}-${CIRCLE_SHA1:0:7}-$(date +%Y%m%d%H%M)
fi

if [ -z "${ARTIFACTORY_PASSWORD}" ]; then
  echo "Missing docker password!"
  exit 1
fi

if [ -z "${ARTIFACTORY_USERNAME}" ]; then
  echo "Missing docker username"
  exit 1
fi

echo "Logging into docker registry"
docker login ${ARTIFACTORY_REGISTRY_INTERNAL} -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD}

echo "Building images"
docker compose -f docker-compose-stardog.yaml build

echo "Tagging and pushing the cloud-login image with tag: ${TAG}"
docker tag voicebox-portkey-triton ${ARTIFACTORY_REGISTRY_INTERNAL}/cloud/voicebox-portkey-triton:${TAG}
docker push ${ARTIFACTORY_REGISTRY_INTERNAL}/cloud/voicebox-portkey-triton:${TAG}
