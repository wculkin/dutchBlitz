import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { User } from 'firebase/auth';
import {UserData} from "../../sharedStuff/interfaces";

type State = {
  user: User | null;
  userData: UserData | null
};

type Action = { type: 'SET_USER'; payload: User; userData: UserData; } | { type: 'CLEAR_USER' };

const initialState: State = {
  user: null,
  userData: null
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, userData: action.userData };
    case 'CLEAR_USER':
      return { ...state, user: null };
    default:
      return state;
  }
};

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useGlobalState = (): State => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const useGlobalDispatch = (): Dispatch<Action> => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalStateProvider');
  }
  return context;
};
