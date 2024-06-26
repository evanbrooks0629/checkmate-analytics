"use client";
import "../globals.css";
import Navbar from "../../components/Navbar";
import styles from "./Queries.module.css";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

function runQuery(queryNumber) {
  const q2String = `WITH PlayerPerformance AS (
    SELECT
      EXTRACT(YEAR FROM CAST(G.EndDateTime AS DATE)) AS Year,
      P.PlayerID,
      AVG(P.Accuracy) AS Average_Accuracy,
      PERCENT_RANK() OVER (
        PARTITION BY EXTRACT(YEAR FROM CAST(G.EndDateTime AS DATE))
        ORDER BY P.Elo DESC
      ) AS Elo_Percentile
    FROM 
      Game G
    JOIN 
      Player P ON P.PlayerID = G.WhitePlayerID OR P.PlayerID = G.BlackPlayerID
    WHERE
      ACCURACY != '-1'
    GROUP BY
      EXTRACT(YEAR FROM CAST(G.EndDateTime AS DATE)),
      P.PlayerID,
      P.Elo
  )
  SELECT
    Year,
    COUNT(PlayerID) AS NumberOfPlayers,
    AVG(Average_Accuracy) AS Avg_Accuracy
  FROM 
    PlayerPerformance
  WHERE 
    Elo_Percentile <= 0.25 
  GROUP BY
    Year
  ORDER BY
    Year`;

  switch (queryNumber) {
    case 1:
      return (
        <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Result of Query 1
          </p>
          <p>
            Description: This query reveals preferences for time control
            settings across different Elo rating brackets, showing trends in the
            popularity of blitz, rapid, and standard time controls among
            different skill levels.
          </p>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            SQL Source Code
          </p>
          <p style={{ fontFamily: "sans-serif, Source Code Pro" }}>
            SELECT TimeControl, FLOOR(p.Elo / 100) * 100 AS EloBracket, COUNT(*)
            AS GameCount FROM Game g JOIN Player p ON g.WhitePlayerID =
            p.PlayerID OR g.BlackPlayerID = p.PlayerID GROUP BY TimeControl,
            FLOOR(p.Elo / 100) * 100 ORDER BY EloBracket, GameCount DESC
          </p>
          <a href="/charts">View Result Chart</a>
        </div>
      );
    case 2:
      return (
        <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Result of Query 2
          </p>
          <p>
            Description: This SQL query focuses on assessing the performance
            metrics of chess players belonging to the top 25% based on their Elo
            rating. By analyzing factors such as average accuracy across games
            and the Elo percentile of top players over the years, this query
            aims to provide insights into the performance trends of elite
            players in major chess events.
          </p>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            SQL Source Code
          </p>
          <p style={{ fontFamily: "sans-serif, Source Code Pro" }}>
            {q2String}
          </p>
          <a href="/charts">View Result Chart</a>
        </div>
      );
    case 3:
      // Code for query 3
      return (
        <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Result of Query 3
          </p>
          <p>Description: This query provides a detailed analysis of the most prevalent chess openings used by the top 5% of players, tracking how their preferences have shifted over the years. By focusing on Elite Opening Moves (ECO codes), the query highlights strategic trends and changes in gameplay at the highest levels of competition. Data is aggregated annually and ranks the frequency of each opening, offering insights into how top-tier players adapt their strategies to evolving game theories and opponent tendencies.</p>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            SQL Source Code
          </p>
          <p style={{ fontFamily: "sans-serif, Source Code Pro" }}>
            {`WITH PlayerThreshold AS (
          SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY Elo) AS TopElo
          FROM Player
      ),
      TopPlayers AS (
          SELECT DISTINCT PlayerID
          FROM Player
          WHERE Elo >= (SELECT TopElo FROM PlayerThreshold)
      ),
      EliteOpenings AS (
          SELECT
              M.ECO,
              COUNT(*) AS Games,
              TO_CHAR(G.EndDateTime, 'YYYY') AS Year,
              P.PlayerID,
              RANK() OVER (PARTITION BY TO_CHAR(G.EndDateTime, 'YYYY') ORDER BY P.Elo DESC) AS PlayerRank
          FROM
              Game G
          JOIN
              Player P ON G.WhitePlayerID = P.PlayerID OR G.BlackPlayerID = P.PlayerID
          JOIN
              Moves M ON G.MovesID = M.MovesID
          WHERE
              P.Elo >= (SELECT TopElo FROM PlayerThreshold)
          GROUP BY
              M.ECO, TO_CHAR(G.EndDateTime, 'YYYY'), P.PlayerID, P.Elo
      ),
      TotalGames AS (
          SELECT Year, ECO, SUM(Games) AS TotalGames
          FROM EliteOpenings
          GROUP BY Year, ECO
      )
      SELECT 
          t.Year, 
          t.ECO, 
          t.TotalGames
      FROM 
          TotalGames t
      WHERE 
          EXISTS (
              SELECT 1 FROM EliteOpenings eo 
              WHERE t.Year = eo.Year AND t.ECO = eo.ECO AND eo.PlayerRank <= CEIL(0.05 * (SELECT COUNT(*) FROM TopPlayers))
          )
      ORDER BY 
          t.Year, t.TotalGames DESC`}
          </p>
          <a href="/charts">View Result Chart</a>
        </div>
      );

    case 4:
      return (
        <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Result of Query 4
          </p>
          <p>The most popular chess openings (using the ECO codes) and their respective win rates by year.</p>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            SQL Source Code
          </p>
          <p style={{ fontFamily: "sans-serif, Source Code Pro" }}>
            {`WITH OpeningUsage AS (
            SELECT 
                m.ECO,
                m.ECOName,
                EXTRACT(YEAR FROM g.ENDDATETIME) AS Year,
                COUNT(*) AS GamesPlayed,
                COUNT(CASE WHEN g.Outcome = '1-0' THEN 1 END) AS WhiteWins,
                COUNT(CASE WHEN g.Outcome = '0-1' THEN 1 END) AS BlackWins,
                COUNT(CASE WHEN g.Outcome = '1/2-1/2' THEN 1 END) AS Draws
            FROM 
                Moves m
            JOIN 
                Game g ON m.MovesID = g.MovesID
            GROUP BY 
                m.ECO, m.ECOName, EXTRACT(YEAR FROM g.ENDDATETIME)
        ),
        OpeningWinRates AS (
            SELECT 
                ECO,
                ECOName,
                Year,
                GamesPlayed,
                WhiteWins,
                BlackWins,
                Draws,
                ROUND(((WhiteWins + BlackWins) / CAST(GamesPlayed AS FLOAT)) * 100, 2) AS WinRate,
                ROUND((Draws / CAST(GamesPlayed AS FLOAT)) * 100, 2) AS DrawRate
            FROM 
                OpeningUsage
        )
        SELECT 
            ECO,
            ECOName,
            Year,
            GamesPlayed,
            WinRate,
            DrawRate
        FROM 
            OpeningWinRates
        WHERE 
            GamesPlayed > (
                SELECT AVG(GamesPlayed) * 1.5 FROM OpeningUsage WHERE Year = OpeningWinRates.Year
            )
        ORDER BY 
            Year, WinRate DESC`}
          </p>
          <a href="/charts">View Result Chart</a>
        </div>
      );

    case 5:
      return (
        <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Result of Query 5
          </p>
          <p>Seasonal performance metrics split by year and season for chess players, showing games played, wins, and win percentage.</p>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            SQL Source Code
          </p>
          <p style={{ fontFamily: "sans-serif, Source Code Pro" }}>
            {`WITH SeasonalPerformance AS (
                SELECT 
                    p.PlayerID,
                    p.RealName,
                    p.PlayerName,
                    CASE 
                        WHEN EXTRACT(MONTH FROM g.EndDateTime) IN (12,1,2) THEN 'Winter'  -- Dec, Jan, Feb
                        WHEN EXTRACT(MONTH FROM g.EndDateTime) BETWEEN 3 AND 5 THEN 'Spring'  -- Mar, Apr, May
                        WHEN EXTRACT(MONTH FROM g.EndDateTime) BETWEEN 6 AND 8 THEN 'Summer'  -- Jun, Jul, Aug
                        ELSE 'Autumn'  -- Sep, Oct, Nov
                    END AS Season,
                    EXTRACT(YEAR FROM g.EndDateTime) AS Year,
                    COUNT(g.GameID) AS GamesPlayed,
                    SUM(
                    CASE
                        WHEN ((g.Outcome = '1-0' AND g.WhitePlayerID = p.PlayerID) OR (g.Outcome = '0-1' AND g.BlackPlayerID = p.PlayerID)) THEN 1 
                        ELSE 0 
                    END) AS Wins
                FROM 
                    Game g
                JOIN 
                    Player p ON (g.WhitePlayerID = p.PlayerID OR g.BlackPlayerID = p.PlayerID)
                GROUP BY 
                    p.PlayerID, p.RealName, p.PlayerName, Season, EXTRACT(YEAR FROM g.EndDateTime)
            )
            SELECT
                RealName,
                Season,
                Year,
                COUNT(GamesPlayed) AS GamesPlayed,
                SUM(Wins) AS Wins,
                ROUND((CAST(SUM(Wins) AS FLOAT) / COUNT(GamesPlayed))* 100, 2) AS WinPercentage
            FROM 
                SeasonalPerformance
            GROUP BY
                RealName, Season, Year
            ORDER BY 
                RealName, Year`}
          </p>
          <a href="/charts">View Result Chart</a>
        </div>
      );

    case 6:
        return(
          <div className={styles.ResultStyle}>
          <p style={{ textDecoration: "underline", fontWeight: "bold" }}>
            Result of Query 6
          </p>
          <p>
            Description: This SQL query gets the number of tuples in our database as is required by the project
          </p>
        </div>
        );
    default:
      // Code for invalid query number
      break;
  }
}





