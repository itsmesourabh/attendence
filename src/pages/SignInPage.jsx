import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../../src/components/Navbar";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === "admin@example.com" && password === "admin1234567") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  return (
    <>
      <Navbar />
      <div className="sign-in-page">
        <h1>LOGIN</h1>
        <form onSubmit={handleSignIn}>
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
          <button type="submit">LOGIN</button>
          <br></br>
          <button onClick={handleRegister}>REGISTER</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default SignInPage;
