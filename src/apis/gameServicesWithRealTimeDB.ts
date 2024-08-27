import { Deck } from "../sharedStuff/GameInfo";
import {CardProps, Colors} from "../sharedStuff/cardEnums";
import { PlayerScore } from "../components/Scores/Scores";

export type GameRound = {
    board: { [key: string]: CardProps[] }; // Adjust according to your game state structure
    decks: { [key: string]: Deck };
    scores: { [key: string]: PlayerScore };
    isRoundOver: boolean;
    hasStarted:boolean;
}


// Define the GameState type
export type GameState = {
    totalScores: { [key: string]: PlayerScore };
    gameRounds: GameRound[];
    scoreToPlayTo: number;
    players: string[];
    gameType: string;
    createdAt: Date;
    updatedAt: Date;
}
