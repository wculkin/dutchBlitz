import {Player} from "./Player";
import {CardProps} from "./cardEnums";
import {GameState} from "../apis/gameServices";

export class GameInfo{
    players: Map<string,Player>
    key: string
    gameBoard:CardProps[][]
    playerNameToDeck: Map<string, Deck>

     constructor({ players, key, gameBoard,playerNameToDeck }: { players: Map<string,Player>, key: string, gameBoard: CardProps[][],playerNameToDeck:Map<string, Deck>}) {
        this.players = players;
        this.key = key;
        this.gameBoard = gameBoard;
        this.playerNameToDeck = playerNameToDeck
    }



    //   getPlayerScores(){
    //     //toDo will be nice to have
    //       return null
    // }
    //
    //
    // addGameToPlayers() {
    //     // for (const [key, value] of this.players.entries()) {
    //     //     console.log("idk why this here")
    //     // }
    //     return
    // }
}


export function convertGameStateToGameInfo(gameState: GameState, key:string): GameInfo{
    //const gameBoard = deserializeGameBoard(gameState.board)
    const gameBoard:CardProps[][] = []
    const players = new Map<string,Player>();
    const playerNameToDeck = new Map<string, Deck>();
    return {gameBoard, players, playerNameToDeck, key}

}

export interface Deck {
    blitzPile: CardProps[];
    postPile: CardProps[];
    woodPile: CardProps[];
    owner: string;
}

export interface sendAbleGameState{
    key: string;
    players: string
    gameBoard:CardProps[][];
    playerNameToDeck: string
}


export function prePareGameInfoToSend(gameInfo: GameInfo){
     const stringsOfDecks = JSON.stringify(Array.from(gameInfo.playerNameToDeck.entries()));
    const players = JSON.stringify(Array.from(gameInfo.players.entries()));
    return ({gameBoard:gameInfo.gameBoard, key:gameInfo.key,playerNameToDeck:stringsOfDecks,players})
}

export function decodeGameInfoClient(sendAbleGameState:sendAbleGameState) :GameInfo{
    const curPlayers = new Map<string, Player>(JSON.parse(sendAbleGameState.players));
    const playerToDeck = new Map<string, Deck>(JSON.parse(sendAbleGameState.playerNameToDeck));
    const updateInfo = new GameInfo({
        gameBoard: sendAbleGameState.gameBoard, key: sendAbleGameState.key, players:curPlayers,playerNameToDeck:playerToDeck
    })


    return <GameInfo>updateInfo
}