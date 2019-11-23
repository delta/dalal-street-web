![CircleCI build status](https://circleci.com/gh/delta/dalal-street-web.png)

# DalalStreet frontend (based on `grpc-web`)

## Prerequisites
- Nodejs 10.17
- npm 4.x 
- protoc (the protobuf compiler)

If you want to keep your node and npm version isolated, feel free to use something like https://github.com/ekalinin/nodeenv/

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
