const mysql = require("mysql");

let connenction = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "vacCenter"
});

module.exports = connenction;