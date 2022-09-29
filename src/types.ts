export interface PlanningUser{
    name?: string;
    id:string;
}

export interface PokerVote{
    playerId: string;
    vote: string;
}

export enum PlayerRole{
    Spectator = 0,
    Player = 1,
}

export interface PokerItem{
    id: string;
    title: string;
    description?: string;
    consensus?: number;
    votes: PokerVote[];
}

export interface PokerSessionConfig{
    name: string;
    cardOptions: string[]
}

export interface PokerParticipant{
    id: string;
    name: string;
    isActive: boolean;
    role: PlayerRole;
    socketId?: string;
}

export interface PokerSession{
    id: string;
    config: PokerSessionConfig;
    items: PokerItem[];
    participants: PokerParticipant[];
}

export interface PlanningMessage{
    user: PlanningUser;
    payload: any;
}
