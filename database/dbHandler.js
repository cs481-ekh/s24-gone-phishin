import initSqlJs from 'sql.js';

//Database to be used within other js files
async function connectToDatabase() {
    const SQLJS = await initSqlJs();
    const dao = new SQLJS.Database();

    const response = await fetch('HLS.db');
    const buffer = await response.arrayBuffer();
    //Pulls the database data
    const data = new Uint8Array(buffer);
    dao.open(data);

    return db
}