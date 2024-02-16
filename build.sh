#!/bin/bash

VERSION="0.11"

SOURCE_DIR="${GITHUB_WORKSPACE}"
OUTPUT_DIR="${GITHUB_WORKSPACE}/build"

# Ensure the output directory exists
mkdir -p "${OUTPUT_DIR}"

# Change directory to the source directory
cd "${SOURCE_DIR}" || exit
zip -r "${OUTPUT_DIR}/hooklinesecurev:$VERSION.zip" ./* --exclude .github/*

# additional signing required to be added later...

echo "Build completed successfully!"
