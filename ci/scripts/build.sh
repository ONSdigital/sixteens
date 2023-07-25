#!/bin/bash -eux

pushd sixteens
  npm install --unsafe-perm
  SHORT_REF=`git rev-parse --short HEAD`
popd

mkdir -p build/$SHORT_REF
cp -r sixteens/dist/* build/$SHORT_REF