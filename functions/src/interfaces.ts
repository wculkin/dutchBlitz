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
