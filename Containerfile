#   open image with newest nodejs
FROM node:latest

# Lint installation...
RUN npm install -g eslint stylelint htmlhint jsonlint

# Install OpenSSL
RUN apt-get update && \
    apt-get install -y openssl

# Set the working directory in the container
WORKDIR /app

COPY . .

# Define the command to run when the container starts
CMD ["bash"]