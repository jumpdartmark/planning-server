
import { Server, Socket } from "socket.io";

import {PokerPlayerMessage} from "../types";

export const getJoinRoomHandler = (io:Server, socket: Socket ) => (message:PokerPlayerMessage) => {
    const roomName = message.payload;
    socket.join(roomName);
}

export const getLeaveRoomHandler = (io:Server, socket: Socket ) => (message:PokerPlayerMessage) => {
    const roomName = message.payload;
    socket.join(roomName);
}

export const configureSocketConnection = (io:Server, socket: Socket) => {
    socket.on('join-room', getJoinRoomHandler(io,socket));
    socket.on('leave-room', getLeaveRoomHandler(io,socket));  
};
