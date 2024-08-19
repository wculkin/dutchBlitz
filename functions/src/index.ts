/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onValueWritten} from "firebase-functions/v2/database";
import {initializeApp} from "firebase-admin/app";
import {makeComputerMove} from "./gameFunctions";
import {onCall} from "firebase-functions/v2/https";
import {Firebase} from "./Firebase";
import {ref, update, runTransaction, getDatabase} from 'firebase/database';


// Initialize Firebase Admin SDK
initializeApp();

// Define a function that listens to changes in the specified path
const refR = "/computer/gameStates/{uuid}";


const firestore = new Firebase();
const gameStateRef = ref(firestore.realTime, refR);
export const gameStateChangeListener = onValueWritten(refR, async (event) => {
  const snapshot = event.data.after;
  const previousSnapshot = event.data.before;

  // console.log(`Data changed for game with uuid: ${event.params.uuid}`);
  // console.log("New data:", snapshot.val());
  // console.log("Previous data:", previousSnapshot.val());

  const newState = makeComputerMove(snapshot.val());
  await update(gameStateRef, newState)
        .then(() => {
            console.log('Document successfully updated!');
        })
        .catch((error) => {
            console.error('Error updating document: ', error);
        });

  // Implement your custom logic here
});


export const makePlayerMove = onCall((event) => {
  // Add your logic here


  // Example: Log the player's move
  console.log(`Event ${event} `);

  // Implement your custom logic here
  // You can interact with Firestore, Authentication, etc.

  return {success: true, message: "Move registered successfully"};
});
