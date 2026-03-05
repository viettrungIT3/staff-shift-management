FROM node:20-alpine
WORKDIR /app
COPY src/package*.json ./
RUN npm install
COPY src/ ./src/
EXPOSE 8080
CMD ["node", "src/api/app.js"]
