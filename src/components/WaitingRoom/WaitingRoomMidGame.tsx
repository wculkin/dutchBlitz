import React from "react";
import {encodeKey} from "../../sharedStuff/interfaces";
import {WaitingRoomProps} from "./WaitingRoomInitial";

const WaitingRoomMidGame: React.FC<WaitingRoomProps> = ({waitingRoom, onStartClicked}) => {
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
            <button className="wr-start-btn" onClick={onStartClicked}>Start new round</button>
        </div>
    );
};
export default WaitingRoomMidGame;