import React, { useState, useEffect } from 'react';
import {collection, getDocs, addDoc, doc, onSnapshot, query, limit, setDoc, where} from 'firebase/firestore';
import Firebase from "../Firebase";
import {httpsCallable} from 'firebase/functions';

import './Lobby.css'
import {WaitingRoom} from "../../apis/waitingRoomServices";
import {useNavigate} from "react-router-dom";


const Lobby: React.FC = () => {
  const [waitingRooms, setWaitingRooms] = useState<WaitingRoom[]>([]);
  const [newGameName, setNewGameName] = useState<string>('');
  const firebase = new Firebase();
  const db = firebase.db
  const navigate = useNavigate();
  const WAITING_ROOMS = "waitingRoom"

  // Fetch games from Firestore
  useEffect(() => {
   // Create a reference to the 'waitingRooms' collection and query the first 25 documents
    const waitingRoomsRef = collection(db, 'waitingRooms');
    const q = query(waitingRoomsRef, where("hasStarted", "==", false),limit(25));
    console.log("the query" , q)

    // Set up a listener for the query
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rooms:any = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      setWaitingRooms(rooms);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [db]);

  const createNewGame = async () => {
    const handleWaitingRoomEvent = async (eventType: string, params: any) => {
  const handleEvent:any = httpsCallable(firebase.functions, 'handleWaitingRoom');

  try {
    const result = await handleEvent({ eventType, params });
    console.log('Success:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    throw error;
  }
};


    await handleWaitingRoomEvent('CREATE_WAITING_ROOM', {});
  }

  // Join an existing game
  const joinGame = (gameId: string) => {
    // Implement the logic to join the game, e.g., navigate to the game screen
    console.log(`Joining watitingRoom with ID: ${gameId}`);
    navigateToGameBoard(gameId)
    // Add your logic here, such as setting the current game ID and navigating
  };

  const navigateToGameBoard = (key: string) => {
        navigate(`/waitingRoom/${key}`);
  };
  return (
      <div className="lobby-container">
        <h1>Game Lobby</h1>
        <div className="new-game-form">
          <button onClick={createNewGame}>Create Game</button>
        </div>
        <div className="games-list">
          <div className="game-item">
            <span>Game Status </span>
            <span>Players in game</span>
          </div>
          {waitingRooms.map(waitingRoom => (
              <div key={waitingRoom.id} className="game-item">
                <span>{waitingRoom.hasStarted ? "Game In progress" : "Unstarted game"}</span>
                <span>{waitingRoom.players.length ? waitingRoom.players.map((player) => (<span> {player}</span>)) : "None"}</span>
                <button onClick={() => joinGame(waitingRoom.id)} className="join-button">Join</button>
              </div>
          ))}
        </div>
      </div>
  );
};

export default Lobby;
