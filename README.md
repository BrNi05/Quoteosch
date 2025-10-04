# Quoteosch API

An API to spread the eternal wisdom of BME lecturers.

## How to use

Explore the API documentation [here](https://quoteosch.sigsegv.hu/).

To fetch a random quote: `https://quoteosch.sigsegv.hu/quote`.

To fetch a random quote from a specific lecturer: `https://quoteosch.sigsegv.hu/quote?lecturer=nickname`.

## How to contribute

Use the dedicated endpoints to suggest a new:

- [lecturer](https://quoteosch.sigsegv.hu/#/ContributeLecturer/suggest)
- [quote](https://quoteosch.sigsegv.hu/#/ContributeQuote/suggest)

> [!IMPORTANT]
> Quotes can only be suggested for lecturers who are already accepted and present in the database.

Explore all quotes: [here](https://quoteosch.sigsegv.hu/quote/verbose).

Explore all lecturers: [here](https://quoteosch.sigsegv.hu/lecturer).

## How to create your own instance

- Clone the repo: `https://github.com/BrNi05/Quoteosch.git`.
- Install dependencies: `npm install`.
- Generate the initial database migration: `npm run db:generate`.
- Run the migration: `npm run db:init`.
- Create your local `.env`.
- Start the app (in dev mode): `npm run start:dev`.
