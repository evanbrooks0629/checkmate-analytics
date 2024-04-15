"use client";

import React, { useState, useEffect } from "react";
import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let tempErrors = {};
    if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }
    if (password.length < 5) {
      tempErrors.password = "Password must be at least 5 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const wrongPassword = () => {
    let tempErrors = {};
    tempErrors.password = "Wrong Password";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const userNotFound = () => {
    let tempErrors = {};
    tempErrors.email = "Email not found";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid. Submitting data...");
      fetch(
        "http://localhost:1234/api/user-verification/" + email + "/" + password,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      ).then((response) => {
        //Username taken
        if (response.status == 403) {
          wrongPassword();
        } else if (response.status == 404) {
          userNotFound();
        }
        //good to log in
        else if (response.status == 200) {
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("username", email);

          push("/dashboard");

          return <></>;
        }
      });
    } else {
      console.log("Form has errors.");
    }
  };

  const renderErrorMessages = () => {
    return (
      <div className={styles.errorMessages}>
        {Object.keys(errors).map((key, index) => (
          <div className={styles.error} key={index}>
            {errors[key]}
          </div>
        ))}
      </div>
    );
  };

  const { push } = useRouter();
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  if (authenticated) {
    useEffect(() => {
      if (authenticated) {
        push("/dashboard");
      }
    });
  }

  return (
    <>
      <Navbar isUserAuthenticated={false} activeLink="" />
      <div className={styles.Home}>
        <div className={styles.FormContainer}>
          <div className={styles.Content}>
            <h3 className={styles.h3}>Checkmate Analytics - Log In</h3>
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.input}
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.input}
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className={styles.submit} type="submit">
                Submit
              </button>
              {Object.keys(errors).length > 0 && renderErrorMessages()}
            </form>
          </div>
          <a href="/" className={styles.back}>
            Go Back
          </a>
        </div>
      </div>
    </>
  );
}
