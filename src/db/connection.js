import mysql from "mysql2";

export const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: {
    rejectUnauthorized: false
  }
});
connection.connect((err) => {
  if (err) {
    console.error("Error conectando:", err);
    return;
  }
  console.log("Conectado a MySQL");
});
