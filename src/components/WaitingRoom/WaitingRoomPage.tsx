import React, {useEffect, useState} from "react";
import {useGlobalState} from "../Firebase/GlobalUser";
import {useNavigate} from "react-router-dom";
import {useFirebase} from "../Firebase/context";
import {useParams} from "react-router";
import {PlayerScore} from "../Scores/Scores";
import * as ROUTES from "../../constants/routes";
import {doc, onSnapshot} from "firebase/firestore";
import WaitingRoomInitial from "./WaitingRoomInitial";
import {WaitingRoom} from "../../sharedStuff/interfaces";

const WaitingRoomPage: React.FC = () => {
    const { user } = useGlobalState();
     const navigate = useNavigate();
      const firebase = useFirebase();
     const db = firebase.db
    const { keys } = useParams<{ keys: string }>();
     const [numberComputers, setNumberComputers] = useState<number>(0);
     const [scoreToPlayTo, setScoreToPlayTo] = useState<number>(50);
     const [playerScores, setPlayerScores] = useState<{ [key: string]: PlayerScore }>({});
     const [waitingRoom, setWaitingRoom] = useState<WaitingRoom | null>(null);


    //const [players, setPlayers] = useState<Map<String,Player>>(new Map());
     if (!user){
         alert("You need to sign in")
         navigate(ROUTES.SIGN_IN);
     }
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
            if (room) {
                setWaitingRoom(room as WaitingRoom)
            }
            if (room?.roundInProgress){
                console.log("we should've navigated")
                navigateToGameBoard(room.route)
            }
        }
    });

    return () => unsubscribe();
  }, [keys as string, db]);
     const  handleStartGame= async() => {
        await firebase.doCallCloudFunction('START_ROUND', {roomId: keys, scoreToPlayTo} )
    }

     const navigateToGameBoard  = async(route: string) => {
        console.log("route ", route)
        navigate(route);
  };
    const getCorrectWaitingRoom = () =>{
        return (<WaitingRoomInitial waitingRoom={waitingRoom} onStartClicked={handleStartGame}/>)
    };

    return (<>
        {getCorrectWaitingRoom()}
    </>)
}

export default WaitingRoomPage;