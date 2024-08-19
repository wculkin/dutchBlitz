import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { useFirebase } from '../Firebase/context';

interface State {
  username: string;
  email: string;
  passwordOne: string;
  passwordTwo: string;
  error: { message: string } | null;
}

const INITIAL_STATE: State = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const SignUpForm: React.FC = () => {
  const [state, setState] = useState<State>({ ...INITIAL_STATE });
  const navigate = useNavigate();
  const firebase = useFirebase();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    const { email, passwordOne } = state;

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser:any) => {
        setState({ ...INITIAL_STATE });
        navigate(ROUTES.HOME); // Redirect to home page
      })
      .catch((error:any) => {
        setState(prevState => ({ ...prevState, error }));
      });


  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const { username, email, passwordOne, passwordTwo, error } = state;

  return (
    <form onSubmit={onSubmit}>
      <input
        name="username"
        value={username}
        onChange={onChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="passwordOne"
        value={passwordOne}
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <input
        name="passwordTwo"
        value={passwordTwo}
        onChange={onChange}
        type="password"
        placeholder="Confirm Password"
      />
      <button type="submit">Sign Up</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default SignUpForm;
