#   open image with newest nodejs
FROM node:latest

# Lint installation...
RUN npm install -g eslint stylelint htmlhint jsonlint

# Install OpenSSL
RUN apt-get update && \
    apt-get install -y openssl zip

RUN apt-get install dos2unix

# Set the working directory in the container
WORKDIR /app

COPY . .

run dos2unix build.sh build.sh
run dos2unix test.sh test.sh
run chmod +x build.sh
run chmod +x test.sh
# Define the command to run when the container starts
CMD ["bash"]