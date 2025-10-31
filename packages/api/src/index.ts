
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import 'reflect-metadata';
import http from 'http';
import { setupChatServer } from './chat/chatio';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', router);

const server = http.createServer(app);
setupChatServer(server);

server.listen(port, () => {
  console.log(`Server and Socket.io running on port ${port}`);
});
