export enum Colors {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Blank = "Blank"
}


export interface CardProps {
  color: Colors; // Make required if every card needs a color
  number: number;
  owner?: string;
  onClick?: () => void;
  highlighted?: boolean;
  positionX: number
  positionY: number
}


const blankCardKey = "Blank-0";
const computer1 = "computer 1";


export interface Deck {
    blitzPile: CardProps[];
    postPile: CardProps[];
    woodPile: CardProps[];
    owner: string;
}
export function makeComputerMove(gameState:any) {

  const theBoard = gameState.board;

  const mapOfBoard:Map<string,CardProps> = convertBoardToMap(theBoard);
  console.log("the map of board", mapOfBoard);
  const computerHand: Deck = gameState.decks[computer1];
  const blitzCard : CardProps = computerHand.blitzPile[computerHand.blitzPile.length-1];
  const copy:CardProps = {...blitzCard};
  if (blitzCard.number === 1 && mapOfBoard.has(blankCardKey)) {
    makeAMove(gameState, blitzCard, <CardProps>mapOfBoard.get(blankCardKey), computer1);
    return gameState;
  }
  copy.number-=1;
  const cardToSearchFor = serializeCard(copy);
  if (mapOfBoard.has(cardToSearchFor)) {
    makeAMove(gameState, blitzCard, <CardProps>mapOfBoard.get(cardToSearchFor), computer1);
    return gameState;
  }
  for (const card of computerHand.postPile) {
    const copy:CardProps = {...card};
    if (copy.number === 1) {
      makeAMove(gameState, card, <CardProps>mapOfBoard.get(blankCardKey), computer1);
      return gameState;
    }
    copy.number-=1;
    const cardToSearchFor = serializeCard(copy);
    if (mapOfBoard.has(cardToSearchFor)) {
      makeAMove(gameState, card, <CardProps>mapOfBoard.get(cardToSearchFor), computer1);
      return gameState;
    }
  }
  for (const card of computerHand.woodPile) {
    const copy:CardProps = {...card};
    if (copy.number === 1) {
      makeAMove(gameState, card, <CardProps>mapOfBoard.get(blankCardKey), computer1);
      return gameState;
    }
    copy.number-=1;
    const cardToSearchFor = serializeCard(copy);
    if (mapOfBoard.has(cardToSearchFor)) {
      makeAMove(gameState, card, <CardProps>mapOfBoard.get(cardToSearchFor), computer1);
      return gameState;
    }
  }


  return gameState;
}

// function checkList(board){
//     for (let card of computerHand.woodPile){
//         const copy:CardProps = {...card}
//         if (copy.number === 1){
//         makeAMove(gameState,card,mapOfBoard.get(blankCardKey),computer1);
//             return gameState
//         }
//          copy.number-=1
//         const cardToSearchFor = serializeCard(copy)
//         if (mapOfBoard.has(cardToSearchFor)){
//             makeAMove(gameState,card,mapOfBoard.get(cardToSearchFor),computer1);
//             return gameState
//         }
//     }
// }


function makeAMove(gameState: any, cardToRemove: CardProps, cardOnBoard: CardProps, playerName: any) {
  const newDeck = removeCardFromPlayerHand(cardToRemove, gameState.decks[playerName], playerName);
  gameState.decks[playerName] = newDeck;
  const position = convertXYToSinglarPosition(cardOnBoard);
  cardToRemove.positionY = cardOnBoard.positionY;
  cardToRemove.positionX = cardOnBoard.positionX;
  gameState.board[position] = cardToRemove;
  return gameState;
}

function convertXYToSinglarPosition(card :any) {
  console.log("the card" ,card)
  return card.positionY + (card.positionX*4);
}
const removeCardFromPlayerHand = (card: CardProps, deck:Deck, playerName:string) => {
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


function convertBoardToMap(board:any) {
  const cardMap: Map<string, CardProps> = new Map();
  Object.keys(board).forEach((key: string) => {
    const curCard:CardProps = board[key];
    const curCardToString = serializeCard(curCard);
    cardMap.set(curCardToString, curCard);
  });
  return cardMap;
}

function serializeCard(card: CardProps): string {
  return `${card.color}-${card.number}`;
}

