"use client";
import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Queries.module.css";
import { useState } from "react";

function runQuery(queryNumber) {
  switch (queryNumber) {
    case 1:
      return (
        <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: 'bold' }}>Result of Query 1</p>
          <p>
            Description: This query reveals preferences for time control
            settings across different Elo rating brackets, showing trends in the
            popularity of blitz, rapid, and standard time controls among
            different skill levels.
          </p>
          <p style={{ textDecoration: "underline", fontWeight: 'bold' }}>SQL Source Code</p>
          <p style={{ fontFamily: "sans-serif, Source Code Pro" }}>
            SELECT m.ECO, m.ECOName, AVG(p.Elo) AS AverageElo, COUNT() AS
            MoveUsageCount, SUM(CASE WHEN g.Outcome = 'win' AND p.Color =
            'White' THEN 1 ELSE 0 END) / COUNT() * 100.0 AS SuccessRate FROM
            Moves m JOIN Game g ON g.MovesID = m.MovesID JOIN Player p ON
            p.PlayerID = g.WhitePlayerID OR p.PlayerID = g.BlackPlayerID GROUP
            BY m.ECO, m.ECOName ORDER BY AverageElo DESC, MoveUsageCount DESC;
          </p>
          <a href="/charts">View Result Chart</a>
        </div>
      );
    case 2:
      // Code for query 2
      break;
    case 3:
      // Code for query 3
      break;
    case 4:
      // Code for query 4
      break;
    case 5:
      // Code for query 5
      break;
    case 6:
      // Code for query 6
      break;
    default:
      // Code for invalid query number
      break;
  }
}

export default function Queries() {
  const [result, setResult] = useState(null);
return (
    <>
        <Navbar isUserAuthenticated={true} activeLink="dashboard" />
        <div className={styles.mainDiv}>
            <div className={styles.create}>
                <div className={styles.queryHeader}>Select a query</div>
                <div className={styles.gridLayout}>
                    <div className={styles.queries}>
                        <p>Query 1</p>
                        <p>
                            Elo Rating Distribution Over Time for Top Percentile of Players
                        </p>
                        <button onClick={() => setResult(runQuery(1))}>
                            See Source Code
                        </button>
                        <button onClick={() => window.location.href = '/charts'}>View Chart Results</button>
                    </div>
                    <div className={styles.queries}>
                        <p>Query 2</p>
                        <p>Time Control Preferences by Player Rating</p>
                        <button>See Source Code</button>
                        <button>View Chart Results</button>
                    </div>
                    <div className={styles.queries}>Query 3</div>
                    <div className={styles.queries}>
                        Query 4
                        <p>
                            Elo Rating Distribution Over Time for Top Percentile of Players
                        </p>
                        <button>See Source Code</button>
                        <button>View Chart Results</button>
                    </div>
                    <div className={styles.queries}>Query 5</div>
                    <div className={styles.queries}>Query 6</div>
                </div>
            </div>
            <div className={styles.results}>
                {result ? (
                    result
                ) : (
                    <h1 className={styles.Error}>Click On a Query To View Results 📣</h1>
                )}
            </div>
        </div>
    </>
);
}
