FROM node:latest

WORKDIR /app
COPY . .
RUN npm ci

EXPOSE 4000
ENTRYPOINT [ "sh", "-c", "npm run $script" ]
