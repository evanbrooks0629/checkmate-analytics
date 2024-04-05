const oracledb = require('oracledb');
const dotenv = require('dotenv');

async function run() {
    dotenv.config({
        path: "../.env.local"
    });
    const connection = await oracledb.getConnection({
        user          : "cmcloon",
        password      : process.env.PASSWORD,
        connectString : "oracle.cise.ufl.edu:1521/orcl"
    });

    const result = await connection.execute(`SELECT * FROM Game FETCH NEXT 10 ROWS ONLY`);
    console.log(result.rows);


    await connection.close();   // Always close connections

    
}

run();
