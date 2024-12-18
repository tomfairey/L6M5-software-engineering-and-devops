# Step 1: Build the application
FROM node:20.15 AS builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

# Execute the build command
RUN npm run build

# Step 2: Build the final image using artefacts from above
FROM nginx:1.27-alpine-slim

# Copy in the nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Create app directory
WORKDIR /usr/share/nginx/html

COPY --from=builder /usr/src/app/dist .

EXPOSE 80

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
