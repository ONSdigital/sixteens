#!/bin/bash -eux

pushd sixteens
  npm install
  npm run audit
popd
