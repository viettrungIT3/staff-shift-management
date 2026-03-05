FROM node:20-alpine
WORKDIR /app
COPY src/package*.json ./
RUN npm install
COPY src/ ./src/
CMD ["node", "src/worker/ocr.worker.js"]
