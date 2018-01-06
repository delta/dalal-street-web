#!/bin/bash

rm -rf public/proto_build
mkdir -p public/proto_build/{actions,models,datastreams}

protoc --plugin=protoc-gen-ts=./ts-protoc-gen/bin/protoc-gen-ts -I ./proto --js_out=import_style=commonjs,binary:./public/proto_build --ts_out=service=true:./public/proto_build ./proto/*.proto
protoc --plugin=protoc-gen-ts=./ts-protoc-gen/bin/protoc-gen-ts -I ./proto --js_out=import_style=commonjs,binary:./public/proto_build --ts_out=./public/proto_build ./proto/actions/*.proto
protoc --plugin=protoc-gen-ts=./ts-protoc-gen/bin/protoc-gen-ts -I ./proto --js_out=import_style=commonjs,binary:./public/proto_build --ts_out=./public/proto_build ./proto/models/*.proto
protoc --plugin=protoc-gen-ts=./ts-protoc-gen/bin/protoc-gen-ts -I ./proto --js_out=import_style=commonjs,binary:./public/proto_build --ts_out=./public/proto_build ./proto/datastreams/*.proto

