import React from 'react';
import {useGlobalState} from "../Firebase/GlobalUser";

const Landing: React.FC = () => {
  const { user } = useGlobalState();
  return (
      <>
        <h1>Landing</h1>
    <div>
      {user ? (
        <p>User is logged in: {user.email}</p>
      ) : (
        <p>No user is logged in.</p>
      )}
    </div>
        </>
  );
};
export default Landing;
