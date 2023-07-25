#!/bin/bash -eux

pushd sixteens
  npm install --unsafe-perm
  npm run audit
popd
