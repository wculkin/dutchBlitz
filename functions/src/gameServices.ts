import {CardProps, Colors, Deck, Player, PlayerScore} from "./interfaces";
import {arrayUnion} from "firebase/firestore";
import {encodeKey, IS_ROUND_OVER} from "./playerMoveHandler";


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


// Throw error if no new round
export function getCurrentRoundNumber(gameState: GameState) : number {
  for (let i = 0; i < gameState.gameRounds.length; i++) {
    if (!gameState.gameRounds[i].isRoundOver) {
      return i;
    }
  }
  throw new Error("No current active round");
}


export function calculateRoundScore(deck: Deck) {
  const negatives = deck.blitzPile.length * -2;
  const positives = (10 - deck.blitzPile.length) + (3 - deck.postPile.length) + (27 - deck.woodPile.length);
  return {name: deck.owner as string, score: (negatives+positives), blitzCardsLeft: deck.blitzPile.length};
}

export function calculateTotalScores(roundScores: { [key: string]: PlayerScore }, totalScores: { [key: string]: PlayerScore } ) {
  for (const key of Object.keys(roundScores)) {
    if (!totalScores[key]) {
      throw new Error(`Invalid key key in roundScores not in totalScores: ${key}`);
    }
    totalScores[key].score = totalScores[key].score + roundScores[key].score;
  }
  return totalScores;
}

export const removeCardFromPlayerHand = (card: CardProps, deck:Deck, playerName:string) => {
  const matchesCard = (c: CardProps) => c.color === card.color && c.number === card.number;

  // Move a card from blitzPile to postPile if needed
  if (deck.postPile.some(matchesCard) && deck.blitzPile.length) {
    // Find the card to move in blitzPile
    const moveOver = deck.blitzPile.pop();
    deck.postPile.push(moveOver as CardProps);
  }

  console.log("the card is ", card);

  // Remove the card from each pile by comparing color and number
  const curBlitzPile = deck.blitzPile.filter((c) => !matchesCard(c));
  const curPostPile = deck.postPile.filter((c) => !matchesCard(c));
  const curWoodPile = deck.woodPile.filter((c) => !matchesCard(c));
  return {
    blitzPile: curBlitzPile,
    postPile: curPostPile,
    woodPile: curWoodPile,
    owner: playerName,
  };
};

export function validateMoveIsValid(curRound:GameRound, cardToAddToBoard:CardProps, positionOnBoard:number) {
  if (cardToAddToBoard == null) {
    return false;
  }
  const cardsOnStack:CardProps[] = curRound.board[positionOnBoard];
  if (!cardsOnStack || cardsOnStack.length === 0) {
    return false;
  }
  let currentTopCardOnBoard:CardProps = cardsOnStack[0];
  for (let i = 0; i < cardsOnStack.length; i++) {
    if (currentTopCardOnBoard.number < cardsOnStack[i].number) currentTopCardOnBoard = cardsOnStack[i];
  }
  if (cardToAddToBoard.number - 1 !== currentTopCardOnBoard.number) {
    return false;
  }
  if (currentTopCardOnBoard.color !== Colors.Blank && currentTopCardOnBoard.color !== cardToAddToBoard.color) {
    return false;
  }
  return true;
}


export function createUpdates(position:number, encodedName: string, cardToAddToBoard:CardProps, playerDeck:Deck) {
  const updates: { [key: string]: any } = {};
  const updatedPlayerHand = removeCardFromPlayerHand(cardToAddToBoard, playerDeck, encodedName);
  const isOver = updatedPlayerHand.blitzPile.length === 0 ? true: false;
  cardToAddToBoard.position = position;
  updates[`board/${position}`] = arrayUnion(cardToAddToBoard);
  updates[`decks/${encodedName}`] = updatedPlayerHand;
  updates[`scores/${encodedName}`] = calculateRoundScore(updatedPlayerHand);
  if (IS_ROUND_OVER) updates[IS_ROUND_OVER] = isOver;
  return updates;
}

export function createNewGameState(players: string[], scoreToPlayTo:number, gameType: string): GameState {
  const round1 = createGameRound(players, true);
  return {
    gameType,
    gameRounds: [round1],
    totalScores: round1.scores,
    scoreToPlayTo,
    players,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}


export function getNewRound(players: string[]): GameRound {
  return createGameRound(players, false);
}

function createGameRound(players: string[], isFirst: boolean) {
  const gameBoard: { [p: string]: CardProps[] } = createGameBoard(players.length);
  const decks: { [key: string]: Deck } = {};
  const scores: { [key: string]: PlayerScore } = {};

  for (const player of players) {
    const encodedName = encodeKey(player);
    decks[encodedName] = createDeck(player);
    scores[encodedName] = calculateRoundScore(decks[encodedName]);
  }
  const round:GameRound = {
    board: gameBoard,
    hasStarted: isFirst,
    isRoundOver: false,
    decks,
    scores,
  };
  return round;
}

function createGameBoard(numberPlayers:number) :{ [key: string]: CardProps[] } {
  const deck: { [key: string]: CardProps[] } = {};
  for (let i = 0; i < numberPlayers*4; i++) {
    deck[i] = [{
      highlighted: false,
      owner: "", color: Colors.Blank,
      position: i,
      number: 0,
      cardPileToReturnTo: "none",
    }];
  }
  return deck;
}

function createDeck(owner: string) :Deck {
  const deck: CardProps[] = [];
  for (const color in Colors) {
    if (color === Colors.Blank) {
      continue;
    }
    for (let i = 1; i < 11; i++) {
      const colorValue = Colors[color as keyof typeof Colors];
      deck.push({
        cardPileToReturnTo: "",
        highlighted: false,
        position: -1,
        color: colorValue,
        number: i,
        owner: owner,
      });
    }
  }
  const shuffledDeck = shuffleArray(deck);
  const blitzPile = shuffledDeck.slice(0, 10);
  blitzPile.forEach((card) => card.cardPileToReturnTo = "blitzPile");
  const postPile = shuffledDeck.slice(10, 13);
  postPile.forEach((card) => card.cardPileToReturnTo = "postPile");
  const woodPile = shuffledDeck.slice(13);
  woodPile.forEach((card) => card.cardPileToReturnTo = "woodPile");
  return {blitzPile, postPile, woodPile, owner};
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice(); // Create a copy of the array to avoid mutating the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}


// we can use a state to start listening to the whole doc and then narrow down to the most recent round that's not over then listen to that state

// Can add routes to specific rounds

// can make the frontend either auto close game or have players call blitz don't matter this way

