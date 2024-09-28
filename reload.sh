#!/bin/bash

# Change to the specified directory
cd /home/hardope/clickviral-v2

# Run git pull
git pull

# Restart the server
npm install
pm2 restart all