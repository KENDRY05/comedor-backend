import mysql from "mysql2";

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comedor_db"
});

connection.connect((err) => {
  if (err) {
    console.error("Error conectando:", err);
    return;
  }
  console.log("Conectado a MySQL");
});