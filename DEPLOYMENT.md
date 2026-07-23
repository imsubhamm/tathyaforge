# TathyaForge EC2 deployment with PM2

This setup runs Next.js on `127.0.0.1:3000` under PM2 and exposes it through
Nginx. The commands below assume Ubuntu and a repository checkout at
`/var/www/tathyaforge`.

## 1. Prepare the EC2 instance

Allow inbound ports 22, 80, and 443 in the EC2 security group. Then connect to
the server and install Node.js 20, PM2, Nginx, and Git:

```bash
sudo apt update
sudo apt install -y curl git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Clone the repository:

```bash
sudo mkdir -p /var/www/tathyaforge
sudo chown "$USER":"$USER" /var/www/tathyaforge
git clone https://github.com/imsubhamm/tathyaforge.git /var/www/tathyaforge
cd /var/www/tathyaforge
```

For a private repository, configure a read-only GitHub deploy key before
cloning.

## 2. Deploy the application

```bash
cd /var/www/tathyaforge
chmod +x scripts/deploy-ec2.sh
DEPLOY_BRANCH=main ./scripts/deploy-ec2.sh
```

The script fetches the selected branch, installs locked dependencies, creates
the production build, reloads PM2 without unnecessary downtime, saves the PM2
process list, and verifies the local HTTP endpoint.

Enable PM2 after reboot:

```bash
pm2 startup
```

Run the `sudo` command printed by PM2, then:

```bash
pm2 save
```

## 3. Configure Nginx

```bash
sudo cp deploy/nginx-tathyaforge.conf /etc/nginx/sites-available/tathyaforge
sudo ln -s /etc/nginx/sites-available/tathyaforge /etc/nginx/sites-enabled/tathyaforge
sudo nginx -t
sudo systemctl reload nginx
```

Point the DNS A records for `tathyaforge.in` and `www.tathyaforge.in` to the
EC2 Elastic IP before enabling HTTPS.

## 4. Enable HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tathyaforge.in -d www.tathyaforge.in
```

Certbot updates the Nginx configuration and installs automatic renewal.

## Routine releases

After merging a change to `main`, connect to EC2 and run:

```bash
cd /var/www/tathyaforge
DEPLOY_BRANCH=main ./scripts/deploy-ec2.sh
```

Useful checks:

```bash
pm2 status
pm2 logs tathyaforge
curl -I http://127.0.0.1:3000
sudo nginx -t
```
