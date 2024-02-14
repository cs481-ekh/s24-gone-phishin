#!/bin/bash

VERSION="0.1"

# check if openssl has been installed. Tests for key verification to be added...
openssl version

# Additional tests to be added here...

# lint tests here are assuming that these are the primary files being used for the extension (.json, .css, .html, .css)

eslint ./*.js
stylelint ./*.css
htmlhint ./*.html
jsonlint ./*.json

echo "tests complete"
