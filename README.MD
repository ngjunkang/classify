# Developer's Guide

- [Environment setup](#environment-setup)
  - [PostgreSQL Setup](#postgresql-setup)
  - [NodeJS Setup](#nodejs-setup)
  - [Clone Repository to Local](#clone-repository-to-local)
  - [Node Module Installation](#node-module-installation)
- [Yarn commands](#yarn-commands)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Frontend Deployment](#frontend-deployment)
  - [Frontend Environment file](#frontend-environment-file)
  - [Vercel Deployment](#vercel-deployment)
- [Backend Deployment](#backend-deployment)
  - [Backend Environment file](#backend-environment-file)
  - [Backend Server Deployment](#backend-server-deployment)
    - [Installation](#installation)
    - [Environment Setup](#environment-setup)

## Environment setup

Ensure you have these installed:

1. PostgreSQL (https://www.postgresql.org/download/)
2. NodeJS (https://nodejs.org/en/download/)
3. Redis (Google how to install this, may differ across platforms)
4. Visual Studio Code (Optional)

### PostgreSQL Setup

For first-time installation/beginners, follow these steps after the installation (non-first-timers should know what to do). Note this is only for development environment.

1.  Change CLI user to postgres (Make sure you start the PostgreSQL service before this - Google it)

        sudo su postgres

2.  Login into postgres via peer authentication through postgres user

        psql

3.  Change password to 'postgres'

        \password

4.  Exit psql

        \q

5.  Create a database using postgres user, named 'classify'

        createdb classify

6.  Exit postgres user

        exit

7.  Then restart PostgreSQL service

### NodeJS Setup

Install yarn globally for easy usage

    npm install -g yarn

### Clone Repository to Local

    git clone https://github.com/ngjunkang/classify.git

### Node Module Installation

```
# Go to respective folder
cd classify/frontend
cd classify/backend

# To download required node modules
yarn
```

## Yarn commands

NodeJs allows us to configure alias to run commands, under scripts in package.json, and we can run it with 'yarn SCRIPT_NAME'.

### Frontend

```
# To compile and run the NextJS application, and watch for changes (run this during development)
yarn dev

# To compile the NextJS application into JavaScript files in .next directory
yarn build

# To run the JavaScript files in .next directory
yarn start

# To generate the types for each variables in the GraphQL schemas
yarn gen
```

### Backend

```
# To compile TypeScript files in src into JavaScript files in dist and watch for changes in the TypeScript files (run this during development)
yarn watch

# To run the compiled Javascript files in dist and watch for changes (run this during development)
yarn dev

# To compile TypeScript files in src into JavaScript files in dist
yarn build

# To run the compiled Javascript files in dist
yarn start

# To generate the types of the environment variables configured in .env into src/env.d.ts as well as the .env.example file for environment variables checking
yarn gen-env
```

## Frontend Deployment

### Frontend Environment file

Create a file called .env.local in the frontend directory and it should contain:

    NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

\*Note: Any variables must be preceded by NEXT_PUBLIC\_

### Vercel Deployment

1. Sign up for Vercel.
2. Link your Git account to Vercel.
3. Choose the repository you want to deploy and choose NextJS as the Framework Preset and change the directory to deploy to frontend.
4. Wait for it to deploy.
5. Go to project settings.
6. Add a environment variable called NEXT_PUBLIC_API_URL with a value of https://api.classify.page/graphql
7. Also go to Domain settings and follow the instructions to link to your domain name provider.

## Backend Deployment

### Backend Environment file

This setup is for ease of switching between development and production.

Copy the template from .env.example to a new file .env in the backend directory. The format of the variables is as follows:

1.  DATABASE_URL=databaseType://username:password@host:port/databaseName

        DATABASE_URL=postgresql://postgres:postgres@localhost:5432/classify

2.  REDIS_URL=host:port

        REDIS_URL=localhost:6379 (Set this as default)

3.  PORT=port

        PORT=4000

4.  SESSION_SECRET=randomString

        SESSION_SECRET=hkjasdnmfdeeadsldxfdhderaqwqaq

5.  CORS_ORIGIN=clientAddress

        CORS_ORIGIN=http://localhost:3000

6.  EMAIL=gmailToSendEmailFrom
7.  EMAIL_PASSWORD=gmailPassword

Extra environment variables for production only:

1. CDOMAIN=domainName
   E.g. CDOMAIN=.classify.page
2. NODE_ENV=production

Note: Run this when you add new environment variables:

    npx gen-env-types .env -o src/env.d.ts -e .
    OR
    yarn gen-env

### Backend Server Deployment

This basic guide is only applicable for Linux server, specifically Ubuntu/Debian. Not applicable to large servers in enterprise.

#### Installation

1.  Update the dependency repository information (or the software versions that the system requires)

    ```
    sudo apt-get update
    ```

2.  Install Node.js v16.x from NodeSource Binary Distributions (comes with npm)

    ```
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

3.  Install Nginx

    ```
    sudo apt-get install nginx
    ```

4.  Install UFW (a simpler IP table)

    ```
    sudo apt-get install ufw
    ```

5.  Install Redis

    ```
    sudo apt-get install redis-server
    ```

6.  Install PostgreSQL

    ```
    # Create the file repository configuration:
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

    # Import the repository signing key:
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

    # Update the package lists:
    sudo apt-get update

    # Install the latest version of PostgreSQL.
    sudo apt-get -y install postgresql
    ```

7.  Install Git

    ```
    sudo apt-get install git
    ```

8.  Install Certbot for installing HTTPS Certificate

    ```
    # Add Certbot’s repository
    sudo add-apt-repository ppa:certbot/certbot

    # Update your package lists
    sudo apt-get update

    # Install Certbot and additional required packages:
    sudo apt-get install certbot python-certbot-nginx
    ```

#### Environment Setup

1.  Set up [PostgreSQL](#postgresql-setup) and [NodeJS](#nodejs-setup) (use sudo) as above.

2.  Set up UFW

    ```
    # Ensure startup on boot
    sudo ufw enable

    # Allow routing on TCP Port 80 (HTTP) and 443 (HTTPS)
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp

    # Reload firewall
    sudo ufw reload

    # Ensure that the routing table is correct
    sudo ufw status
    ```

3.  Start Redis and ensure that it's working

    ```
    # Start Redis server
    sudo systemctl start redis

    # Run Redis CLI
    redis-cli

    # Test
    ping
    returns PONG
    ```

4.  Clone project to server

    ```
    git clone https://github.com/ngjunkang/classify.git
    ```

5.  Create the environment file, .env as stated above

6.  Go to backend and install the required node modules

    ```
    # Change directory
    cd classify/backend

    # Install the required node modules
    yarn
    ```

7.  Compile the backend code

    ```
    yarn build
    ```

8.  Set up system unit file to run backend as a service

    ```
    # Open a editor for the service file of classify
    sudo nano /etc/systemd/system/classify.service

    # Contents of /etc/systemd/system/classify.service (Note: replace <...> with your ...)
    [Unit]
    Description=Classify backend express API
    After=network.target
    Wants=redis.service

    [Service]
    User=<YOUR USERNAME>
    Group=www-data

    WorkingDirectory=<ABSOLUTE DIRECTORY OF PROJECT>/classify/backend
    Environment=CDOMAIN=.classify.page
    Environment=NODE_ENV=production
    EnvironmentFile=<ABSOLUTE DIRECTORY OF PROJECT>/classify/backend/.env

    ExecStart=/usr/bin/node <ABSOLUTE DIRECTORY OF PROJECT>/classify/backend/dist/index.js

    Restart=always
    RestartSec=3

    [Install]
    WantedBy=multi-user.target

    # End of file

    # Reload daemon
    sudo systemctl daemon-reload

    # Enable start-on-boot
    sudo systemctl enable classify

    # Start Classify service
    sudo systemctl start classify

    # To check the service logs
    sudo journalctl -u classify
    ```

9.  Set up Nginx server file to run a reverse proxy in front of the Node application

    ```
    # Open a editor for the server file of classify
    sudo nano /etc/nginx/sites-available/classify

    # Contents of /etc/nginx/sites-available/classify (Note: This is assuming that Classify runs on port 1234, feel free to change it!)

    server {
        listen 80;
        server_name api.classify.page;

        location / {
            proxy_pass http://localhost:1234;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

    # End of file
    # Check the syntax of the file
    sudo nginx -t

    # Enable the site by creating symbolink
    sudo ln -s /etc/nginx/sites-available/classify /etc/nginx/sites-enabled

    # Start/restart Nginx service
    sudo systemctl restart nginx
    ```

10. Port forward the IP address of your server out to the Wide Area Network (WAN) using your router (http://192.168.1.254). Example:

    | LAN Port Range | WAN Port Range | TCP/UDP  | IP Address of server |
    | -------------- | -------------- | -------- | -------------------- |
    | 443 ~ 443      | 443 ~ 443      | TCP only | 192.168.1.23         |
    | 80 ~ 80        | 80 ~ 80        | TCP only | 192.168.1.23         |

    \*Note: Also recommended to set a static DHCP for your server.

11. Install HTTPS certificates & convert the server file to HTTPS (Follow the CLI wizard)

    ```
    sudo certbot --nginx
    ```
