import React, {useState} from 'react';
import './WaitingRoom.css';
import {useGlobalState} from "../Firebase/GlobalUser";

import {useFirebase} from "../Firebase/context";
import {encodeKey, WaitingRoom} from '../../sharedStuff/interfaces';

type WaitingRoomProps = {
  waitingRoom: WaitingRoom | null;
  onStartClicked: () => void;

};

const WaitingRoomInitial: React.FC<WaitingRoomProps> = ({waitingRoom, onStartClicked}) => {
    const fireBase = useFirebase();
    const { user } = useGlobalState();
    const [playerName, setPlayerName] = useState(user!.email as string);
    const isPlayerInGame = () => {
        if(!waitingRoom) return false
        for (let val of waitingRoom.players){
            if (val == playerName){
                return true
            }
        }
        return false
    }
    const handleAddPlayer = async() => {
        if (waitingRoom!.players.length > 3){
            alert("only supports max four players right now")
            return
        }
        if(playerName.startsWith("computer")){
            alert("add a computer, actual player name can't start with computer")
            return
        }
        if (playerName) {
            await fireBase.doCallCloudFunction('ADD_PLAYER', {roomId:waitingRoom?.id as string,playerToAdd:playerName} )
        }
    };
    const handleRemovePlayer = async() => {
        if (playerName) {
            await fireBase.doCallCloudFunction('DELETE_PLAYER', {roomId:waitingRoom?.id as string,player:playerName} )
        }
    }
    console.log("waitingRoom: ", waitingRoom)
    console.log("waitingRoom players: ", waitingRoom?.players)
    console.log("waitingRoom scores: ", waitingRoom?.scores)
    return (
        <div className="wr-container">
            <h1 className="wr-header">Waiting Room</h1>
            <ul className="wr-player-list">
                {waitingRoom && waitingRoom.players.map((player:string, index) => (
                    <li key={index} className="wr-player-item">
                        {player} score: {waitingRoom.scores && waitingRoom.scores[encodeKey(player)] !== undefined ? waitingRoom!.scores![encodeKey(player)].score : 0}
                    </li>
                ))}
            </ul>
            {!isPlayerInGame() && (
            <div className="wr-input-group">
                <button onClick={handleAddPlayer} className="wr-add-btn">Add yourself to the game {playerName}</button>
            </div>)}
            { isPlayerInGame()&& (
            <div className="wr-input-group">
                <button onClick={handleRemovePlayer} className="wr-add-btn">Remove yourself from the game {playerName}</button>
            </div>)}
            <button className="wr-start-btn" onClick={onStartClicked}>Start Game</button>
        </div>
    );
};
export default WaitingRoomInitial;
