import {doc, getDoc, updateDoc, arrayUnion, arrayRemove, connectFirestoreEmulator} from 'firebase/firestore';
import Firebase from "../components/Firebase";
import {PlayerScore} from "../../functions/src/interfaces";

// Define the Player type
interface Player {
  id: string;
  name: string;
}

// Define the WaitingRoom type
export interface WaitingRoom {
  id: string;
  players: string[];
  firstRound: boolean;
  hasStarted: boolean;
  isGameOver: boolean;
  roundInProgress: boolean;
  gameType: string;
  route?: string;
  scores?: PlayerScore[];
}

// Initialize Firebase instance
const firebase = new Firebase()

// Function to get a waiting room document by ID
export const getWaitingRoom = async (id: string): Promise<WaitingRoom | null> => {
  const docRef = doc(firebase.db, 'waitingRooms', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as WaitingRoom;
  } else {
    console.log('No such document!');
    return null;
  }
};

// Function to add a player to a waiting room
export const addPlayerToWaitingRoom = async (roomId: string, player: string): Promise<void> => {
  const docRef = doc(firebase.db, 'waitingRooms', roomId);
  await updateDoc(docRef, {
    players: arrayUnion(player),
    updatedAt: new Date(),
  });
};

// Function to delete a player from a waiting room
export const deletePlayerFromWaitingRoom = async (roomId: string, player: string): Promise<void> => {
  const docRef = doc(firebase.db, 'waitingRooms', roomId);
  await updateDoc(docRef, {
    players: arrayRemove(player),
    updatedAt: new Date(),
  });
};

export const deleteAllPlayers = async (roomId: string): Promise<void> => {
  const docRef = doc(firebase.db, 'waitingRooms', roomId);
  await updateDoc(docRef, {
    players: [],
    updatedAt: new Date(),
  });
};

export const updateWaitingRoomForGameStart = async (roomId: string, route: string): Promise<void> => {
  const docRef = doc(firebase.db, 'waitingRooms', roomId);
  await updateDoc(docRef, {
    players: [],
    hasStarted: true,
    route,
    updatedAt: new Date(),
  });
}

