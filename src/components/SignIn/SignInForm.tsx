import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {useAuth} from "../../useAuth";

interface State {
  email: string;
  password: string;
  error: { message: string } | null;
}

const INITIAL_STATE: State = {
  email: '',
  password: '',
  error: null,
};

const SignInForm: React.FC = () => {
  const [state, setState] = useState<State>({ ...INITIAL_STATE });
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission from reloading the page
    const { email, password } = state;

    try {
      await signIn(email, password);
      setState({ ...INITIAL_STATE });
      navigate(ROUTES.LANDING); // Redirect to home page
    } catch (error: any) {
      console.error('Error signing in:', error); // Log error to console
      setState(prevState => ({ ...prevState, error }));
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const { email, password, error } = state;

  const isInvalid = password === '' || email === '';

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="password"
        value={password}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign In
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default SignInForm;
