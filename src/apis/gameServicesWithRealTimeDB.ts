import { getDatabase, ref, set, get, update, runTransaction } from 'firebase/database';
import Firebase from "../components/Firebase";
import {
    createDeck,
    createGameBoard,
    deserializeGameBoard,
    encodeKey,
    getPlayerScore,
    getPlayerScores,
    SerializedGameBoard,
    serializeGameBoard
} from "../sharedStuff/helpers";
import { Deck } from "../sharedStuff/GameInfo";
import {CardProps, Colors} from "../sharedStuff/cardEnums";
import { PlayerScore } from "../components/Scores/Scores";
import Card from "../components/Card/Card";

// Define the GameState type
export interface GameState {
    board: { [key: string]: CardProps }; // Adjust according to your game state structure
    decks: { [key: string]: Deck };
    scores: { [key: string]: PlayerScore };
    isOver: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Initialize Firebase instance
const firebase = new Firebase();
const database = getDatabase(firebase.app); // Adjust according to how you initialize Firebase

// Function to create a new game state
export const createGameState = async (players: string[], gameKey: string): Promise<string> => {
    const gameBoard: CardProps[][] = createGameBoard(players.length);
    const serializedGameBoard: { [key: string]: CardProps } = serializeGameBoard(gameBoard);
    const decks: { [key: string]: Deck } = {};
    const scores: { [key: string]: PlayerScore } = {};

    for (const player of players) {
        const encodedName = encodeKey(player);
        decks[encodedName] = createDeck(player);
        scores[encodedName] = getPlayerScore(decks[encodedName]);
    }

    const gameState: GameState = {
        board: serializedGameBoard,
        decks,
        scores,
        isOver: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    let route = ""
    if (players.some(player => player.startsWith("computer"))){
        route = `computer/gameStates/${gameKey}`
    }else{
        route = `gameStates/${gameKey}`
    }
    const gameStateRef = ref(database, route);
    await set(gameStateRef, gameState);

    return route;
};

// Function to get a game state by UUID
export const getGameState = async (uuid: string): Promise<GameState | null> => {
    const gameStateRef = ref(database, `gameStates/${uuid}`);
    const snapshot = await get(gameStateRef);

    if (snapshot.exists()) {
        return snapshot.val() as GameState;
    } else {
        console.log('No such document!');
        return null;
    }
};

// Function to update a game state
export const updateGameState = async (uuid: string, deck: Deck, isOver: boolean, playerName: string, card: CardProps): Promise<void> => {
    const encodedName = encodeKey(playerName);
    const position = card.positionX * 4 + card.positionY;

    const updates: { [key: string]: any } = {};
    updates[`board/${position}`] = card;
    updates[`decks/${encodedName}`] = deck;
    updates[`scores/${encodedName}`] = getPlayerScore(deck);
    updates['updatedAt'] = new Date().toISOString();
    updates['isOver'] = isOver;

    const gameStateRef = ref(database, `gameStates/${uuid}`);
    await update(gameStateRef, updates)
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            console.error('Error updating document: ', error);
        });
};


export const updateTransactGameState = async (playerName: string, cardToAddToBoard: CardProps, currentCardAtBoard: CardProps, path: string): Promise<void> => {
    if (path == ""){
        return
    }
    const encodedName = encodeKey(playerName);
    const position = currentCardAtBoard.positionX * 4 + currentCardAtBoard.positionY;

    const gameStateRef = ref(database, path);

    try {
        await runTransaction(gameStateRef, (currentGameState: any) => {
            if (currentGameState === null) {
                throw new Error('Game state does not exist');
            }
            console.log("The game state ", currentGameState);
            console.log("The board? ", currentGameState.board);
            console.log("The card at said position? ", currentGameState.board[position]);
            console.log("CardToAdd card ", cardToAddToBoard)

            const curCardAtPosition = currentGameState.board[position];

            if (cardToAddToBoard == null) return currentGameState;
            console.log("first")
            if (curCardAtPosition.color !== Colors.Blank && curCardAtPosition.color !== cardToAddToBoard.color) return currentGameState;
                  console.log("second")
            console.log(cardToAddToBoard.number)
              console.log(curCardAtPosition.number)
            if (cardToAddToBoard.number - 1 !== curCardAtPosition.number) return currentGameState;
            console.log("third")

            const curDeck: Deck = removeCardFromPlayerHand(cardToAddToBoard, currentGameState.decks[encodedName], playerName);
            console.log("CURDECK AFTER REMOVAL ", curDeck)
            cardToAddToBoard.positionX = curCardAtPosition.positionX;
            cardToAddToBoard.positionY = curCardAtPosition.positionY;

            // Update the game state
            currentGameState.board[position] = cardToAddToBoard;
            currentGameState.decks[encodedName] = curDeck;
            currentGameState.scores[encodedName] = getPlayerScore(curDeck);
            currentGameState.updatedAt = new Date().toISOString();
            currentGameState.isOver = false;
            console.log("updated state: " , currentGameState)
            return currentGameState;
        });
    } catch (error) {
        console.error("Error occurred:", error);
    }
};


