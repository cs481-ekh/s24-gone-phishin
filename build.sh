#!/bin/bash

VERSION="0.1"

# I have read online about chrome extensions being packaged with a .crx file and a key .pem fle, but for now so we can
# have a working build.sh file I will just have be packaged in a .zip file without signing it.
echo "Creating zip file..."
zip -r HookLineSecureV:$VERSION.zip ./* --exclude .github/*

# additional signing required to be added later...

echo "Build completed successfully!"
