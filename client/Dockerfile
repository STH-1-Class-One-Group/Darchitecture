FROM node:20-bullseye-slim

WORKDIR /app

ENV EXPO_NO_TELEMETRY=1

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel", "--non-interactive", "--port", "8081"]
