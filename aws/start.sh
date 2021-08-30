#!/bin/bash

source /root/.bashrc

cd /home/ec2-user

screen -S bot -d -m node -r ./bot/dist/dotenv.js ./bot/dist/index.js
