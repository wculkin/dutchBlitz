import React from 'react';
import {
  BrowserRouter as Router, Navigate,
  Route, Routes,
} from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import ProtectedRoute from "../Authitication/ProtectedRoute";
import Firebase, { FirebaseContext } from "../Firebase";
import {GlobalStateProvider} from "../Firebase/GlobalUser";
import NotFound from "../NotFound/NotFound";
import {useAuth} from "../../useAuth";
import WaitingRoom from "../WaitingRoom/WaitingRoom";
import Game from "../Games";
import './App.css';
import Lobby from "../Lobby/Lobby";
import {GAME_REALTIME_WITH_KEY, WAITING_ROOM_KEY} from "../../constants/routes"; // Import the global CSS file
import GameTime from '../Games/GameWithRealTime';


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
      <Route

        path={ROUTES.PASSWORD_FORGET}
        element={<PasswordForgetPage/>}
      />
      <Route  path={ROUTES.HOME} element={<HomePage/>} />
      <Route  path={ROUTES.ACCOUNT} element={<AccountPage/>} />
      <Route  path={ROUTES.ADMIN} element={<AdminPage />} />
      <Route path={ROUTES.WAITING_ROOM_KEY} element={<ProtectedRoute element={<WaitingRoom />} />} />
      <Route  path={ROUTES.GAME_WITH_KEY} element={<Game />} />
      <Route  path={ROUTES.GAME_REALTIME_WITH_KEY} element={<GameTime />} />
      <Route  path={ROUTES.GAME_WITH_COMPUTERS_REALTIME_WITH_KEY} element={<GameTime />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
  </Router>


);}

export default App;