import {CardProps, Colors} from "./cardEnums";
import {Deck} from "./GameInfo";


// export function createDeck(owner: Player) :Deck {
//     const deck: CardProps[] = [];
//     for (const color in Colors) {
//         if (color === Colors.Blank) {
//             continue
//         }
//         for (let i = 1; i < 11; i++) {
//             const colorValue = Colors[color as keyof typeof Colors];
//             deck.push({
//                 color: colorValue,
//                 number: i,
//                 owner: owner.name,
//             });
//         }
//     }
//     const shuffledDeck = shuffleArray(deck)
//     const blitzPile = shuffledDeck.slice(0, 10);
//     const postPile = shuffledDeck.slice(10, 13);
//     const woodPile = shuffledDeck.slice(13);
//     return {blitzPile, postPile, woodPile};
// }

export function createDeck(owner: string) :Deck {
    const deck: CardProps[] = [];
    for (const color in Colors) {
        if (color === Colors.Blank) {
            continue
        }
        for (let i = 1; i < 11; i++) {
            const colorValue = Colors[color as keyof typeof Colors];
            deck.push({
                highlighted: false,
                positionX: -1,
                positionY: -1,
                color: colorValue,
                number: i,
                owner: owner
            });
        }
    }
    const shuffledDeck = shuffleArray(deck)
    const blitzPile = shuffledDeck.slice(0, 10);
    const postPile = shuffledDeck.slice(10, 13);
    const woodPile = shuffledDeck.slice(13);
    return {blitzPile, postPile, woodPile, owner};
}



export function createGameBoard(numberPlayers:number) :CardProps[][] {
    const deck: CardProps[][] = [];
    for (let i = 0; i < numberPlayers; i++) {
        deck.push([])
        for (let j = 0; j < 4;j++){
            deck[i].push({
                    highlighted: false,
                    owner: "", color:Colors.Blank,
                positionX:i,
                positionY:j,
                number:0
            }
                );
        }
    }
    return deck;
}
export function addPlayerToBoard( board: CardProps[][]) :CardProps[][] {
    board.push([])
    const lengthToAdd = board.length-1
    for (let i = 0; i <4; i++) {
        board[lengthToAdd].push({
            highlighted: false, owner: "",
            color: Colors.Blank,
                positionX: lengthToAdd,
                positionY: i,
                number: 0
            });

    }
    return board;
}

function shuffleArray<T>(array: T[]): T[] {
    let shuffledArray = array.slice(); // Create a copy of the array to avoid mutating the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}


export function getPlayerScores(decks:Deck[]){
        //toDo will be nice to have
          const scores = []
          for (let deck of decks) {
              scores.push(getPlayerScore(deck))
          }
          return scores
    }
    export interface SerializedGameBoard {
        [key: string]: CardProps[];
}

export function getPlayerScore(deck:Deck){
        //toDo will be nice to have
        const negatives = deck.blitzPile.length * -2
        const positives = (10 - deck.blitzPile.length) + (27 - deck.woodPile.length)
        return {name: deck.owner as string, score: (negatives+positives), blitzCardsLeft: deck.blitzPile.length}
    }


    export const serializeGameBoard = (gameBoard: CardProps[][]): { [key: string]: CardProps } => {
    const serialized:{ [key: string]: CardProps } = {};
    let position:number = 0
    for (let i = 0; i< gameBoard.length;i++){
                for (let j = 0; j < gameBoard[i].length;j++){

                    serialized[position.toString()] = (gameBoard[i][j])
                    position+=1
                }
    }

  return serialized;
};

export const deserializeGameBoard = (serialized: { [key: string]: CardProps }): CardProps[][] => {
  const gameBoard: CardProps[][] = [];
  const length = Object.keys(serialized).length;
    for(let i = 0; i<length/4; i++){
        gameBoard.push([])
    }
    Object.keys(serialized).forEach((key: string) => {
        const value: CardProps = serialized[key];
        const curNum = parseInt(key)
        const i = Math.floor(curNum/4)
        const j = curNum%4
        gameBoard[i][j] = value
    });


  return gameBoard;
};

export const encodeKey = (key: string): string => {
  return key
    .replace(/\./g, '_dot_')
    .replace(/\//g, '_slash_')
    .replace(/\*/g, '_star_')
    .replace(/`/g, '_backtick_')
    .replace(/\[/g, '_lbracket_')
    .replace(/\]/g, '_rbracket_')
    .replace(/#/g, '_hash_')
    .replace(/\?/g, '_question_')
    .replace(/%/g, '_percent_');
};

export const decodeKey = (key: string): string => {
  return key
    .replace(/_dot_/g, '.')
    .replace(/_slash_/g, '/')
    .replace(/_star_/g, '*')
    .replace(/_backtick_/g, '`')
    .replace(/_lbracket_/g, '[')
    .replace(/_rbracket_/g, ']')
    .replace(/_hash_/g, '#')
    .replace(/_question_/g, '?')
    .replace(/_percent_/g, '%');
};