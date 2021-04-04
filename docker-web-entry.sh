#!/bin/sh

if [ ! -f protoc-3.2.0rc2-linux-x86_64.zip ]; then
    wget --tries=3 https://github.com/google/protobuf/releases/download/v3.2.0rc2/protoc-3.2.0rc2-linux-x86_64.zip

    echo "######## Unzipping protoc compiler ##########"
    unzip protoc-3.2.0rc2-linux-x86_64.zip -d protobuf
fi

# Update protoc-gen
echo "######## Updating protoc-gen ########"
cd ts-protoc-gen
npm install
npm run build
cd ..

# Install dependencies
echo "######## Installing dependencies ######"
npm install
rm -rf node_modules/@types/text-encoding/

# build proto
echo "######## Building proto #########"
npm run build:proto

# build webpack
echo "######## Build webpack ##########"
npm run build:webpack

# protobuf, ts protoc gen
echo "######## Starting nginx server #########"
nginx -g "daemon off;"
