import express from 'express';
import dotenv from 'dotenv';
import { APIResponse } from 'shared-types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  const response: APIResponse = { message: 'API is healthy!' };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
