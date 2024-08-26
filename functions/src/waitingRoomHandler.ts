import {Firebase} from "./Firebase";
import {WaitingRoom} from "./waitingRoomServices";
import {v4 as uuidv4} from "uuid";
import * as admin from "firebase-admin";


export const ADD_PLAYER = "ADD_PLAYER";
export const DELETE_PLAYER = "DELETE_PLAYER";
export const START_ROUND = "START_ROUND";
export const CREATE_WAITING_ROOM = "CREATE_WAITING_ROOM";

export class WaitingRoomHandler {
  mapActionToFunction: Map<string, any>;
  firebase: Firebase;
  constructor(firebase: Firebase) {
    this.mapActionToFunction = new Map<string, any>();
    // this.mapActionToFunction.set(ADD_PLAYER, this.addPlayerToWaitingRoom);
    // this.mapActionToFunction.set(DELETE_PLAYER, this.deletePlayerFromWaitingRoom);
    // this.mapActionToFunction.set(START_ROUND, this.handleStartRound);
    this.mapActionToFunction.set(CREATE_WAITING_ROOM, this.createWaitingRoom);
    this.firebase = firebase;
  }
  public async handleEvent(eventType:string, params:any) {
    console.log(`EventType ${eventType} `);
    console.log(`params ${params} `);
    this.mapActionToFunction.get(eventType)(params);
  }

  private async createWaitingRoom() {
    try {
      const newGame: WaitingRoom = {
        isGameOver: false,
        roundInProgress: false,
        hasStarted: false,
        id: uuidv4(),
        players: [],
        firstRound: true,
        gameType: "standard",
      };
      console.log("the game ID", newGame.id);
      await admin.firestore().collection("waitingRooms").doc(newGame.id).set(newGame);
      console.log("made the call ");
      // const docRef = this.firebase.db.collection("waitingRooms").doc(newGame.id);
      // await docRef.set(newGame);
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }
  // private async addPlayerToWaitingRoom(playerToAdd:string, roomId: string) {
  //   const docRef = doc(this.firebase.db, "waitingRooms", roomId);
  //   await updateDoc(docRef, {
  //     players: arrayUnion(playerToAdd),
  //     updatedAt: new Date(),
  //   });
  // }
  // private async deletePlayerFromWaitingRoom(roomId: string, player: string) {
  //   const docRef = doc(this.firebase.db, "waitingRooms", roomId);
  //   await updateDoc(docRef, {
  //     players: arrayRemove(player),
  //     updatedAt: new Date(),
  //   });
  // }
  //
  // private async handleStartRound(roomId: string, scoreToPlayTo: number) {
  //   // TODO next steps maybe run a transaction in case multiple people start at the same time low priority
  //   const docRef = doc(this.firebase.db, "waitingRooms", roomId);
  //   const gameStateRef = ref(this.firebase.realTime, roomId);
  //   const currentWaitingRoom:WaitingRoom = await getSnapShotFromFireStore({docRef: docRef});
  //   if (currentWaitingRoom.firstRound) {
  //     const gameState = createNewGameState(currentWaitingRoom.players, scoreToPlayTo, currentWaitingRoom.gameType);
  //     await update(gameStateRef, gameState).then(() => {
  //       console.log("Document successfully updated!");
  //     }).catch((error) => {
  //       console.error("Error updating document: ", error);
  //     });
  //     await updateDoc(docRef, {
  //       hasStarted: true,
  //       roundInProgress: true,
  //       firstRound: false,
  //       scores: gameState.totalScores,
  //       updatedAt: new Date(),
  //     });
  //   } else {
  //     const theNewRound = getNewRound(currentWaitingRoom.players);
  //     // todo add update the gameState and then the waitingRoom
  //     console.log(theNewRound);
  //   }


  //   // Should see if there is a current game
  //   // can either get the local data from player or call the db
  //   //then need to call the realtime to get info about gamestate like do we need to create a new round or not
  //   //then update the waiting room
  //
  //
  //
  //   const waitingRoomDocRef = doc(this.firebase.db, "waitingRooms", roomId);
  // await updateDoc(docRef, {
  //
  //   updatedAt: new Date(),
  // });
  // }
}

