# BSM-LOGISTICS — Ubuntu 20.04 VDS Deployment Guide

Frontend (Next.js) is exported to static files and served directly by Nginx.
Backend (Django) runs via Gunicorn on `127.0.0.1:8000`, proxied by Nginx.

---

## Architecture

```
Internet
   │
   ▼
Nginx (80 HTTP — IP-only until domain is added)
   ├── /api/*         → Gunicorn :8000  (Django backend)
   ├── /admin/*       → Gunicorn :8000
   ├── /static/*      → Nginx serves directly (Django staticfiles)
   ├── /media/*       → Nginx serves directly (uploaded files)
   └── /*             → Nginx serves directly (React static build)
```

> **Current setup:** running on `http://95.130.227.123` (no domain, no SSL).
> SSL via Certbot is covered in Section 10 — do that once a domain is pointed at this IP.

No Node.js process runs at runtime. Build happens locally — only the `out/` folder is uploaded to the server.

---

## 1. Initial Server Setup

```bash
# SSH into your VDS
ssh root@YOUR_SERVER_IP

# Update packages
apt update && apt upgrade -y

# Install essentials
apt install -y git curl wget unzip build-essential ufw fail2ban
```

### Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

> `'Nginx Full'` profile only exists after Nginx is installed. Using port numbers here avoids that dependency.

### Create a deploy user (don't run everything as root)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

---

## 2. Install Python 3.10

Ubuntu 20.04 ships with Python 3.8. Django 5.2 requires Python 3.10+.

Use **pyenv** — more reliable than the deadsnakes PPA on Ubuntu 20.04 VPS environments.

```bash
# Build dependencies
sudo apt install -y make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev \
    libffi-dev liblzma-dev

# Install pyenv
curl https://pyenv.run | bash

# Add to ~/.bashrc
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Install Python 3.10
pyenv install 3.10.14
pyenv global 3.10.14
python --version   # Python 3.10.14
```

> If running as the `deploy` user later, repeat the `echo` lines for that user's `~/.bashrc`.

---

## 3. Install Node.js

> **Not needed on the server.** The Next.js frontend is built locally and only the static `out/` folder is uploaded. Skip this section unless you plan to build on the server.

---

## 4. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 5. Generate SSH Key for GitHub

Generate an SSH key on the server and add it to your GitHub account so you can clone private repositories.

```bash
# Switch to deploy user if not already
su - deploy

# Generate ED25519 key (recommended)
ssh-keygen -t ed25519 -C "deploy@bsm-server" -f ~/.ssh/id_ed25519
# Press Enter twice to skip passphrase (for automated deploys)

# Start SSH agent and add the key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Print the public key — copy this entire output
cat ~/.ssh/id_ed25519.pub
```

Go to **GitHub → Settings → SSH and GPG keys → New SSH key**:
- Title: `bsm-server`
- Key type: `Authentication Key`
- Paste the public key → **Add SSH key**

Verify the connection:

```bash
ssh -T git@github.com
# Expected: Hi YOUR_USERNAME! You've successfully authenticated...
```

> If you have multiple GitHub accounts, add a Host alias in `~/.ssh/config`:
> ```
> Host github-bsm
>     HostName github.com
>     User git
>     IdentityFile ~/.ssh/id_ed25519
> ```
> Then use `git clone git@github-bsm:YOUR_ORG/repo.git`

---

## 6. Clone Repositories

```bash
# Create app directory
sudo mkdir -p /var/www/bsm
sudo chown deploy:deploy /var/www/bsm
cd /var/www/bsm

# Clone backend
git clone git@github.com:YOUR_ORG/bsm-backend.git backend

# Create frontend directory (build will be uploaded here, no clone needed)
mkdir -p /var/www/bsm/frontend/out
```

---

## 7. Backend Setup (Django + Gunicorn)

### 7.1 Virtual environment & dependencies

