import React from 'react';
import SignUpPage from '../SignUp';
import SignInForm from './SignInForm';

const SignInPage: React.FC = () => (
  <div>
    <h1>SignIn</h1>
      <SignInForm />
    <SignUpPage />
  </div>
);

export default SignInPage;
