# Step 1: Build the typescript
FROM node:20.15 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Step 2: Build the final image using artefacts from above
FROM node:20.15-alpine

ENV NODE_ENV=production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 80

CMD [ "node", "dist/index.cjs" ]
