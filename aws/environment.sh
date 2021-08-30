#!/bin/bash

source /root/.bashrc

cd /home/ec2-user

# update packages
sudo yum -y update
sudo yum -y upgrade

# install screen if not present
if ! which screen > /dev/null; then
    sudo yum -y install screen
fi

# install node if not present
if ! which node > /dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

    . ~/.nvm/nvm.sh

    nvm install node
fi
