##### Stage 1: Build Quoteosch #####

FROM node:lts-alpine AS build

WORKDIR /quoteosch

COPY package*.json ./

RUN npm ci --ignore-scripts --silent

COPY . .

RUN npm run build

##### Stage 2: Production #####

FROM node:lts-alpine

WORKDIR /quoteosch

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev --omit=optional --silent

COPY --from=build /quoteosch/dist ./dist

# Copy static assets (Swagger UI customization)
COPY public ./public

CMD ["node", "dist/main.js"]