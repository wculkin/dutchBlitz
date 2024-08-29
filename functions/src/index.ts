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

import {OnCallHandler} from "./onCallHandler";
import {Firebase} from "./Firebase";
import * as admin from "firebase-admin";

admin.initializeApp();

const firebase = new Firebase();
const functionHandler:OnCallHandler = new OnCallHandler(firebase);

export const handleOnCall = onCall(async (event) => {
  const {eventType, params} = event.data;
  // Log the extracted eventType and params for debugging
  console.log(`Event Type: ${eventType}`);
  console.log("Params: ", params);

  await functionHandler.handleEvent(eventType, params);
  return {success: true, message: "handledWaitingRoom"};
});

