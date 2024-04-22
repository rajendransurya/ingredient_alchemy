#FROM nginx
#COPY . /usr/share/nginx/html
FROM node:14-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src

COPY public/ ./public

RUN npm run build

FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 8085

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
