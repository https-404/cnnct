
import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import 'reflect-metadata';
import http from 'http';
import { setupChatServer } from './chat/chatio';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', router);

const server = http.createServer(app);
setupChatServer(server);

server.listen(port, () => {
  console.log(`Server and Socket.io running on port ${port}`);
});
