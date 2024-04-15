"use client";

import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Profile.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { push } = useRouter();
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  if (!authenticated) {
    useEffect(() => {
      push("/");
    }, []);

    return <></>;
  }

  const logOut =() => {
    localStorage.setItem("authenticated", "false");
    localStorage.setItem("username", "");
    push("/");
  }

  return (
    <>
      <Navbar isUserAuthenticated={true} activeLink="" />
      <div className={styles.Home}>
        <div className={styles.Content}>
          <h3 className={styles.h3}>Profile Settings</h3>
          <h2>Change Password</h2>
          <input type="password"></input>
          <button className={styles.btn_primary}>Submit</button>
          <h2>Change Email</h2>
          <input></input>
          <button className={styles.btn_primary}>Submit</button>
          <h2>Save Your Elo</h2>
          <input></input>
          <button className={styles.btn_primary}>Submit</button>
          <h2>Logout</h2>
          <button className={styles.btn_primary} onClick={() => logOut()}>
            Log out
          </button>
          <h3>Information</h3>
          <h2>Current Email: {/*DISPLAY USER.EMAIL*/}</h2>
          <h2>Current Password: {/*DISPLAY USER.PASSWORD*/}</h2>
          <h2>Current Elo: {/*DISPLAY USER.ELO*/}</h2>
        </div>
      </div>
    </>
  );
}
