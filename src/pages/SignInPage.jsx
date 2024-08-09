import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../../src/components/Navbar";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters long").required("Password is required"),
});

const SignInPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      if (values.email === "admin@example.com" && values.password === "admin1234567") {
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
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSignIn}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className={errors.email && touched.email ? 'error' : ''}
              />
              <ErrorMessage name="email" component="p" />

              <Field
                type="password"
                name="password"
                placeholder="Password"
                className={errors.password && touched.password ? 'error' : ''}
              />
              <ErrorMessage name="password" component="p" />

              <button type="submit">LOGIN</button>
              <br />
              <button type="button" onClick={handleRegister}>
                REGISTER
              </button>
            </Form>
          )}
        </Formik>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default SignInPage;
