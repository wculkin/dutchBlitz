import React from 'react';
import {
  BrowserRouter as Router,
  Route, Routes,
} from 'react-router-dom';

import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';

import * as ROUTES from '../../constants/routes';
import ProtectedRoute from "../Authitication/ProtectedRoute";
import NotFound from "../NotFound/NotFound";
import {useAuth} from "../../useAuth";
import WaitingRoomInitial from "../WaitingRoom/WaitingRoomInitial";
import Game from "../Games";
import './App.css';
import Lobby from "../Lobby/Lobby";
import GameTime from '../Games/GameWithRealTime';
import WaitingRoomPage from "../WaitingRoom/WaitingRoomPage";


const App: React.FC = () => {
  const { loading } = useAuth(); // Initialize the auth listener
  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth state
  }
  return (
  <Router>
    <div>
      <Navigation />

      <hr />
    <Routes>
      <Route  path={ROUTES.LANDING} element={<Lobby/>} />
      <Route  path={ROUTES.SIGN_UP} element={<SignUpPage/>} />
      <Route  path={ROUTES.SIGN_IN} element={<SignInPage/>} />
      <Route path={ROUTES.WAITING_ROOM_KEY} element={<ProtectedRoute element={<WaitingRoomPage />} />} />
      <Route  path={ROUTES.GAME_WITH_KEY} element={<Game />} />
      <Route  path={ROUTES.GAME_REALTIME_WITH_KEY} element={<GameTime />} />
      <Route  path={ROUTES.GAME_WITH_COMPUTERS_REALTIME_WITH_KEY} element={<GameTime />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
  </Router>
);}

export default App;