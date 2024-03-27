'use client'

import styles from './Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Navbar (props) {
  const [isUserAuthenticated, setIsUserAuthenticated] = React.useState(props.isUserAuthenticated);
  return (
    <nav className={styles.nav}>
        <Link href="/">
          <Image 
            src="/CheckMateLogo.png"
            height={60}
            width={120}
            alt="Logo"
            />
        </Link> 
        {isUserAuthenticated && 
          <div className={styles.navLinks}>
              <a href="/dashboard" style={{ textDecoration: props.activeLink === "dashboard" ? "underline" : "none" }} className={styles.link}>Dashboard</a>
              <a href="/queries" style={{ textDecoration: props.activeLink === "queries" ? "underline" : "none" }} className={styles.link}>Queries</a>
              <a href="/charts" style={{ textDecoration: props.activeLink === "charts" ? "underline" : "none" }} className={styles.link}>Charts</a>
              <a href="/players" style={{ textDecoration: props.activeLink === "players" ? "underline" : "none" }} className={styles.link}>Players</a>
              <a href="/profile" style={{ textDecoration: props.activeLink === "profile" ? "underline" : "none" }} className={styles.btn_primary}>My Profile</a>
          </div>
        }
        {!isUserAuthenticated && 
          <div className={styles.navLinks}>
              <a href="/login" className={styles.btn_primary}>Log In</a>
              <a href="/signup" className={styles.btn_secondary}>Sign Up</a>
          </div>
        }
    </nav>
  );
};