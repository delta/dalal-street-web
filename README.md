![CircleCI build status](https://circleci.com/gh/delta/dalal-street-web.png)

# DalalStreet frontend (based on `grpc-web`)

## Prerequisites
- Nodejs 7.x
- npm
- protoc (the protobuf compiler)

## Setup
- Clone the repository
```
git clone git@github.com:coderick14/dalal-street-web.git
```
- Update the *proto* submodule
```
git submodule update --init --recursive
```
- Install dependencies from `package.json`
```
npm install
```
- Setup ts-protoc-gen (customized)
```
cd ts-protoc-gen
npm install
npm run build
```
- Build proto files
```
npm run build:proto
```
- Run the *webpack-dev-server*
```
npm run dev-server
```
