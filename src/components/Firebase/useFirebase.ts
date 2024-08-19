import { useContext } from 'react';
import FirebaseContext from './context';

const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};



export default useFirebase;
