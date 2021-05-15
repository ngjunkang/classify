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
