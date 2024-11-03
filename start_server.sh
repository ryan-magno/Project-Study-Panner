#!/bin/bash
php -S localhost:8000 -t ./ > /dev/null &
node ./node/app.js > /dev/null &
