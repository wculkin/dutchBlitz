import {Firebase} from "./Firebase";
import {WaitingRoom} from "./waitingRoomServices";
import {v4 as uuidv4} from "uuid";
import {FieldValue} from "firebase-admin/firestore";
import {
  createNewGameState,
  createUpdates,
  GameRound,
  getNewRound,
  validateMoveIsValid,
} from "./gameServices";
import {User} from "./userInterface";
import {generateRandomUsername, getUniqueEmail} from "./nameGenerator";

export const ADD_PLAYER = "ADD_PLAYER";
export const DELETE_PLAYER = "DELETE_PLAYER";
export const START_ROUND = "START_ROUND";
export const CREATE_WAITING_ROOM = "CREATE_WAITING_ROOM";
export const MAKE_PLAYER_MOVE = "MAKE_PLAYER_MOVE";
export const CREATE_USER = "CREATE_USER";

export const IS_ROUND_OVER = "isRoundOver";


export class OnCallHandler {
  mapActionToFunction: Map<string, any>;
  firebase: Firebase;
  constructor(firebase: Firebase) {
    this.firebase = firebase;
    this.mapActionToFunction = new Map<string, any>();
    this.mapActionToFunction.set(ADD_PLAYER, (params:any) => this.addPlayerToWaitingRoom(params));
    this.mapActionToFunction.set(DELETE_PLAYER, (params:any) => this.deletePlayerFromWaitingRoom(params));
    this.mapActionToFunction.set(START_ROUND, (params:any) => this.handleStartRound(params));
    this.mapActionToFunction.set(CREATE_WAITING_ROOM, (params:any) => this.createWaitingRoom(params));
    this.mapActionToFunction.set(MAKE_PLAYER_MOVE, (params:any) => this.makePlayerMove(params));
    this.mapActionToFunction.set(CREATE_USER, (params:any) => this.createUser(params));
  }
  async handleEvent(eventType:string, params: any) : Promise<any> {
    console.log(`EventType ${eventType} `);
    console.log(`params ${params} `);

    return this.mapActionToFunction.get(eventType)(params);
  }

  private async createWaitingRoom(params:any) {
    console.log(params);
    try {
      const newGame: WaitingRoom = {
        hasTheGameStarted: false,
        isGameOver: false,
        roundInProgress: false,
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
    return {};
  }
  private async addPlayerToWaitingRoom(params:any) {
    const {playerToAdd, roomId} = params;
    const updates = {
      players: FieldValue.arrayUnion(playerToAdd),
      updatedAt: new Date(),
    };
    await this.firebase.updateFireStoreDoc("waitingRooms", roomId, updates);
    return {};
  }
  private async deletePlayerFromWaitingRoom(params:any) {
    const {player, roomId} = params;
    const updates = {
      players: FieldValue.arrayRemove(player),
      updatedAt: new Date(),
    };
    await this.firebase.updateFireStoreDoc("waitingRooms", roomId, updates);
    return {};
  }

  private async handleStartRound(params:any) {
    const {roomId, scoreToPlayTo} = params;
    // TODO next steps maybe run a transaction in case multiple people start at the same time low priority
    const currentWaitingRoom:any = await this.firebase.getFireStoreDocument("waitingRooms", roomId);
    console.log("currentWaitingRoom ", currentWaitingRoom);
    const gameStatePath = `/gameStates/${roomId}`;
    if (currentWaitingRoom.firstRound) {
      console.log("in the rom first round is true" );
      const gameState = createNewGameState(currentWaitingRoom.players, scoreToPlayTo, currentWaitingRoom.gameType);
      await this.firebase.setDocument(gameStatePath, gameState);
      const updates = {
        roundInProgress: true,
        hasTheGameStarted: true,
        firstRound: false,
        scores: gameState.totalScores,
        updatedAt: new Date(),
        route: gameStatePath,
      };
      await this.firebase.updateFireStoreDoc("waitingRooms", roomId, updates);
    } else {
      const theNewRound = getNewRound(currentWaitingRoom.players);
      const gameState = await this.firebase.readDocument(gameStatePath);
      const rounds = gameState.gameRounds;
      rounds.push(theNewRound);
      // todo add update the gameState and then the waitingRoom
      await this.firebase.setDocument(gameStatePath+"/gameRounds", rounds);
      const updates = {
        roundInProgress: true,
        updatedAt: new Date(),
      };
      await this.firebase.updateFireStoreDoc("waitingRooms", roomId, updates);
      console.log(theNewRound);
    }
    return {};
    // Should see if there is a current game
    // can either get the local data from player or call the db
    // then need to call the realtime to get info about gamestate like do we need to create a new round or not
    // then update the waiting room
  }
  private async makePlayerMove(params:any) {
    const {playerName, cardToAddToBoard, positionOnBoard, pathToCurrentRound, keys, round} = params;
    if (pathToCurrentRound == "") {
      throw new Error("recieved a bad path");
    }
    const encodedName = encodeKey(playerName);
    console.log("the path: ", pathToCurrentRound);
    const curRound:GameRound = await this.getCurrentRoundInformation(pathToCurrentRound);
    if (!validateMoveIsValid(curRound, cardToAddToBoard, positionOnBoard)) {
      throw new Error(`${playerName} is not valid`);
    }
    const updates: { [key: string]: any } = createUpdates(positionOnBoard, encodedName, cardToAddToBoard, curRound.decks[encodedName], curRound.board[positionOnBoard]);
    await this.firebase.updateDocument(pathToCurrentRound, updates);
    const isRoundOver = updates[`decks/${encodedName}`].blitzPile.length === 0;

    if (isRoundOver ) {
      const gameStatePath = `/gameStates/${keys}`;
      const gameInfo = await this.firebase.readDocument(gameStatePath);
      const roundScores = gameInfo.gameRounds[round].scores;
      // eslint-disable-next-line guard-for-in
      for (const key in gameInfo.totalScores) {
        console.log("the key", key);
        gameInfo.totalScores[key].score += roundScores[key].score;
        if (round === 0) gameInfo.totalScores[key].score += 20;
        if (playerName === key || encodeKey(playerName) === key) {
          gameInfo.totalScores[key].score += 1;
        }
      }
      const finalUpdates: { [key: string]: any } = {
        [`gameRounds/${round}/` + IS_ROUND_OVER]: isRoundOver,
        ["totalScores"]: gameInfo.totalScores,
      };
      const data = {
        roundInProgress: false,
        scores: gameInfo.totalScores,
      };
      await this.firebase.updateFireStoreDoc("waitingRooms", keys, data);
      await this.firebase.updateDocument(gameStatePath, finalUpdates);
    }
    return {};
    // todo should right a function to check all arrays make sense
    // todo end game shit
  }
  private async createUser(params:any) {
    let {email, password, displayName} = params;
    if (!email || email == "") {
      email = getUniqueEmail();
    }
    if (!password || password == "") {
      password = "qqqqqq";
    }
    if (!displayName || displayName == "") {
      displayName = generateRandomUsername();
    }
    const userRecord = await this.firebase.auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });
    const userData:User = {
      id: userRecord.uid,
      displayName,
      email,
      finished: 0,
      gamesIds: [],
      rating: 0,
      unfinished: 0,
      wonGames: 0,
    };
    const returnData = {
      userData: userData,
      userRecord,
    };
    await this.firebase.setFireStoreDoc("users", userRecord.uid, userData);
    return returnData;
  }
  private async getCurrentRoundInformation(path: string) {
    // todo write this to double check we have the right round
    return this.firebase.readDocument(path);
  }
}


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


