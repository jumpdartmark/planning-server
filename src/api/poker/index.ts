
import { Server } from "socket.io";
import express, { Express, Request, Response } from 'express';
import TempDatabase from "../../db/TempDatabase";

const setResponse = (response:Response, data?:any) => {
    if (data) {
        response.json(data);
    } else {
        response.status(404);
        response.json({error: "the requested poker data could not be found"});
    }
};

const getRouter = (socketIoServer: Server, database: TempDatabase) => {
    const router = express.Router({mergeParams: true});

    router.route('/').get((req, res, next) => {
        res.send(`Planning / Poker api`);
    });

    router.route('/sessions')
        .get((req, res, next) => {
            setResponse(res, database.getPokerSessions());
        })
        .post((req, res, next) => {
            const seshConfig = req.body;
            const session = database.addPokerSession(seshConfig);
            setResponse(res, session);
        });

    router.route('/sessions/:sessionId')
        .get((req, res, next) => {
            const seshID = req.params.sessionId;
            setResponse(res, database.getPokerSessionById(seshID));
        })
        .post((req, res, next) => {
            const seshID = req.params.sessionId;
            const seshConfig = req.body;
            const session = database.modifyPokerSession(seshID, seshConfig);
            setResponse(res, session);
        });

    router.route('/sessions/:sessionId/items')
        .get((req, res, next) => {
            const seshID = req.params.sessionId;
            const data = database.getPokerSessionItems(seshID);
            setResponse(res, data);
        })
        .post((req, res, next) => {
            const seshID = req.params.sessionId;
            const pokerItem = req.body;
            setResponse(res, database.addPokerSessionItem(seshID, pokerItem));
        }); 

    return router;
}

export default getRouter;
