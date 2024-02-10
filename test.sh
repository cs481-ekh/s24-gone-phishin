#!/bin/bash

VERSION="0.1"

# Additional tests to be added here...

# lint tests here are assuming that these are the primary files being used for the extension (.json, .css, .html, .css)

# js lint
docker run HookLineSecureImageV:$Version sh -c "eslint ./*.js"

# css lint
docker run HookLineSecureImageV:$Version sh -c "stylelint ./*.css"

# HTML lint
docker run HookLineSecureImageV:$Version sh -c "htmlhint ./*.html"

# JSON lint
docker run HookLineSecureImageV:$Version sh -c "jsonlint ./*.json"

echo "tests complete"
