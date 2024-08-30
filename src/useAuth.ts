import { useContext, useEffect, useState } from 'react';
import {FirebaseContext} from "./components/Firebase";
import {useGlobalDispatch} from "./components/Firebase/GlobalUser";

export const useAuth = () => {
  const firebase = useContext(FirebaseContext);
  const dispatch = useGlobalDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!firebase){return}
    const unsubscribe = firebase.auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User logged in:', user); // Debug log
        const userData = await firebase.getUser(user.uid)
        dispatch({ type: 'SET_USER', payload: user, userData: userData});
      } else {
         createRandomUser()
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firebase, dispatch]);

  const createRandomUser = async () => {
     if(!firebase){return}
     const data = await firebase.doCreateUserWithEmailAndPassword("","")
     await signIn(data.data.userData.email, "qqqqqq")
  };

  const signIn = async (email: string, password: string) => {
     if(!firebase){return}
    try {
      const userCredential = await firebase.doSignInWithEmailAndPassword(email, password);
      const userData = await firebase.getUser(userCredential.user.uid)
      dispatch({ type: 'SET_USER', payload: userCredential.user, userData: userData });
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
