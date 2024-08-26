import {PlayerScore} from "./interfaces";

export interface WaitingRoom {
  id: string;
  players: string[];
  firstRound: boolean;
  hasStarted: boolean;
  isGameOver: boolean;
  roundInProgress: boolean;
  gameType: string;
  route?: string;
  scores?: PlayerScore[];
}
