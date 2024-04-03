'use client';

import React, { useState } from 'react';
import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Login.module.css';
import Link from 'next/link';

export default function LogIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form is valid. Submitting data...");
        } else {
            console.log("Form has errors.");
        }
    };

    const renderErrorMessages = () => {
        return (
            <div className={styles.errorMessages}>
                {Object.keys(errors).map((key, index) => (
                    <div className={styles.error} key={index}>{errors[key]}</div>
                ))}
            </div>
        );
    };

    return (
        <>
            <Navbar isUserAuthenticated={false} activeLink="" />
            <div className={styles.Home}>
                <div className={styles.FormContainer}>
                    <div className={styles.Content}>
                        <h3 className={styles.h3}>Checkmate Analytics - Log In</h3>
                        <form className={styles.form} onSubmit={onSubmit}>
                            <label className={styles.label} htmlFor="email">Email</label>
                            <input className={styles.input} type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label className={styles.label} htmlFor="password">Password</label>
                            <input className={styles.input} type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button className={styles.submit} type="submit">Submit</button>
                            {Object.keys(errors).length > 0 && renderErrorMessages()}
                        </form>
                    </div>
                    <a href="/" className={styles.back}>Go Back</a>
                </div>
            </div>
        </>
    );
}