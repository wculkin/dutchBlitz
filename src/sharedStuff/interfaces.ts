export const encodeKey = (key: string): string => {
  return key
    .replace(/\./g, "_dot_")
    .replace(/\//g, "_slash_")
    .replace(/\*/g, "_star_")
    .replace(/`/g, "_backtick_")
    .replace(/\[/g, "_lbracket_")
    .replace(/\]/g, "_rbracket_")
    .replace(/#/g, "_hash_")
    .replace(/\?/g, "_question_")
    .replace(/%/g, "_percent_");
};

export const decodeKey = (key: string): string => {
  return key
    .replace(/_dot_/g, ".")
    .replace(/_slash_/g, "/")
    .replace(/_star_/g, "*")
    .replace(/_backtick_/g, "`")
    .replace(/_lbracket_/g, "[")
    .replace(/_rbracket_/g, "]")
    .replace(/_hash_/g, "#")
    .replace(/_question_/g, "?")
    .replace(/_percent_/g, "%");
};

export enum Colors {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Blank = "Blank"
}


export type CardProps = {
  color: Colors; // Make required if every card needs a color
  number: number;
  owner?: string;
  onClick?: () => void;
  highlighted?: boolean;
  position: number;
  cardPileToReturnTo: string;
}

export type Deck = {
    blitzPile: CardProps[];
    postPile: CardProps[];
    woodPile: CardProps[];
    owner: string;
}

export type PlayerScore = {
    name: string;
    score: number;
    blitzCardsLeft: number;
}

export type Player = {
  id: string;
  name: string;
}

export type UserInformation = {
  id: string;
  name: string;
  gamePlayed:number;
  recentGames: string[]; // this will be a list of game keys
}


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