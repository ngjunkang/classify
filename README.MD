# Developer's Guide

## Environment setup

Ensure you have these installed:

1. PostgreSQL (https://www.postgresql.org/download/)
2. NodeJS (https://nodejs.org/en/download/)
3. Redis (Google how to install this, may differ across platforms)
4. Visual Studio Code (Optional)

### PostgreSQL Setup

For first-time installation/beginners, follow these steps after the installation (non-first-timers should know what to do). Note this is only for development environment.

#### a. Change CLI user to postgres (Make sure you start the PostgreSQL service before this - Google it)

    # sudo su postgres

#### b. Login into postgres via peer authentication through postgres user

    postgres@...# psql

#### c. Change password to 'postgres'

    postgres=# \password

#### d. Exit psql

    postgres=# \q

#### e. Create a database using postgres user, named 'classify'

    postgres@...# createdb classify

#### f. Exit postgres user

    postgres@...# exit

#### g. Then restart PostgreSQL service

### NodeJS Setup

#### a. Install yarn globally for easy usage

    # npm install -g yarn

### Clone Repository to Local

    # git clone https://github.com/ngjunkang/classify.git

### Go to respective folder to download required node modules

    # cd classify/frontend
    # cd classify/frontend

    # yarn

## Backend Yarn commands as configured in package.json under scripts

### To convert TypeScript files in src to JavaScript files in dist and watch for changes in the TypeScript files

    # yarn watch

### To run the converted Javascript files in dist and watch for changes

    # yarn dev

## Deployment

### Environment file (for ease of switching between development and production)

Copy the template from .env.example to a new file .env. The format of the variables is as follows:

1. DATABASE_URL=databaseType://username:password@host:port/databaseName
   E.g. DATABASE_URL=postgresql://postgres:postgres@localhost:5432/classify
2. REDIS_URL=host:port
   E.g. REDIS_URL=localhost:6379 (Set this as default)
3. PORT=port
   E.g. PORT=4000
4. SESSION_SECRET=randomString
   E.g. SESSION_SECRET=hkjasdnmfdeeadsldxfdhderaqwqaq
5. CORS_ORIGIN=clientAddress
   E.g. CORS_ORIGIN=http://localhost:3000
6. EMAIL=gmailToSendEmailFrom
7. EMAIL_PASSWORD=gmailPassword

Extra environment variables for production only:

1. CDOMAIN=domainName
   E.g. CDOMAIN=.classify.page
2. NODE_ENV=production

#### Run this when you add new environment variables:

    npx gen-env-types .env -o src/env.d.ts -e .
    OR
    yarn gen-env
