const express = require('express');
const oracledb = require('oracledb');
oracledb.autoCommit = true;
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');

dotenv.config({
    path: __dirname + "/../.env.local"
});

const app = express();
const port = 1234; // or any port you prefer

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // To get output as objects

// Database connection settings
const dbConfig = {
    user: "cmcloon",
    password: process.env.PASSWORD,  // Ensure your password is in the .env file
    connectString: "oracle.cise.ufl.edu:1521/orcl"
};

const secret = process.env.HASHSECRET;

// GET endpoint to fetch games
app.get('/api/games', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "cmcloon",
            password: process.env.PASSWORD,
            connectString: "oracle.cise.ufl.edu:1521/orcl"
        });
        const result = await connection.execute(`SELECT * FROM Game ORDER BY ENDDATETIME DESC FETCH NEXT 100 ROWS ONLY `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from Game table");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});


app.get('/api/players/:name', async (req, res) => {
    const playerName = req.params.name;  // Access the player name from URL parameters
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        // Proper SQL query to find a player by name
        const result = await connection.execute(
            `SELECT * FROM Player
            WHERE RealName LIKE :name
               OR PlayerName LIKE :name
            FETCH NEXT 1 ROWS ONLY`,
            { name: '%' + playerName + '%' },  // Binding the 'name' parameter with '%' wildcards
            { outFormat: oracledb.OUT_FORMAT_OBJECT }  // Output as object for easier handling
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);  // Send player data back to client, assuming only one match is expected
        } else {
            res.status(404).send('Player not found');  // Appropriate message if no player is found
        }
    } catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error fetching player data");
    } finally {
        if (connection) {
            try {
                await connection.close();  // Properly close the database connection
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});


// Route to fetch the first 50 players
app.get('/api/players', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT DISTINCT PLAYERNAME FROM PLAYER FETCH FIRST 1000 ROWS ONLY`  // Fetch first 1000 rows from Player table
        );

        if (result.rows.length > 0) {
            res.json(result.rows);  // Send all fetched player data back to client
        } else {
            res.status(404).send('No players found');
        }
    } catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error fetching player data");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
});

// Query 1 Time Control Preferences by Player Rating
// This query would reveal preferences for time control settings across different Elo rating brackets, 
// showing trends in the popularity of blitz, rapid, and standard time controls among different skill levels.
app.get('/api/time-control', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "cmcloon",
            password: process.env.PASSWORD,
            connectString: "oracle.cise.ufl.edu:1521/orcl"
        });
        const result = await connection.execute(`
        SELECT 
            TimeControl, 
            FLOOR(p.Elo / 100) * 100 AS EloBracket, 
            COUNT(*) AS GameCount 
        FROM 
            Game g 
            JOIN Player p ON g.WhitePlayerID = p.PlayerID OR g.BlackPlayerID = p.PlayerID 
        GROUP BY 
            TimeControl, 
            FLOOR(p.Elo / 100) * 100 
        ORDER BY 
            EloBracket, 
            GameCount DESC
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from Game table");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// Query 2
// Yearly Performance Metrics by Top Quartile Players
// This query focuses on players in the top 25% based on Elo rating 
// evaluating their performance metrics across the years.
app.get('/api/major-events-performance', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "cmcloon",
            password: process.env.PASSWORD,
            connectString: "oracle.cise.ufl.edu:1521/orcl"
        });

        const sqlQuery =
            `WITH PlayerPerformance AS (
                SELECT
                    EXTRACT(YEAR FROM G.ENDDATETIME) AS Year,
                    P.PlayerID,
                    AVG(P.Accuracy) AS Average_Accuracy,
                    PERCENT_RANK() OVER (
                        PARTITION BY EXTRACT(YEAR FROM G.ENDDATETIME)
                        ORDER BY P.Elo DESC
                    ) AS Elo_Percentile
                FROM 
                    Game G
                JOIN 
                    Player P ON P.PlayerID = G.WhitePlayerID OR P.PlayerID = G.BlackPlayerID
                WHERE
                    P.Accuracy != -1
                GROUP BY
                    EXTRACT(YEAR FROM G.ENDDATETIME),
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
                Year DESC 
        `;


        const result = await connection.execute(sqlQuery);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from the database");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing the connection", err);
            }
        }
    }
});

