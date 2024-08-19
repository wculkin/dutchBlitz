import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import SignOutButton from "../SignOut/SignoutButton";
import {useGlobalState} from "../Firebase/GlobalUser";

const Navigation = () => {
  const { user } = useGlobalState();
return(
  <div>
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Lobby</Link>
      </li>
      {user && (
          <li>
            <SignOutButton/>
          </li>
      )}

    </ul>
  </div>
);
}

export default Navigation;