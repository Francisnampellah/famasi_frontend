FROM node:18-alpine AS base

# Install curl
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build application
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=base /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 