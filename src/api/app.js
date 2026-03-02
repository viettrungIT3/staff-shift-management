'use strict';

const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log("API listening on port ");
});
