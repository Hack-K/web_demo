#!/usr/bin/env bash
set -e
npm run build
cd dist
touch .nojekyll
git init
git add -A
git commit -m 'deploy'
git push -f "https://${access_token}@gitee.com/chu1204505056/admin-pro.git" master:gh-pages
# git push -f "https://${access_token}@e.coding.net/chu1204505056/vab/admin-pro.git" master
start "https://gitee.com/chu1204505056/admin-pro/pages"
cd -
exec /bin/bash
