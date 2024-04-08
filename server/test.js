const express = require('express');
const oracledb = require('oracledb');
const dotenv = require('dotenv');

const cors = require('cors');
dotenv.config();

const app = express();
const port = 1234; // or any port you prefer
app.use(cors());
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // To get output as objects

// GET endpoint to fetch games
app.get('/api/games', async (req, res) => {
    dotenv.config({
        path: "../.env.local"
    });
    let connection;
    try {
        connection = await oracledb.getConnection({
            user          : "cmcloon",
            password      : process.env.PASSWORD,
            connectString : "oracle.cise.ufl.edu:1521/orcl"
        });
        const result = await connection.execute(`SELECT * FROM Game FETCH NEXT 10 ROWS ONLY`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
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

app.get('/api/players', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user          : "cmcloon",
            password      : process.env.PASSWORD,
            connectString : "oracle.cise.ufl.edu:1521/orcl"
        });
        const result = await connection.execute(`SELECT * FROM Game FETCH NEXT 10 ROWS ONLY`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
