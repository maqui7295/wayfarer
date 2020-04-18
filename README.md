# wayfarer

[![Build Status](https://travis-ci.org/maqui7295/wayfarer.svg?branch=master)](https://travis-ci.org/maqui7295/wayfarer)
[![Coverage Status](https://coveralls.io/repos/github/maqui7295/wayfarer/badge.svg?branch=master)](https://coveralls.io/github/maqui7295/wayfarer?branch=master)

Wayfarer is a trip booking application that was originally based on a challenge provided by Andela. I hope you'll find it useful as a starter app for your Node-ExpressJs project or as an educational material. It includes a simple class to manage SQL queries for postgreSQL which I may develop into a full query builder. Documentation of the APIs can be found [here](https://markwayfarer.docs.apiary.io/)

## Installation

    git clone https://github.com/maqui7295/wayfarer

    cd wayfarer

    yarn install

Next, install postgresql on your local machine and on the terminal, create a database using

    set PGUSER=postgres

    createdb dbname

Or you can use [pgAdmin](https://www.pgadmin.org/) to manage your postgreSQL backend. You can find more information [here](https://www.postgresql.org/docs/11/index.html)

## Usage

To run the application, cd into the root directory and run

    yarn start

This (yarn start) creates the tables and populate it with some dummy data because it runs

    yarn run initdb

Tests, both unit and integration written with [Jasmine](https://jasmine.github.io/) and [supertest](https://www.npmjs.com/package/supertest) can be run with

    yarn test.
