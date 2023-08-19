#!/bin/bash

rm -rf ./dist
npm run "build:$1";
zip -r dist.zip ./dist
#sshpass -p 'Pasword123!' ssh root@112.64.45.247
