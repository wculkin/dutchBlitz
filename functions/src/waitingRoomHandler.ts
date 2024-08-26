import {Firebase} from "./Firebase";
import {WaitingRoom} from "./waitingRoomServices";
import {v4 as uuidv4} from "uuid";
import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";


export const ADD_PLAYER = "ADD_PLAYER";
export const DELETE_PLAYER = "DELETE_PLAYER";
export const START_ROUND = "START_ROUND";
export const CREATE_WAITING_ROOM = "CREATE_WAITING_ROOM";

export class WaitingRoomHandler {
  mapActionToFunction: Map<string, any>;
  firebase: Firebase;
  constructor(firebase: Firebase) {
    this.firebase = firebase;
    console.log("in const ", this.firebase);
    this.mapActionToFunction = new Map<string, any>();
    this.mapActionToFunction.set(ADD_PLAYER, (params:any) => this.addPlayerToWaitingRoom(params));
    this.mapActionToFunction.set(DELETE_PLAYER, (params:any) => this.deletePlayerFromWaitingRoom(params));
    // this.mapActionToFunction.set(START_ROUND, this.handleStartRound);
    this.mapActionToFunction.set(CREATE_WAITING_ROOM, (params:any) => this.createWaitingRoom());
  }
  async handleEvent(eventType:string, params: any) {
    console.log(`EventType ${eventType} `);
    console.log(`params ${params} `);

    this.mapActionToFunction.get(eventType)(params);
  }

  private async createWaitingRoom() {
    console.log("this", this);
    console.log("in calss ", this.firebase);
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
      await this.firebase.setFireStoreDoc("waitingRooms", newGame.id, newGame);
      console.log("made the call ");
    } catch (error) {
      console.error("Error creating new game:", error);
    }
  }
  private async addPlayerToWaitingRoom(params:any) {
    const {playerToAdd, roomId} = params;
    const updates = {
      players: [playerToAdd],
      updatedAt: new Date(),
    };
    await this.firebase.updateFireStoreDoc("waitingRooms", roomId, updates);
  }
  private async deletePlayerFromWaitingRoom(params:any) {
    const {player, roomId} = params;
    const updates = {
      players: [],
      updatedAt: new Date(),
    };
    await this.firebase.updateFireStoreDoc("waitingRooms", roomId, updates);
  }
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

