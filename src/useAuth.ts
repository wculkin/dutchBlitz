import { useContext, useEffect, useState } from 'react';
import {FirebaseContext} from "./components/Firebase";
import {useGlobalDispatch} from "./components/Firebase/GlobalUser";

export const useAuth = () => {
  const firebase = useContext(FirebaseContext);
  const dispatch = useGlobalDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!firebase){return}
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User logged in:', user); // Debug log
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        console.log('No user logged in'); // Debug log
        dispatch({ type: 'CLEAR_USER' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebase, dispatch]);

  const signIn = async (email: string, password: string) => {
     if(!firebase){return}
    try {
      const userCredential = await firebase.doSignInWithEmailAndPassword(email, password);
      dispatch({ type: 'SET_USER', payload: userCredential.user });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Re-throw error to be handled by the caller
    }
  };

  const signOut = async () => {
    if(!firebase){return}
    try {
      await firebase.doSignOut();
      dispatch({ type: 'CLEAR_USER' });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw error to be handled by the caller
    }
  };

  return { loading, signIn, signOut };
};
