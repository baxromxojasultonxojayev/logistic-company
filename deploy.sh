#!/bin/bash
set -e

git pull
npm install
rm -rf out
npm run build
scp -r out/* root@192.168.145.38:/var/www/agrokomakchi.uz/

ssh root@192.168.145.38 'sudo systemctl reload nginx'
echo "Deployed successfully."
