import { Server } from "socket.io";
import express, { Express, Request, Response } from 'express';
import getPokerRouter from './poker';
import TempDatabase from "../db/TempDatabase";

const getRouter = (socketIoServer: Server, database: TempDatabase) => {
    const router = express.Router({mergeParams: true});

    router.route('/').get((req, res, next) => {
        res.send(`Planning api root`);
    });

    router.use('/poker',getPokerRouter(socketIoServer,database))    

    return router;
}

export default getRouter;