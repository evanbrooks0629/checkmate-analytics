const express = require('express');
const oracledb = require('oracledb');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({
    path: "../.env.local"
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


// GET endpoint to fetch games
app.get('/api/games', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user          : "cmcloon",
            password      : process.env.PASSWORD,
            connectString : "oracle.cise.ufl.edu:1521/orcl"
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
            `SELECT * FROM Player WHERE RealName = :name OR PlayerName = :name FETCH NEXT 1 ROWS ONLY`, 
            [playerName, playerName],  // Use parameter binding to secure the query
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
            `SELECT * FROM Player FETCH NEXT 50 ROWS ONLY`  // Fetch first 50 rows from Player table
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



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
