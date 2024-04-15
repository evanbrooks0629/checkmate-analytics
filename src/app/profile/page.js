"use client";

import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [elo, setElo] = useState("");
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  if (!authenticated) {
    useEffect(() => {
      push("/");
    }, []);

    return <></>;
  }

  const logOut = () => {
    localStorage.setItem("authenticated", "false");
    localStorage.setItem("username", "");
    push("/");
  };

  async function updateUser() {
    const oldEmail = localStorage.getItem("username");
    var newEmail = email;
    var newElo = elo;
    var newPass = password;
    const response = await fetch("http://localhost:1234/api/user-data/" + oldEmail, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        if(email==''){
          newEmail = r.USERNAME
        }
        if(elo ==''){
          newElo = r.ELO;
        }
        if(password == ''){
          newPass = r.PASSWORD;
        }
      })
      .catch((error) => console.error("Error", error));

    fetch("http://localhost:1234/api/update-user/" + oldEmail + "/"  + newEmail + "/" + newPass + "/" + newElo, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status == 200) {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("username", email);

        push("/dashboard");

        return <></>;
      }
    });
  };

  return (
    <>
      <Navbar isUserAuthenticated={true} activeLink="" />
      <div className={styles.Home}>
        <div className={styles.Content}>
          <h3 className={styles.h3}>Profile Settings</h3>
          <h2>Change Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button className={styles.btn_primary} onClick={() => updateUser()}>
            Submit
          </button>
          <h2>Change Email</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <button className={styles.btn_primary} onClick={() => updateUser()}>
            Submit
          </button>
          <h2>Save Your Elo</h2>
          <input value={elo} onChange={(e) => setElo(e.target.value)}></input>
          <button className={styles.btn_primary} onClick={() => updateUser()}>
            Submit
          </button>
          <h2>Logout</h2>
          <button className={styles.btn_primary} onClick={() => logOut()}>
            Log out
          </button>
          {/*
          <h3>Information</h3>
          <h2>Current Email: {DISPLAY USER.EMAIL}</h2>
          <h2>Current Password: {DISPLAY USER.PASSWORD}</h2>
          <h2>Current Elo: {DISPLAY USER.ELO}</h2>
          */}
        </div>
      </div>
    </>
  );
}
