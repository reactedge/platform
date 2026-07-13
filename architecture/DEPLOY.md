# ReactEdge Deployment Guide

## Widget Deployment Model

All ReactEdge widgets are deployed using **GitHub Actions CI**.

Each widget repository contains its own workflow that:

1.  Builds the widget bundle (Vite IIFE).
2.  Syncs the widget runtime file to the server.
3.  Updates the CDN widget file.

Deployment uses **rsync over SSH**.

Server file ownership:

user: github-deploy\
group: www-data

This allows CI to deploy files while the web server serves them.

------------------------------------------------------------------------

# Creating a New CI Workflow

All widget workflows follow the same structure.

## Required GitHub Environment

Environment name:

reactedge

## Required Secrets

WIDGET_SSH_HOST -- widget server hostname\
WIDGET_SSH_USER -- github-deploy\
WIDGET_SSH_KEY -- private SSH key

------------------------------------------------------------------------

# CI Deployment Steps

1.  Checkout repository
2.  Install dependencies

```{=html}
<!-- -->
```
    npm install

3.  Build widget

```{=html}
<!-- -->
```
    npm run build

This produces the Vite **IIFE bundle**.

Example output:

    dist/widget.iife.js

4.  Setup SSH

The workflow loads the deployment key and registers the server in
`known_hosts`.

5.  Deploy files with rsync

Files deployed:

-   widget runtime file
-   CDN widget file

Example:

    rsync -avzr --delete dist/ WIDGET_SSH_USER@WIDGET_SSH_HOST:/var/www/widgets/<widget>/

------------------------------------------------------------------------

# Widgets Requiring Backend Services

Some widgets require additional services.

Examples:

-   intent discovery
-   AI suggestions
-   store search

These services must enable **CORS** to allow frontend widget domains.

Example allowed origins:

-   mageosuk.reactedge.net
-   mageosfr.reactedge.net

------------------------------------------------------------------------

# Nginx Widget vhost Template

    server {
        listen 443 ssl;
        server_name widget-<widget>.reactedge.net;

        ssl_certificate /etc/letsencrypt/live/widget-<widget>.reactedge.net/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/widget-<widget>.reactedge.net/privkey.pem;

        root /var/www/widgets/<widget>;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }

        location ~* \.(js|css)$ {
            add_header Cache-Control "public, max-age=31536000, immutable";
            try_files $uri $uri/ =404;
        }

        # This section is required only if the widget uses an external contract
        location /cdn/ {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Content-Type" always;
        }
    }

------------------------------------------------------------------------

# Node / Express Service vhost Template

    server {
        server_name <service>.reactedge.net;

        location / {
            proxy_pass http://127.0.0.1:<port>;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_http_version 1.1;
            proxy_set_header Connection "";
        }
    }

Enable SSL:

    sudo certbot --nginx -d <service>.reactedge.net

------------------------------------------------------------------------

# Starting a Node / Express Service

    sudo su - github-deploy
    cd /var/www/<node-folder>
    pm2 start <service-name>

Restart service after deployment:

    pm2 restart <service-name>

Useful PM2 commands:

Check services:

    pm2 status

Logs:

    pm2 logs <service-name>

Restart all services:

    pm2 restart all

------------------------------------------------------------------------

# Architecture Overview

    Nginx
       │
       ├─ widget-*.reactedge.net  → static widgets
       │
       └─ *.reactedge.net         → Node services
                │
                └─ PM2
                    │
                    └─ Express apps


### Verifying the ports used for each docker containers
docker ps --filter "name=nginx_" --format "{{.Names}} {{.Ports}}"