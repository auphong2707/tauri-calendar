#!/bin/sh

# Adjust permissions more securely
chmod -R 777 /workspaces/tauri-calendar


# Update package lists and install required packages
apt update
apt install -y libcanberra-gtk-module libcanberra-gtk3-module 
apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev