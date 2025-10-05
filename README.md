# Quoteosch API

An API to spread the eternal wisdom of BME lecturers.

## How to use

Explore the API documentation [here](https://quoteosch.sigsegv.hu/).

To fetch a random quote: `https://quoteosch.sigsegv.hu/quote`.

To fetch a random quote from a specific lecturer: `https://quoteosch.sigsegv.hu/quote?lecturer=ppeti`.

## Terms of Use

- Do not suggest offensive or unwanted content.
- Please do not attempt to overload, spam or DDoS the API.
- Do not scrape, copy, or redistribute API data without proper attribution.

## How to contribute

Use the dedicated endpoints to suggest a:

- [new lecturer](https://quoteosch.sigsegv.hu/#/ContributeLecturer/suggest)
- [new quote](https://quoteosch.sigsegv.hu/#/ContributeQuote/suggest)

> [!TIP]
> You can use `Postman` or `curl` for this, or simply try it directly in Swagger using the `Try it out` feature.

> [!IMPORTANT]
> Quotes can only be suggested for lecturers who are already accepted and present in the database.

Explore all quotes: [here](https://quoteosch.sigsegv.hu/quote/verbose).

Explore all lecturers: [here](https://quoteosch.sigsegv.hu/lecturer).

## How to create your own instance

- Clone the repo: `git clone https://github.com/BrNi05/Quoteosch.git`.

For testing / development:

- Install dependencies: `npm install`.
- Build the project: `npm run build`.
- Run the generated migration(s): `npm run db:init`.
- Create your `.env`.
- Start the app (in dev mode): `npm run start:dev`.
- The `release` folder contains useful resources to host your API.

For production:

- Copy [`docker-compose.yaml`](https://github.com/BrNi05/Quoteosch/blob/main/release/docker-compose.yaml) to a desired location.
- Create your `.env`.
- For the very first time: `docker compose run --rm quoteosch-api-init`.
- Then start the API normally: `docker compose up -d quoteosch-api`.
- The `release` folder contains a script to auto-start the container on boot.

> [!TIP]
> If any changes are made to the database schema, you’ll need to start the migration container again using: `docker compose run --rm quoteosch-api-init`.

## Tech Stack

- NestJS (Node)
- TypeScript
- TypeORM (with SQLite)
- Swagger (OpenAPI)
- Docker
- Cloudflare Tunnel

## Disclaimer

Quoteosch API initially was a joke, but it evolved into a sophisticated project. It's meant for fun and not to offend anyone.
