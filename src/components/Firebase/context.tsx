import React, { createContext, ReactNode, useContext } from 'react';
import Firebase from './firebase';

const FirebaseContext = createContext<Firebase | null>(null);

interface Props {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<Props> = ({ children }) => {
  const firebase = new Firebase();
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): Firebase => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext;