// Query 3
//  Evolution of Opening Strategies Among Top Players
//This query shows the use of different chess openings (ECO codes) by the top 5% of players varies over time, highlighting shifts in strategic preferences.
app.get('/api/opening-evolution', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "cmcloon",
            password: process.env.PASSWORD,
            connectString: "oracle.cise.ufl.edu:1521/orcl"
        });

        const sqlQuery = `
        WITH PlayerThreshold AS (
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
            t.Year, t.TotalGames DESC
        `;

        const result = await connection.execute(sqlQuery);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from Game table");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing the connection", err);
            }
        }
    }
});

// Query 4
// most popular chess openings (using the ECO codes) and their respective win rates by year.
app.get('/api/opening-win-rate', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "cmcloon",
            password: process.env.PASSWORD,
            connectString: "oracle.cise.ufl.edu:1521/orcl"
        });

        const sqlQuery = `
        WITH OpeningUsage AS (
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
            WHERE 
                EXTRACT(YEAR FROM g.ENDDATETIME) BETWEEN 2018 AND 2022
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
                ROUND((WhiteWins / CAST(GamesPlayed AS FLOAT)) * 100, 2) AS WinRate,
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
            GamesPlayed >= 750
        ORDER BY 
            Year, WinRate DESC
        `;

        const result = await connection.execute(sqlQuery);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from Game table");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing the connection", err);
            }
        }
    }
});

// Query 5
// Players winrates during different times of the year, across past 10+ years.
// Can visualize when more games are played ie. Summer, Winter, ... 
// Can visualzie who plays better during different times of the year.
app.get('/api/seasonal-data', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "cmcloon",
            password: process.env.PASSWORD,
            connectString: "oracle.cise.ufl.edu:1521/orcl"
        });

        const sqlQuery = `
        WITH SeasonalPerformance AS (
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
                p.PlayerID, p.RealName, p.PlayerName,
                CASE 
                    WHEN EXTRACT(MONTH FROM g.EndDateTime) IN(12,1,2) THEN 'Winter'
                    WHEN EXTRACT(MONTH FROM g.EndDateTime) BETWEEN 3 AND 5 THEN 'Spring'
                    WHEN EXTRACT(MONTH FROM g.EndDateTime) BETWEEN 6 AND 8 THEN 'Summer'
                    ELSE 'Autumn'
                END,
                EXTRACT(YEAR FROM g.EndDateTime)
        )
        SELECT
            RealName,
            Season,
            Year,
            COUNT(GamesPlayed),
            SUM(Wins),
            ROUND((CAST(SUM(Wins) AS FLOAT) / COUNT(GamesPlayed))* 100, 2) AS WinPercentage
        FROM 
            SeasonalPerformance
        GROUP BY
            RealName, Season, Year
        ORDER BY 
            RealName, Year
        `;

        const result = await connection.execute(sqlQuery);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data from Game table");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing the connection", err);
            }
        }
    }
});


