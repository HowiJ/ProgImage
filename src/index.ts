/** @format */

import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  res.send('ProgImage');
});

app.listen(PORT, () => {
  console.log(`ProgImage on port ${PORT}`);
});
