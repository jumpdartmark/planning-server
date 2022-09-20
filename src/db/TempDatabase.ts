import { v4 as uuidv4 } from 'uuid';

import { PokerSession, PokerSessionConfig, PokerItem, PokerVote } from "../types";

const getId = (currentIDs: string[]):string => {
    const testId = uuidv4().substring(0,5);
    if (currentIDs.includes(testId)){
        return getId(currentIDs);
    } else {
        return testId;
    }
}

const mockSession: PokerSession = {
    id: getId([]),
    config: {
        name: "Hard Coded Session",
        cardOptions: ["1","2","3","5","8","?"]
    },
    items: [
        {
            id: getId([]),
            title: "PR-12345",
            description: "the ticket where we implement the feature",
            votes: [],
        }
    ],
    participants: []
};

class TempDatabase{
    #pokerSessions: PokerSession[];
    constructor(){
        this.#pokerSessions = [mockSession];
    }

    getPokerSessions(){
        return this.#pokerSessions;
    }

    getPokerSessionById(sessionId:String){
        const session = this.#pokerSessions.find(s=>s.id===sessionId);        
        return session;
    }

    getPokerSessionItems(sessionId:String){
        const session = this.getPokerSessionById(sessionId);
        return session?.items;
    }

    getPokerSessionParticipants(sessionId:String){
        const session = this.getPokerSessionById(sessionId);
        return session?.participants;
    }

    addPokerSession(config: PokerSessionConfig){
        const newId = getId(this.#pokerSessions.map(s=>s.id));
        const newSession:PokerSession = {
            id: newId,
            config,
            items: [],
            participants: [],
        };
        this.#pokerSessions.push(newSession);
        return newSession;
    }

    modifyPokerSession(sessionId:String, config: PokerSessionConfig){
        const session = this.getPokerSessionById(sessionId);
        if(session?.config){
            session.config = config;
        }
        return session;
    }

    addPokerSessionItem(sessionId:String, title:string, description?: string){
        const session = this.getPokerSessionById(sessionId);
        if(session?.items){
            const itemIds = this.#pokerSessions.reduce((aggregate, s) => {
                const newResults = [...aggregate];
                s.items.forEach((si)=>{
                    newResults.push(si.id)
                });
                return newResults;
            }, [] as string[]);
            const newId = getId(itemIds);
            session.items.push();
        }
        return session;
    }

    getSessionItem(sessionItemId:string){
        const sessionItemQuery = (si:PokerItem) => {
            si.id === sessionItemId;
        }
        const thisSession = this.#pokerSessions.find((s)=>{
            s.items.some(sessionItemQuery);
        });
        if(thisSession){
            return thisSession.items.find(sessionItemQuery);
        } else {
            return;
        }
    }

    editPokerSessionItem(itemChanges: PokerItem){
        const item = this.getSessionItem(itemChanges.id);
        if(item){
            item.title = itemChanges.title;
            item.description = itemChanges.description;
            item.consensus = itemChanges.consensus;
        }
        return item;
    }

    removePokerSessionItem(sessionItemId: string){
        const sessionItemQuery = (si:PokerItem) => {
            si.id === sessionItemId;
        }
        const thisSession = this.#pokerSessions.find((s)=>{
            s.items.some(sessionItemQuery);
        });
        if(thisSession){
            const indx = thisSession.items.findIndex(sessionItemQuery);
            thisSession.items.splice(indx, indx >= 0 ? 1 : 0);
        }
        return thisSession;
    }

    voteOnPokerSessionItem(sessionItemId: string, playerId: string, vote?: string){
        const item = this.getSessionItem(sessionItemId);
        const previousVoteIndx = item?.votes.findIndex((v)=>v.playerId === playerId);
        if(item && vote && previousVoteIndx){
            item.votes[previousVoteIndx].vote = vote;
        } else if (item && vote && !previousVoteIndx) {
            const newVote:PokerVote = { playerId, vote };
            item.votes.push(newVote);
        } else if (item && !vote && previousVoteIndx) {
            item.votes.splice(previousVoteIndx, previousVoteIndx >= 0 ? 1 : 0);
        }
        return item;
    }
};

export default TempDatabase