//User creation
app.post('/api/user-creation', async (req, res) => {
    const username = req.body.username;
    const password = crypto.createHmac('sha256', secret).update(req.body.password).digest('hex');

    try {
        connection = await oracledb.getConnection(dbConfig);

        //check if username exists
        const userNameCheck = await connection.execute(
            `SELECT * FROM Users WHERE userName = :username`,
            { username: username }
        );

        if (userNameCheck.rows.length > 0) {
            res.status(403).send("Username already exists");
            return;
        }

        //otherwise find next id and make new user
        const newIDresult = await connection.execute(
            'SELECT MAX(UserID) AS NewID FROM Users'
        );

        const newID = newIDresult.rows[0].NEWID + 1;

        const result = await connection.execute(
            `INSERT INTO Users(UserID, userName, password)
            VALUES (:userID, :userName, :password)`,
            { userID: newID, userName: username, password: password }
        )
        res.send(result.rows).status(200);
    }
    catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error creating new user");
    }
    finally {
        if (connection) {
            try {
                await connection.close();  // Properly close the database connection
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }


})


//Verifying password for specific username
app.get('/api/user-verification/:username/:password', async (req, res) => {

    const userName = req.params.username;  // Access the user name from URL parameters
    const password = crypto.createHmac('sha256', secret).update(req.params.password).digest('hex');
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        // Proper SQL query to find a player by name
        const result = await connection.execute(
            `SELECT * FROM Users
            WHERE UserName = :name
            FETCH NEXT 1 ROWS ONLY`,
            { name: userName },  // Binding the 'username' parameter with '%' wildcards
            { outFormat: oracledb.OUT_FORMAT_OBJECT }  // Output as object for easier handling
        );

        if (result.rows.length > 0) {
            //Check if passwords are equal
            if (result.rows[0].PASSWORD == password) {
                res.json(result.rows[0]);  // Send player data back to client, assuming only one match is expected
            }
            else {
                res.status(403).send("Verification Failed");
            }
        } else {
            res.status(404).send('User not found');  // Appropriate message if no user is found
        }
    } catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error fetching user data");
    } finally {
        if (connection) {
            try {
                await connection.close();  // Properly close the database connection
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }



})

//updating user
app.put('/api/update-user/:username/:usernameNew/:password/:elo', async (req, res) => {
    const username = req.params.username;
    const usernameNew = req.params.usernameNew;
    const password = crypto.createHmac('sha256', secret).update(req.params.password).digest('hex');
    const elo = req.params.elo;
    try {
        connection = await oracledb.getConnection(dbConfig);
        // Proper SQL query to find a player by name
        const result = await connection.execute(
            `UPDATE Users SET Username=:newname, Password = :password, Elo = :elo
            WHERE UserName = :name`,
            { newname: usernameNew, password: password, elo: elo, name: username },  // Binding the 'username' parameter with '%' wildcards
            { outFormat: oracledb.OUT_FORMAT_OBJECT }  // Output as object for easier handling
        );

        res.status(200).send(result);
    }
    catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error creating new user");
    }
    finally {
        if (connection) {
            try {
                await connection.close();  // Properly close the database connection
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }

})


//Get user
app.get('/api/user-data/:username', async (req, res) => {

    const userName = req.params.username;  // Access the user name from URL parameters
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        // Proper SQL query to find a player by name
        const result = await connection.execute(
            `SELECT * FROM Users
            WHERE UserName = :name
            FETCH NEXT 1 ROWS ONLY`,
            { name: userName },  // Binding the 'username' parameter with '%' wildcards
            { outFormat: oracledb.OUT_FORMAT_OBJECT }  // Output as object for easier handling
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);  // Send player data back to client, assuming only one match is expected
        } else {
            res.status(403).send('User not found');  // Appropriate message if no user is found
        }
    } catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error fetching user data");
    } finally {
        if (connection) {
            try {
                await connection.close();  // Properly close the database connection
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }



})


app.get('/api/num-tuples/', async(req, res) => {


    try {
        connection = await oracledb.getConnection(dbConfig);
        //SQL QUERY TO GET ROW COUNT
        const result = await connection.execute(
            `SELECT COUNT(*) AS Count FROM Game`
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('Database query error', err.message);
        res.status(500).send("Error fetching user data");
    } finally {
        if (connection) {
            try {
                await connection.close();  // Properly close the database connection
            } catch (err) {
                console.error('Error closing connection', err);
            }
        }
    }
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
