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

# Install Cloudflare
mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bookworm main' | tee /etc/apt/sources.list.d/cloudflared.list
apt-get update && apt-get install -y cloudflared

echo "Cloudflare installation complete."

# Authenticate
read -p "Press any key to continue with authentication..."
cloudflared tunnel login
echo "Cloudflare authentication complete."

# Create a tunnel
read -p "Press any key to continue with tunnel creation..."
cloudflared tunnel create quoteosch-api

read -p "Now copy your Tunnel ID and edit the config file. Press any key to continue..."

cat <<EOF > /root/.cloudflared/config.yml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
    - hostname: subdomain.yourdomain.com
      service: http://localhost:3000
    - service: http_status:404
EOF

nano /root/.cloudflared/config.yml

read -p "What should be the subdomain for the API?: " SUBDOMAIN
read -p "What is your domain name (e.g., example.com)?: " DOMAIN
read -p "Press any key to create a DNS record for $SUBDOMAIN.$DOMAIN..."

cloudflared tunnel route dns quoteosch-api $SUBDOMAIN.$DOMAIN

# Create a systemd service
cloudflared service install
systemctl enable cloudflared
systemctl start cloudflared

echo "Cloudflare tunnel setup complete."
echo "Your API should now be accessible via https://$SUBDOMAIN.$DOMAIN"