```bash
cd /var/www/bsm/backend
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

### 7.2 Environment variables

```bash
cp .env.example .env
nano .env
```

Fill in production values:

```env
SECRET_KEY=your-long-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=95.130.227.123
CORS_ALLOWED_ORIGINS=http://95.130.227.123
CSRF_TRUSTED_ORIGINS=http://95.130.227.123
API_KEY=your-api-key-here
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

> Once a domain is pointed at this server, replace `95.130.227.123` with the domain name and switch `http://` to `https://` after Certbot is set up.

> Generate a secret key: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

### 7.3 Migrate, collect static, create superuser

```bash
source .venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 7.4 Test Gunicorn manually

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
# Should say: Listening at: http://0.0.0.0:8000
# Ctrl+C to stop
```

### 7.5 Gunicorn systemd service

```bash
sudo nano /etc/systemd/system/bsm-backend.service
```

Paste:

```ini
[Unit]
Description=BSM Logistics Django Backend
After=network.target

[Service]
User=deploy
Group=www-data
WorkingDirectory=/var/www/bsm/backend
Environment="PATH=/var/www/bsm/backend/.venv/bin"
EnvironmentFile=/var/www/bsm/backend/.env
ExecStart=/var/www/bsm/backend/.venv/bin/gunicorn \
    config.wsgi:application \
    --bind 127.0.0.1:8000 \
    --workers 3 \
    --timeout 30 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile /var/log/bsm/backend-access.log \
    --error-logfile /var/log/bsm/backend-error.log
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```bash
# Create log directory
sudo mkdir -p /var/log/bsm
sudo chown deploy:deploy /var/log/bsm

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable bsm-backend
sudo systemctl start bsm-backend
sudo systemctl status bsm-backend
```

---

## 8. Frontend Build (Next.js Static Export)

Next.js must be configured for static export. On your **local machine**, update `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // Required for static export — disables Next.js built-in image optimization
  images: { unoptimized: true },
}

export default nextConfig
```

> **Note:** Static export disables API routes, middleware, and SSR. All API calls go to the Django backend. This is the correct setup for this project.

Build locally and upload the `out/` folder to the server:

```bash
# On your LOCAL machine (inside the frontend repo)
npm run build
# Produces: out/ folder with static HTML/JS/CSS

# Upload to the server (replace YOUR_SERVER_IP)
rsync -avz --delete out/ root@95.130.227.123:/var/www/bsm/frontend/out/
```

No process to start on the server — Nginx serves these files directly.

---

## 9. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bsm
```

> **Before pasting**, add the rate-limit zone to `/etc/nginx/nginx.conf` inside the `http {}` block:
> ```nginx
> limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;
> ```

Paste:

```nginx
server {
    listen 80;
    server_name 95.130.227.123;

    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css text/xml application/xml;
    gzip_min_length 1000;
    gzip_proxied any;

    # Backend — API and admin
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django static and media — ^~ prevents regex locations from matching these paths
    location ^~ /static/ {
        alias /var/www/bsm/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location ^~ /media/ {
        alias /var/www/bsm/backend/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Frontend — React static build
    location / {
        root /var/www/bsm/frontend/out;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public";
    }

    # Cache hashed JS/CSS bundles for 1 year (filenames change on each build)
    location ~* \.(js|css)$ {
        root /var/www/bsm/frontend/out;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bsm /etc/nginx/sites-enabled/
sudo nginx -t          # test config — must say "syntax is ok"
sudo systemctl reload nginx
```

---

## 10. SSL with Let's Encrypt (Certbot) — do this after pointing a domain at the server

> **Skip this section** while running on a bare IP (`95.130.227.123`). Certbot requires a real domain name. Come back here once DNS is configured.

### 10.1 Update .env for the domain

```env
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Also update `server_name` in `/etc/nginx/sites-available/bsm` from the IP to the domain.

### 10.2 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 10.3 Obtain SSL certificate

```bash
sudo certbot --nginx -d bsm-group.uz -d www.bsm-group.uz
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose **2 — Redirect HTTP to HTTPS** (recommended)

