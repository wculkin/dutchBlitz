import {Deck} from "./GameInfo";

export class Player {
  name: string
  games: Map<string, playerGameState>
  constructor(name:string) {
    this.name = name;
    this.games = new Map<string, playerGameState>()
  }
};


export class playerGameState {
  deck: Deck
  score: number

  constructor(deck:Deck) {
    this.deck = deck;
    this.score = -2 * deck.blitzPile.length
  }


}