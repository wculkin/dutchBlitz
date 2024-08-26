/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// import {onValueWritten} from "firebase-functions/v2/database";
import {onCall} from "firebase-functions/v2/https";

import {WaitingRoomHandler} from "./waitingRoomHandler";
import {PlayerMoveHandler} from "./playerMoveHandler";
import {Firebase} from "./Firebase";
import * as admin from "firebase-admin";

// Define a function that listens to changes in the specified path
const refR = "/computer/gameStates/{uuid}";
admin.initializeApp();


// export const gameStateChangeListener = onValueWritten(refR, async (event) => {
//   // const snapshot = event.data.after;
//   // const previousSnapshot = event.data.before;
//   // console.log(previousSnapshot);
//   //
//   // // console.log(`Data changed for game with uuid: ${event.params.uuid}`);
//   // // console.log("New data:", snapshot.val());
//   // // console.log("Previous data:", previousSnapshot.val());
//   //
//   // const newState = makeComputerMove(snapshot.val());
//   // await update(gameStateRef, newState)
//   //   .then(() => {
//   //     console.log("Document successfully updated!");
//   //   })
//   //   .catch((error) => {
//   //     console.error("Error updating document: ", error);
//   //   });
//   console.log("fv");
//   return {success: true, message: "Move registered successfully"};
//   // Implement your custom logic here
// });
//
//
// export const makePlayerMove = onCall((event) => {
//   // Add your logic here
//   // Example: Log the player's move
//   // console.log(`Event ${event} `);
//   // const functionHandler = new PlayerMoveHandler();
//   // functionHandler.handleEvent(event);
//
//   // Implement your custom logic here
//   // You can interact with Firestore, Authentication, etc.
//
//   return {success: true, message: "Move registered successfully"};
// });

export const handleWaitingRoom = onCall((event) => {
  const {eventType, params} = event.data;

  // Log the extracted eventType and params for debugging
  console.log(`Event Type: ${eventType}`);
  console.log("Params: ", params);
  const firebase = new Firebase();
  const functionHandler = new WaitingRoomHandler(firebase);
  functionHandler.handleEvent(eventType, params);
  // Implement your custom logic here
  // You can interact with Firestore, Authentication, etc.

  return {success: true, message: "handledWaitingRoom"};
});

