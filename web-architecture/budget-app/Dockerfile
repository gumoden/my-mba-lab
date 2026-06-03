# Stage 1 — build the React app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 — production image
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js ./
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "server.js"]
