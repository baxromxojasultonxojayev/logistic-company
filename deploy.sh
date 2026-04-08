#!/bin/bash
set -e

git pull
npm install
rm -rf out
npm run build
rsync -avz --delete out/ root@95.130.227.123:/var/www/bsm/frontend/out/

echo "Deployed successfully."
