import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Database, getDatabase} from 'firebase/database';
import {getFunctions, connectFunctionsEmulator, httpsCallable} from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

class Firebase {
   app: FirebaseApp;
    auth: Auth;
    db: Firestore;
    realTime: Database;
    functions;


  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.realTime = getDatabase(this.app);
    this.functions = getFunctions(this.app);
    // if (window.location.hostname === "localhost") {
    //   connectFirestoreEmulator(this.db,"localhost", 8080); // or whatever port your emulator is running on
    // }
    // if (window.location.hostname === "localhost") {
    //   connectDatabaseEmulator(this.realTime,"localhost", 9000); // or whatever port your emulator is running on
    // }
    if (window.location.hostname === "localhost") {
      connectFunctionsEmulator(this.functions,"localhost", 5001); // or whatever port your emulator is running on
    }
      this.auth = getAuth(this.app);
     //connectAuthEmulator(this.auth, 'http://localhost:9099');

  }

  doCallCloudFunction = async (eventType: string, params: any) => {
    const handleEvent:any = httpsCallable(this.functions, 'handleOnCall');

    try {
      const result = await handleEvent({ eventType, params });
      console.log('Success:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error calling Cloud Function:', error);
      throw error;
    }
  };

  doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
    return await this.doCallCloudFunction("CREATE_USER", {email, password})
  }

  doSignInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  doSignOut = () => {
    return signOut(this.auth);
  }

}

export default Firebase;
