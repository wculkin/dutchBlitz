import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {useAuth} from "../../useAuth";

const SignOutButton: React.FC = () => {
    const { signOut } = useAuth();

  const navigate = useNavigate();

  const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await signOut();
      navigate(ROUTES.SIGN_IN); // Redirect to sign-in page after sign-out
    } catch (error) {
      console.error('Error signing out:', error); // Log error if sign-out fails
    }
  };

  return (
    <button type="button" onClick={onClick}>
      Sign Out
    </button>
  );
};

export default SignOutButton;