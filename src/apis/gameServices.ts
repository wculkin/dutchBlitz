// import Firebase from "../components/Firebase";
import {CardProps} from "../sharedStuff/cardEnums";
import {Deck} from "../sharedStuff/GameInfo";
// import {
//     getDoc,
//     setDoc,
//     doc,
//     updateDoc,
//     arrayRemove,
//     arrayUnion
// } from 'firebase/firestore';
//
//
// import {
//     createDeck,
//     createGameBoard, encodeKey, getPlayerScore, serializeGameBoard
// } from "../sharedStuff/helpers";
// import {Deck} from "../sharedStuff/GameInfo";
// import {CardProps} from "../sharedStuff/cardEnums";
//
//
// //TODO fix it so each local host manages there own deck and score then use the global score from updates and each local doesn't know other decks
//
// // Define the GameState type
export interface GameState {
  board: { [key: string]: CardProps }; // Adjust according to your game state structure
  decks:  { [key: string]: Deck };
  scores:  { [key: string]: any };
  isOver: Boolean;
  createdAt: Date;
  updatedAt: Date;
}
//
// // Initialize Firebase instance
// const firebase = new Firebase();
//
// // Function to create a new game state
// export const createGameState = async (players: string[], gameKey: string): Promise<string> => {
//
//   const gameBoard: CardProps[][] = createGameBoard(players.length)
//   const ceralGame: { [key: string]: CardProps } = serializeGameBoard(gameBoard)
//   //const decks: Deck[] = []
//   const decks: { [key: string]: Deck } = {};
//   for (const player of players) {
//     //decks.push(createDeck(player))
//       const encodedName = encodeKey(player)
//       decks[encodedName] = createDeck(player)
//   }
//   const scores: { [key: string]: any} = {};
//   for (const player of players) {
//     //decks.push(createDeck(player))
//       const encodedName = encodeKey(player)
//       scores[encodedName] = getPlayerScore(decks[encodedName])
//   }
//
//     console.log("ceral: ",ceralGame )
//     console.log("gameBoard: ",gameBoard )
//    const gameState: GameState = {
//        board: ceralGame,
//        decks,
//        scores,
//        isOver: false,
//     createdAt: new Date(),
//     updatedAt: new Date()
//    };
//   const docRef = doc(firebase.db, 'gameStates', gameKey);
//   await setDoc(docRef, gameState);
//   return gameKey;
// };
//
// // Function to get a game state by UUID
// export const getGameState = async (uuid: string): Promise<GameState | null> => {
//   const docRef = doc(firebase.db, 'gameStates', uuid);
//   const docSnap = await getDoc(docRef);
//
//   if (docSnap.exists()) {
//     return docSnap.data() as GameState
//   } else {
//     console.log('No such document!');
//     return null;
//   }
// };
//
// // Function to update a game state
// export const updateGameState = async (uuid: string, deck:Deck,isOver:boolean, playerName:string, card:CardProps): Promise<void> => {
//  console.log("the decks ", deck);
//  const encodedName = encodeKey(playerName)
//  const docRef = doc(firebase.db, 'gameStates', uuid);
//  const position = card.positionX*4 + card.positionY
//     console.log("the position, ", position)
//   await updateDoc(docRef, {
//       [`board.${position.toString()}`]: arrayUnion(card),
//       [`decks.${encodedName}`]: arrayRemove(card),
//       [`scores.${encodedName}`]: getPlayerScore(deck),
//       updatedAt: new Date(),
//       isOver: isOver,
// })
//   .then(() => {
//     console.log('Document successfully updated!');
//   })
//   .catch((error) => {
//     console.error('Error updating document: ', error);
//   });
//
//   // await runTransaction(firebase.db, async (transaction) => {
//   //    const docRef = doc(firebase.db, 'gameStates', uuid);
//   //    const gameDoc = await transaction.get(docRef);
//   //    console.log("loaded")
//   //    if (!gameDoc.exists()) {
//   //         throw "Document does not exist!";
//   //       }
//   //    const gameState  = gameDoc.data();
//   //    const curBoard = deserializeGameBoard(gameState.board);
//   //    const xSpot = card!.positionX;
//   //    const ySpot: number = card.positionY;
//   //    if (card.color === curBoard[xSpot][ySpot].color && card.number <= curBoard[xSpot][ySpot].number){
//   //        return
//   //        throw("Card Already taken, aborting update")
//   //    }
//   //    const encodedName = encodeKey(playerName)
//   //
//   //    transaction.update(docRef, {
//   //     board: serializeGameBoard(gameBoard),
//   //     [`decks.${encodedName}`]: deck,
//   //     [`scores.${encodedName}`]: getPlayerScore(deck),
//   //     updatedAt: new Date(),
//   //     isOver: isOver,})
//   //     return
//   // }).then(() => {
//   //   console.log('Document successfully updated!');
//   // })
//   // .catch((error) => {
//   //   console.error('Error updating document: ', error);
//   // });
// };
