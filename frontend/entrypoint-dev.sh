#!/bin/bash

cp package.json /usr/src/

cd /usr/src/

npm install
npm cache clean --force

export PATH=/usr/src/node_modules/.bin:$PATH

cd /usr/src/app

npm run dev -- --host 0.0.0.0 --port 80 --config ./vite.config.polling.ts