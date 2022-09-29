import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import getApiRouter from "./api";
import TempDatabase from "./db/TempDatabase";
import PlanningSocketManager from "./socketio/PlanningSocketManager";

dotenv.config();

//init express
const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT;
app.use(cors()); //todo: update cors when deployed
app.use(express.json());

//init db
const db = new TempDatabase();

//init socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const socketManager = new PlanningSocketManager(io,db);

io.on("connection", (socket) => {
  socketManager.configureSocketConnection(socket);
});


//init routes
app.get('/', (req: Request, res: Response) => {
  res.send('Planning Server');
});

app.use('/api',getApiRouter(socketManager,db))

httpServer.listen(port);