'use client'
import '../globals.css'
import Navbar from '../../components/Navbar';
import styles from './Dashboard.module.css';
import { useEffect, useState } from 'react';
import moment from 'moment';

function GamesList() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch('http://localhost:1234/api/games')
            .then(response => response.json())
            .then(data => {
                setGames(data);
                console.log(games);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className={styles.GameListContainer}>
            <ul className={styles.GameList}>
                <li style={{fontWeight: 'bold'}}>WhitePlayerID | BlackPlayerID | Date | Outcome</li>
                <div style={{borderBottom:'2px solid black', marginTop: '5px'}}></div>
                {games.map(game => (
                    <li key={game.GAMEID}>{game.WHITEPLAYERID} | {game.BLACKPLAYERID} | {moment(game.ENDDATETIME).format('MM-DD-YYYY HH:mm:ss')} | {game.TERMINATION}</li>
                ))}
            </ul>
        </div>
    );
}

export default function Dashboard() {
    //Create query logic
    const games = GamesList();
    return (
        <>
            <Navbar isUserAuthenticated={true} activeLink="dashboard" />
            <div className={styles.Home}>
                <div className={styles.Content}>
                    <div className={styles.TopGrid}>
                        <div className={styles.QueryRow}>
                            <h2 className={styles.Title}>View a Query</h2>
                            <button className={styles.btn_primary} onClick={() => window.location.href = '/queries'}>See Queries</button>
                        </div>
                        <p className={styles.p}>Effortlessly craft queries to find the exact data you are looking for</p>
                    </div>
                    <div className={styles.TopGrid}>
                        <div className={styles.QueryRow}>
                            <h2 className={styles.Title}>View Charts</h2>
                            <button className={styles.btn_primary} onClick={() => window.location.href = '/charts'}>See Statistics</button>
                        </div>
                        <p className={styles.p}>View our free charts which show different data over time</p>
                    </div>
                    <div className={styles.BottomGrid}>
                        <h3 className={styles.BottomTitle}>Recent Grandmaster Games</h3>
                        <div className={styles.RecentBox}>
                            {games}
                        </div>
                    </div>
                    <div className={styles.BottomGrid}>
                        <h3 className={styles.BottomTitle}>Find a Player</h3>
                        <div className={styles.SearchRow}>
                            <input className={styles.SearchBar}></input>
                            <button className={styles.btn_primary}>Search</button>
                        </div>
                        <div className={styles.SearchResults}>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}