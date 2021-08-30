#!/bin/bash

source /root/.bashrc

cd /home/ec2-user

if screen -ls | grep bot > /dev/null; then
    screen -X -S bot quit
fi
