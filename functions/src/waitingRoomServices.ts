import {PlayerScore} from "./interfaces";

export interface WaitingRoom {
  id: string;
  players: string[];
  firstRound: boolean;
  isGameOver: boolean;
  roundInProgress: boolean;
  gameType: string;
  route?: string;
  scores?: PlayerScore[];
}
