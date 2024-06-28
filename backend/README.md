# Backend

This project is made with Nodejs, Hono and Drizzle ORM and runs on Cloudflare Workers and D1.

## Installation

```
npm install
```

## Configuration

Before running the project on local, copy and paste the `.dev.vars.example` file, rename it to `.dev.vars` and fill in the variables.

## Development

It is recommended to install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), the CLI development tool for Cloudflare.
```
npm run dev
```

## Migrations

These are some useful commands during development. Before running them, keep in mind you may have to modify the database name in the `package.json` file.

```sh
# To generate migrations after modifying the models
npm run db:generate

# To apply migrations
npm run db:apply # for local
npm run db:apply:r # for remote

# To reset the database (i.e dropping all tables)
npm run db:reset
npm run db:reset:r # for remote
```

## Secrets

To save a secret (environment variable) on Cloudflare, you can run:
```sh
npx wrangler secret put <KEY>
```

## Deploy

To deploy the project on Cloudflare you can run:
```sh
npm run deploy
```