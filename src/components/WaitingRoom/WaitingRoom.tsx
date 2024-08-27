import React, {useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import './WaitingRoom.css';
import {
    addPlayerToWaitingRoom,
    deletePlayerFromWaitingRoom,
    updateWaitingRoomForGameStart
} from "../../apis/waitingRoomServices";
import {useGlobalState} from "../Firebase/GlobalUser";
import * as ROUTES from '../../constants/routes';
import {doc, onSnapshot} from "firebase/firestore";
import {useFirebase} from "../Firebase/context";
import {useParams} from "react-router";
import {createGameState, fetchDataFromPath} from "../../apis/gameServicesWithRealTimeDB";


const WaitingRoom: React.FC = () => {
     const { user } = useGlobalState();
     const navigate = useNavigate();
      const firebase = useFirebase();
     const db = firebase.db
    const { keys } = useParams<{ keys: string }>();
     const [numberComputers, setNumberComputers] = useState<number>(0);
     const [scoreToPlayTo, setScoreToPlayTo] = useState<number>(50);


    //const [players, setPlayers] = useState<Map<String,Player>>(new Map());
     if (!user){
         alert("You need to sign in")
         navigate(ROUTES.SIGN_IN);
     }
    const [playerName, setPlayerName] = useState(user!.email as string);
    //const [submittedName, setSubmittedName] = useState(false)
    const [gameKey, setGameKey] = useState('')


    const [players, setPlayers] = useState<string[]>([]);
     useEffect(() => {

    const docRef = doc(db, 'waitingRooms', keys as string);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      console.log("DId this trigger")
        if (doc.exists()) {
            console.log("the doc data ", doc.data())
        const room = doc.data();
        if (!room){
          console.log("I should fix this but am too lazy rn, probs should create a room? Or force this to be create" +
              "from the lobby, I like the lobby idea")
      }
      if (room?.hasStarted){
          //Navigate
          console.log("we should've navigated")
          navigateToGameBoard(room.route)
      }
      setPlayers(room!.players);
      }
    });

    return () => unsubscribe();
  }, [keys as string, db]);

    const handleAddPlayer = async() => {
        if (players.length > 3){
            alert("only supports max four players right now")
            return
        }
        if(playerName.startsWith("computer")){
            alert("add a computer, actual player name can't start with computer")
            return
        }
        if (playerName) {
            await firebase.doCallCloudFunction('ADD_PLAYER', {roomId:keys as string,playerToAdd:playerName} )
        }
    };
    const handleAddComputerPlayer = async() => {
        if (players.length  > 3){
            alert("only supports max four players right now")
            return
        }
        const computerToAdd = "computer " + (numberComputers + 1).toString()
        setNumberComputers(prevState => prevState +1)
        await addPlayerToWaitingRoom(keys as string,computerToAdd)

    };
    const handleRemovePlayer = async() => {
        if (playerName) {
            await firebase.doCallCloudFunction('DELETE_PLAYER', {roomId:keys as string,player:playerName} )
        }
    }
    const  handleStartGame= async() => {
        await firebase.doCallCloudFunction('START_ROUND', {roomId: keys, scoreToPlayTo} )
    }

     const navigateToGameBoard  = async(route: string) => {
        console.log("route ", route)
        const roundInfo = await fetchDataFromPath(route+"/GameRounds")
         if(roundInfo === null){
             console.log("no round")
         }
         const rightRoute = '/' + route + '/' + roundInfo
        navigate(rightRoute);
  };
    const isPlayerInGame = () => {
        for (let val of players){
            if (val == playerName){
                console.log(val)
                return true
            }
        }
        return false
    }
    return (
        <div className="wr-container">
            <h1 className="wr-header">Waiting Room</h1>
            <ul className="wr-player-list">
                {players.map((player, index) => (
                    <li key={index} className="wr-player-item">{player}</li>
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
            { true && (
            <div className="wr-input-group">
                <button onClick={handleAddComputerPlayer} className="wr-add-btn">Add computer player {numberComputers+1}</button>
            </div>)}




            <button className="wr-start-btn" onClick={handleStartGame}>Start Game</button>
        </div>
    );
};
export default WaitingRoom;
