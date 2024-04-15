"use client";
import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from 'next/navigation'

function GamesList() {
  const [games, setGames] = useState([]);
    


  useEffect(() => {
    fetch("http://localhost:1234/api/games")
      .then((response) => response.json())
      .then((data) => {
        setGames(data);
        console.log(games);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className={styles.GameListContainer}>
      <ul className={styles.GameList}>
        <li style={{ fontWeight: "bold" }}>
          WhitePlayerID | BlackPlayerID | Date | Outcome
        </li>
        <div
          style={{ borderBottom: "2px solid black", marginTop: "5px" }}
        ></div>
        {games.map((game) => (
          <li key={game.GAMEID}>
            {game.WHITEPLAYERID} | {game.BLACKPLAYERID} |{" "}
            {moment(game.ENDDATETIME).format("MM-DD-YYYY HH:mm:ss")} |{" "}
            {game.TERMINATION}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlayerList() {

    const [players, setPlayers] = useState([]);

    useEffect(() => {
      fetch("http://localhost:1234/api/players")
        .then((response) => response.json())
        .then((data) => {
          setPlayers(data);
          console.log(players);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
      <div className={styles.GameListContainer}>
      <ul className={styles.GameList}>
        <div
          style={{marginTop: "5px" }}
        ></div>
        {players.map((player) => (
          <li key={player.PLAYERNAME}>
            {player.PLAYERNAME}
          </li>
        ))}
      </ul>
    </div>
    );
}

export default function Dashboard() {

  const [name, setName] = useState(""); // To store the player name input by the user
  const [player, setPlayer] = useState(null); // To store the player data retrieved from the API
  const [error, setError] = useState(""); // To store any error message
  const players = PlayerList();
  const { push } = useRouter();
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") === 'true');

  if(!authenticated){

      useEffect(() => {
          push('/');
      }, []);

      return <></>
  }



  const fetchPlayerStats = () => {
    fetch(`http://localhost:1234/api/players/${name}`) // Corrected endpoint
      .then((response) => response.json()) // First, convert the response to JSON
      .then((data) => {
        if (data) {
          setPlayer(data);// Set the player data
          console.log(data);
          setError(""); // Clear any previous errors
        } else {
          throw new Error("Player not found"); // Handle empty data as an error
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error.message);
        setError(error.message); // Set error message
        setPlayer(null); // Clear any previous player data
      });
  };

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
                        <button
                            className={styles.btn_primary}
                            onClick={() => (window.location.href = "/queries")}
                        >
                            See Queries
                        </button>
                    </div>
                    <p className={styles.p}>
                        Effortlessly craft queries to find the exact data you are looking
                        for
                    </p>
                </div>
                <div className={styles.TopGrid}>
                    <div className={styles.QueryRow}>
                        <h2 className={styles.Title}>View Charts</h2>
                        <button
                            className={styles.btn_primary}
                            onClick={() => (window.location.href = "/charts")}
                        >
                            See Statistics
                        </button>
                    </div>
                    <p className={styles.p}>
                        View our free charts which show different data over time
                    </p>
                </div>
                <div className={styles.BottomGrid}>
                    <h3 className={styles.BottomTitle}>Recent Grandmaster Games</h3>
                    <div className={styles.RecentBox}>{games}</div>
                </div>
                <div className={styles.BottomGrid}>
                    <h3 className={styles.BottomTitle}>Find a Player</h3>
                    <div className={styles.SearchRow}>
                        <input
                            className={styles.SearchBar}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} // Update name state on input change
                            placeholder="Enter player name"
                        ></input>
                        <button className={styles.btn_primary} onClick={fetchPlayerStats}>
                            Search
                        </button>
                    </div>
                    <div className={styles.SearchResults}>
                        {error && <div className={styles.errorMsg}>{error}</div>}
                        {player && (
                            <>
                                <div className={styles.playerName}>
                                    <p>
                                        {player.REALNAME !== "N/A"
                                            ? player.REALNAME
                                            : player.PLAYERNAME}
                                    </p>
                                </div>
                                <div className={styles.border} />
                                <div className={styles.stats}>
                                    <p>ELO: {player.ELO}</p>
                                    <p>Player ID: {player.PLAYERID}</p>
                                </div>
                            </>
                        )}
                        {!player && players}
                    </div>
                </div>
            </div>
        </div>
    </>
);
}
