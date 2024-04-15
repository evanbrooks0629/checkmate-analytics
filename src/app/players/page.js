"use client";

import '../globals.css';
import Navbar from '../../components/Navbar';
import styles from './Players.module.css';
import { useState } from 'react';

export default function Players() {
    const [name, setName] = useState('');  // To store the player name input by the user
    const [player, setPlayer] = useState(null);  // To store the player data retrieved from the API
    const [error, setError] = useState('');  // To store any error message

    const fetchPlayerStats = () => {
        fetch(`http://localhost:1234/api/players/${name}`)  // Corrected endpoint
            .then(response => response.json())  // First, convert the response to JSON
            .then(data => {
                if (data) {
                    setPlayer(data);  // Set the player data
                    console.log(data)
                    setError('');  // Clear any previous errors
                } else {
                    throw new Error('Player not found');  // Handle empty data as an error
                }
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
                setError(error.message);  // Set error message
                setPlayer(null);  // Clear any previous player data
            });
    };

    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="dashboard" />
            <div className={styles.mainDiv}>
                <div className={styles.searchBarDiv}>
                    <div className={styles.searchBox}>
                        <span>Search for player:</span>
                        <div className={styles.boxAndButton}>
                            <input 
                                className={styles.input}
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}  // Update name state on input change
                                placeholder="Enter player name"
                            />
                            <button className={styles.searchBtn} onClick={fetchPlayerStats}>Search</button> 
                        </div>
                    </div>
                </div>
                {error && <div className={styles.errorMsg}>{error}</div>} 
                <div className={styles.resultDiv}>
                    {player && (
                        <>
                            <div className={styles.playerName}>
                                <p>{player.REALNAME !== 'N/A' ? player.REALNAME : player.PLAYERNAME}</p>  
                            </div>
                            <div className={styles.border} />
                            <div className={styles.stats}>
                                <p>ELO: {player.ELO}</p> 
                                <p>Player ID: {player.PLAYERID}</p>  
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