export default function Queries() {
  const [result, setResult] = useState(null);
  const { push } = useRouter();
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("authenticated") === 'true'); 
  const [tuples, setTuples] = useState(0)



  const getTuples = () => {
    fetch("http://localhost:1234/api/num-tuples/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json())
    .then((r) => {
      setTuples(r.COUNT)
    });
  }

  if (!authenticated) {

    useEffect(() => {
      push('/');
    }, []);

    return <></>
  }



  return (
    <>
      <Navbar isUserAuthenticated={true} activeLink="dashboard" />
      <div className={styles.mainDiv}>
        <div className={styles.create}>
          <div className={styles.queryHeader}>Select a query</div>
          <div className={styles.gridLayout}>
            <div className={styles.queries}>
              <p>Query 1</p>
              <p>Time Control Preferences by Player Rating</p>
              <button onClick={() => setResult(runQuery(1))}>
                See Source Code
              </button>
              <button onClick={() => (window.location.href = "/charts")}>
                View Chart Results
              </button>
            </div>
            <div className={styles.queries}>
              <p>Query 2</p>
              <p>Yearly Performance Metrics of Top Quartile Players</p>
              <button onClick={() => setResult(runQuery(2))}>
                See Source Code
              </button>
              <button>View Chart Results</button>
            </div>
            <div className={styles.queries}>
              <p>Query 3</p>
              <p>Evolution of Opening Strategies Among Top Players</p>
              <button onClick={() => setResult(runQuery(3))}>
                See Source Code
              </button>
              <button>View Chart Results</button>
            </div>
            <div className={styles.queries}>
              <p>Query 4</p>
              <p>Popular Chess Openings and their Win Rates by Year </p>
              <button onClick={() => setResult(runQuery(4))}>
                See Source Code
              </button>
              <button>View Chart Results</button>
            </div>
            <div className={styles.queries}>
              <p>Query 5</p>
              <p>Seasonal Performance Across the Year</p>
              <button onClick={() => setResult(runQuery(5))}>
                See Source Code
              </button>
              <button>View Chart Results</button>
            </div>
            <div className={styles.queries}>
              <p>Query 6</p>
              <p>Gets Number of Tuples</p>
              <button onClick={()=> getTuples()}>View Number of Tuples</button>
              <p>Tuples = {tuples}</p>
            </div>
          </div>
        </div>
        <div className={styles.results}>
          {result ? (
            result
          ) : (
            <h1 className={styles.Error}>
              Click On a Query To View Results 📣
            </h1>
          )}
        </div>
      </div>
    </>
  );
}
