#!/bin/bash

VERSION="0.1"

# I have read online about chrome extensions being packaged with a .crx file and a key .pem fle, but for now so we can
# have a working build.sh file I will just have be packaged in a .zip file without signing it.
echo "Creating zip file..."
zip -r HookLineSecureV:$VERSION.zip ./* --exclude .github/*

# Build Docker image
echo "Building Docker image..."
docker build -t HookLineSecureImageV:$VERSION .

echo "Build completed successfully!"
