import mysql from "mysql2";

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comedor_db"
});
export const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});
connection.connect((err) => {
  if (err) {
    console.error("Error conectando:", err);
    return;
  }
  console.log("Conectado a MySQL");
});
