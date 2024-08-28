import {PlayerScore} from "./interfaces";

export interface WaitingRoom {
  id: string;
  players: string[];
  firstRound: boolean;
  isGameOver: boolean;
  roundInProgress: boolean;
  hasTheGameStarted: boolean;
  gameType: string;
  route?: string;
  scores?: { [key: string]: PlayerScore };
}
