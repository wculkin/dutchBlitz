import React from 'react';

const Firebase = () => (
  <div>
    <h1>Firebase</h1>
  </div>
);

export default Firebase;


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);