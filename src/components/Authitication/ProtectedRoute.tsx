import React from 'react';
import { Navigate } from 'react-router-dom';
import {useGlobalState} from "../Firebase/GlobalUser";
import {useAuth} from "../../useAuth";
import * as ROUTES from '../../constants/routes';


interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user } = useGlobalState();
  const { loading } = useAuth();

  console.log('ProtectedRoute user:', user); // Debug log

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while checking auth state
  }

  if (!user) {
    // Redirect to sign-in page if the user is not logged in
    return <Navigate to={ROUTES.SIGN_IN} />;
  }

  // Render the element if the user is logged in
  return element;
};

export default ProtectedRoute;
