![CircleCI build status](https://circleci.com/gh/delta/dalal-street-web.png)

# DalalStreet frontend (based on `grpc-web`)

## Prerequisites
- Nodejs 7.x
- npm
- protoc (the protobuf compiler)

## Setup
- Clone the repository
```
git clone git@github.com:delta/dalal-street-web.git
```
- Update the submodules
```
git submodule update --init --recursive
```
- Setup ts-protoc-gen (customized)
```
cd ts-protoc-gen
npm install
npm run build
```
- Install dependencies from `package.json`
```
npm install
```
- Build proto files
```
npm run build:proto
```
- Run the *webpack-dev-server*
```
npm run dev-server
```
