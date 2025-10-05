#!/bin/bash


# Error mgmt
set -e
on_error() { echo "Script failed. Error on line: $1. Terminating..."; }
trap 'on_error $LINENO' ERR


# Privilige check
if [[ "$EUID" -ne 0 ]]; then
   echo "Script not running as root. Terminating..."
   exit 1
fi


# Docker autostart
echo "Setting up Quoteosch to start on boot..."

read -p "Full path to docker-compose.yaml: " COMPOSE_PATH
if [[ ! -f "$COMPOSE_PATH" ]]; then
    echo "docker-compose.yaml not found at $COMPOSE_PATH. Terminating..."
    exit 1
fi

COMPOSE_DIR=$(dirname "$COMPOSE_PATH")

cat <<EOF > /etc/systemd/system/quoteosch-startup.service
[Unit]
Description=Starts Quoteosch Docker container on boot
Wants=network-online.target docker.service
After=network-online.target docker.service

[Service]
Type=simple
WorkingDirectory=$COMPOSE_DIR
ExecStart=docker compose up -d quoteosch-api
StandardOutput=journal
StandardError=journal

# IO and CPU
Nice=-5
IOSchedulingClass=best-effort
IOSchedulingPriority=2

# Security
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now quoteosch-startup.service

echo -e "\nquoteosch-startup service enabled and started."
echo "Setup complete."