import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {doc,setDoc} from 'firebase/firestore'
import { auth,firestore } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        phoneNumber: phoneNumber,
      });

      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <>
    <Navbar/>
    <div className="sign-in-page">
      <h1>REGISTER</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">REGISTER</button>
        <br></br>
        <button onClick={handleLogin}>LOGIN</button>
      </form>
      {error && <p>{error}</p>}
    </div>
    </>
  );
};

export default SignUpPage;
