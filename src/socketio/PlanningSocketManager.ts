
import { Server, Socket } from "socket.io";
import TempDatabase from "../db/TempDatabase";

import { PlanningMessage } from "../types";
import CONSTANTS from "../constants";

export class PlanningSocketManager{
    #io: Server;
    #db: TempDatabase;
    constructor(io:Server, db: TempDatabase){
        this.#db = db;
        this.#io = io;          
    }

    emitPokerSessionUpdate = (sessionId: string) => {
        this.#io.to(`${CONSTANTS.MESSAGING.POKER_ROOM_KEY}-${sessionId}`).emit("poker-session-update");

    }

    getJoinRoomHandler = (socket: Socket ) => (message:PlanningMessage) => {
        const roomName = message.payload;
        socket.join(roomName);
        const roomNameParts = roomName.split('-')
        if (roomNameParts.length === 3){
            const sessionId = roomNameParts[2];
            this.#db.addUserToPokerSession(sessionId, message.user);
        }
    }
    
    getLeaveRoomHandler = (socket: Socket ) => (message:PlanningMessage) => {
        const roomName = message.payload as string;
        socket.join(roomName);
        const roomNameParts = roomName.split('-')
        if (roomNameParts.length === 3){
            const sessionId = roomNameParts[2];
            this.#db.removeUserFromPokerSession(sessionId, message.user);
        }
    }    
    configureSocketConnection = (socket: Socket) => {
        socket.on(CONSTANTS.MESSAGING.JOIN_ROOM_MESSAGE, this.getJoinRoomHandler(socket));
        socket.on(CONSTANTS.MESSAGING.LEAVE_ROOM_MESSAGE, this.getLeaveRoomHandler(socket));  
    };
}

export default PlanningSocketManager;
