import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import getApiRouter from "./api";
import TempDatabase from "./db/TempDatabase"

dotenv.config();

//init express
const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT;
app.use(cors()); //todo: update cors when deployed
app.use(express.json());

//init socket.io
const socketIoPort = process.env.API_PORT;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("connection");
  socket.on('join-room', function(room) {
    socket.join(room);
  });
  socket.on('leave-room', function(room) {
    socket.leave(room);
  });  
});

//init db
const db = new TempDatabase();

//init routes
app.get('/', (req: Request, res: Response) => {
  res.send('Planning Server');
});

app.use('/api',getApiRouter(io,db))

httpServer.listen(port);