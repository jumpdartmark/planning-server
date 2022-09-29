import express, { Express, Request, Response } from 'express';
import getPokerRouter from './poker';
import TempDatabase from "../db/TempDatabase";
import PlanningSocketManager from "../socketio/PlanningSocketManager";

const getRouter = (socketManager: PlanningSocketManager, database: TempDatabase) => {
    const router = express.Router({mergeParams: true});

    router.route('/').get((req, res, next) => {
        res.send(`Planning api root`);
    });

    router.use('/poker',getPokerRouter(socketManager,database))    

    return router;
}

export default getRouter;