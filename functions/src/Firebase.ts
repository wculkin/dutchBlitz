import {FirebaseApp, initializeApp} from "firebase/app";
import {Auth, getAuth} from "firebase/auth";
import {Firestore, getFirestore} from "firebase/firestore";
import {connectDatabaseEmulator, Database, getDatabase} from "firebase/database";
import {connectFunctionsEmulator, getFunctions} from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyD3h-1qs6YTQSJHSosgyGzoaI8Nn-SXE9Q",
  authDomain: "dutchblitzwithfriends.firebaseapp.com",
  projectId: "dutchblitzwithfriends",
  storageBucket: "dutchblitzwithfriends.appspot.com",
  messagingSenderId: "889904267613",
  appId: "1:889904267613:web:2c3c1635ce943853ffa8b4",
  measurementId: "G-16M5PBPYPP"
};

// Initialize Firebase
// const analytics = getAnalytics(app);

export class Firebase {
   app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    realTime: Database;
    functions;


  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.realTime = getDatabase(this.app);
    this.functions = getFunctions(this.app);
    // if (window.location.hostname === "localhost") {
    //   connectFirestoreEmulator(this.db,"localhost", 8080); // or whatever port your emulator is running on
    // }
    if (window.location.hostname === "localhost") {
      connectDatabaseEmulator(this.realTime,"localhost", 9000); // or whatever port your emulator is running on
    }
    if (window.location.hostname === "localhost") {
      connectFunctionsEmulator(this.functions,"localhost", 5001); // or whatever port your emulator is running on
    }
  }
}