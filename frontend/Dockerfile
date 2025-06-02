# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --frozen-lockfile

COPY frontend/ ./
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
