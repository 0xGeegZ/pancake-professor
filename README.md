# Pancake Professor

Welcome to Pancake Professor! 👋

## Getting started

### Initial setup

You'll need certain environment variables to run Pancake Professor's functionality in local development. The first step is to:

- OPTIONNAL : Sign up for [Stripe](https://stripe.com), used for payments
- OPTIONNAL : Sign up for [Postmark](https://postmarkapp.com), used for sending emails

Then, copy `.env.example` to `.env` and fill out the `.env` file with your environment variables!

```sh
cp .env.example .env
```

```sh
cp .env.local.example .env.local
```

> Note: do not delete the `.env.example` file, as it's used by some code generation processes and is useful for potential future team members as a reference.

Now you're ready to set everything up locally:

1. **Install Docker** by following their [installation instructions for your OS](https://docs.docker.com/get-docker/). Pancake Professor uses Docker to start the local development database.

2. Then, **install the dependencies** with `yarn`:

```sh
yarn
```

3. **Start the local development database** as well as the Stripe CLI webhook listener (to make payments work) with `docker-compose`:

```sh
docker-compose up
```

4. OPTIONNAL : **Copy the webhook secret** that the Stripe CLI logged, something like "> Ready! Your webhook signing secret is whsec\_\*\*\*". Copy that secret and add it to your `.env` file.

5. **Migrate your local development database** to the base schema:

```sh
yarn prisma:migrate
```

### Development workflow

To develop your app, you always need to have two commands running concurrently:

1. **Start the development database** with:

```sh
docker-compose up
```

2. **Start the development process**, which also runs all the necessary code generators:

```sh
yarn dev
```

That's it! Now you should have Pancake Professor running locally and should be able to visit <http://localhost:3000> 🎉

#### Scripts

The **three most important commands** you'll run frequently during development:

- `yarn generate`: Generates the Prisma client ([docs](https://www.prisma.io/docs/concepts/components/prisma-client)), which Nexus uses and generates the GraphQL schema ([docs](https://nexusjs.org/docs/guides/generated-artifacts)), which GraphQL Codegen uses and generates the urql hooks ([docs](https://graphql-code-generator.com/docs/plugins/typescript-urql)). Run this whenever you change the database schema, GraphQL schema or GraphQL queries.

- `yarn prisma:migrate`: Creates migration files from your Prisma schema changes and runs those migrations on your local dev db ([docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)). Run this whenever you change your database schema.

- `yarn prisma:studio`: Starts [Prisma Studio](https://prisma.io/studio) on `localhost:5555` where you can inspect your local development database.

All the others are used in CI or by those three main scripts, but you should only rarely need to run them manually.

---

For more information, check out [the in-depth docs](./docs/README.md)

## Notes and usefuls links

A simple way to clean up your git project branches
<https://medium.com/@FlorentDestrema/a-simple-way-to-clean-up-your-git-project-branches-283b87478fbc>

---
