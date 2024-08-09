import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from "../../src/components/Navbar";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;

        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          email: user.email,
          phoneNumber: values.phoneNumber,
          username: values.username,
        });

        navigate("/home");
      } catch (error) {
        let errorMessage = "";
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage =
              "Email already exists. Please use a different email.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address. Please enter a valid email.";
            break;
          case "auth/weak-password":
            errorMessage = "Weak password. Please enter a stronger password.";
            break;
          default:
            errorMessage = error.message;
        }
        setError(errorMessage);
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="signuppp">
        <div className="sign-up-page">
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className={formik.errors.username ? 'error' : ''}
              {...formik.getFieldProps("username")}
            />
            {formik.errors.username && <p>{formik.errors.username}</p>}

            <input
              type="email"
              placeholder="Email"
              className={formik.errors.email ? 'error' : ''}
              {...formik.getFieldProps("email")}
            />
            {formik.errors.email && <p>{formik.errors.email}</p>}

            <input
              type="password"
              placeholder="Password"
              className={formik.errors.password ? 'error' : ''}
              {...formik.getFieldProps("password")}
            />
            {formik.errors.password && <p>{formik.errors.password}</p>}

            <input
              type="tel"
              placeholder="Phone Number"
              className={formik.errors.phoneNumber ? 'error' : ''}
              {...formik.getFieldProps("phoneNumber")}
            />
            {formik.errors.phoneNumber && <p>{formik.errors.phoneNumber}</p>}

            <button type="submit">REGISTER</button>
            <br />
            <button type="button" onClick={() => navigate("/")}>
              LOGIN
            </button>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