Certbot will automatically update `/etc/nginx/sites-available/bsm` to add SSL.

### 10.4 Verify auto-renewal

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

---

## 11. Final Nginx Config (after Certbot — domain only)

> **Skip this section** while on a bare IP. Apply after running Certbot in Section 10.

After Certbot runs, your config will look like this (you can manually verify/adjust):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css text/xml application/xml;
    gzip_min_length 1000;
    gzip_proxied any;

    # Rate limiting (zone defined in http block)
    limit_req zone=api burst=20 nodelay;

    # Backend — API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # Backend — Admin panel
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django static files
    location /static/ {
        alias /var/www/bsm/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Django media files (uploads)
    location /media/ {
        alias /var/www/bsm/backend/media/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Frontend — React static build (SPA routing via try_files)
    location / {
        root /var/www/bsm/frontend/out;
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public";
    }

    # Long-lived cache for hashed JS/CSS bundles
    location ~* \.(js|css)$ {
        root /var/www/bsm/frontend/out;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 12. Verify Everything

```bash
# Backend service running
sudo systemctl status bsm-backend

# Nginx running
sudo systemctl status nginx

# Test endpoints (HTTP while on bare IP; switch to https://yourdomain.com after SSL)
curl http://95.130.227.123/api/v1/blog/posts/        # should return JSON
curl http://95.130.227.123/api/v1/company/stats/     # should return JSON
curl http://95.130.227.123/admin/                    # should redirect to login
curl http://95.130.227.123/                          # should return React HTML
```

---

## 13. Deployment Updates (re-deploy)

### Update backend

```bash
cd /var/www/bsm/backend
git pull
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart bsm-backend
```

### Update frontend

```bash
# On your LOCAL machine (inside the frontend repo)
npm run build

# Upload new build to the server (replace YOUR_SERVER_IP)
rsync -avz --delete out/ deploy@YOUR_SERVER_IP:/var/www/bsm/frontend/out/

# No process to restart — Nginx picks up the new files immediately
```

---

## 14. Useful Commands

```bash
# View backend logs
sudo journalctl -u bsm-backend -f
tail -f /var/log/bsm/backend-error.log

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart backend
sudo systemctl restart bsm-backend

# Reload Nginx (zero-downtime config reload)
sudo nginx -s reload

# Check listening ports (only 80, 443, 8000 should appear)
ss -tlnp | grep -E '80|443|8000'
```

---

## 15. SQLite Backup (cron)

Since the DB is SQLite, a simple cron backup is enough:

```bash
crontab -e
```

Add:

```cron
# Daily backup at 3 AM
0 3 * * * cp /var/www/bsm/backend/db.sqlite3 /var/backups/db_$(date +\%Y-\%m-\%d).sqlite3
# Keep only last 14 days
0 4 * * * find /var/backups/ -name "db_*.sqlite3" -mtime +14 -delete
```

---

## Checklist

- [ ] Server firewall configured (SSH + Nginx only)
- [ ] Python 3.10 installed
- [ ] Backend `.env` filled with production values (`DEBUG=False`)
- [ ] `migrate` + `collectstatic` + `createsuperuser` done
- [ ] Gunicorn systemd service enabled and running
- [ ] `next.config.ts` has `output: 'export'` + `images: { unoptimized: true }`
- [ ] Frontend built locally (`npm run build`) and `out/` uploaded via rsync
- [ ] Nginx config tested (`nginx -t`) and reloaded
- [ ] All endpoints verified over HTTP on `95.130.227.123`
- [ ] _(later)_ Domain DNS pointed at server
- [ ] _(later)_ SSL certificate issued by Certbot
- [ ] _(later)_ `certbot renew --dry-run` passes
- [ ] _(later)_ All endpoints verified over HTTPS
- [ ] SQLite backup cron configured