export const updateTransactGameStateWithTwoTransactsAndUpdateScore = async (playerName: string, cardToAddToBoard: CardProps, currentCardAtBoard: CardProps, path: string): Promise<void> => {
    if (path == ""){
        return
    }
    const position:number = currentCardAtBoard.positionX * 4 + currentCardAtBoard.positionY;
    const pathWithBoardPosition = path + "/board/" + position.toString()
    const encodedName = encodeKey(playerName);

    const boardPositionReference = ref(database, pathWithBoardPosition);

    try {
        await runTransaction(boardPositionReference, (currentCard: any) => {
            if (currentCard === null) {
                throw new Error('Game state does not exist');
            }
            console.log("The card on board is ", currentCard);

            const curCardAtPosition = currentCard;

            if (cardToAddToBoard == null) {
                 throw new Error('No card');

            };
            console.log("first")
            if (curCardAtPosition.color !== Colors.Blank && curCardAtPosition.color !== cardToAddToBoard.color){
                 throw new Error('mismatch in card from db and local');
            }

            if (cardToAddToBoard.number - 1 !== curCardAtPosition.number){
                throw new Error('not valid card to add');
            }

            cardToAddToBoard.positionX = curCardAtPosition.positionX;
            cardToAddToBoard.positionY = curCardAtPosition.positionY;

            console.log("updated state: " , cardToAddToBoard)
            return cardToAddToBoard;
        });
        const pathToPlayerHand = path + `/decks/${encodedName}`
        const playerHandReference = ref(database, pathToPlayerHand);
        let curDeck = null
        let isOver = false
        await runTransaction(playerHandReference, (deck: any) => {
            if (deck === null) {
                throw new Error('Deck does not exist');
            }
            console.log("The deck is ", deck);
             curDeck = removeCardFromPlayerHand(cardToAddToBoard, deck, playerName);
             isOver = curDeck.blitzPile.length === 0? true:false
             return curDeck
        });

        const updates: { [key: string]: any } = {};
         if (curDeck){
             updates[`scores/${encodedName}`] = getPlayerScore(curDeck);
             updates[`isOver`] = isOver;
             const gameStateRef = ref(database, path);
             await update(gameStateRef, updates)
            .then(() => {
                console.log('Document successfully updated!');
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
            });
         }

    } catch (error) {
        console.error("Error occurred:", error);
    }


};


const removeCardFromPlayerHand = (card: CardProps,deck:Deck, playerName:string): Deck => {
        const matchesCard = (c: CardProps) => c.color === card.color && c.number === card.number;

    // Move a card from blitzPile to postPile if needed
    if (deck.postPile && deck.postPile.some(matchesCard) && deck.blitzPile &&deck.blitzPile.length) {
        // Find the card to move in blitzPile
        const moveOver = deck.blitzPile.pop();
        deck.postPile.push(moveOver as CardProps);

    }

    console.log("the card is ", card);

    // Remove the card from each pile by comparing color and number
    if (!deck.blitzPile)  deck.blitzPile = []
    if (!deck.postPile)  deck.postPile = []
    if (!deck.woodPile)  deck.woodPile = []
    const curBlitzPile = deck.blitzPile.filter(c => !matchesCard(c));
    const curPostPile = deck.postPile.filter(c => !matchesCard(c));
    const curWoodPile = deck.woodPile.filter(c => !matchesCard(c));
        return {
            blitzPile: curBlitzPile,
            postPile: curPostPile,
            woodPile: curWoodPile,
            owner: playerName
        };
    };
