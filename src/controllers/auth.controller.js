import { connection } from "../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "secreto123";

// REGISTRO
export const register = (req, res) => {
  const { nombre, email, password } = req.body;

  const hashed = bcrypt.hashSync(password, 10);

  connection.query(
    "INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, hashed],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Usuario creado" });
    }
  );
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(400).json({ error: "Usuario no existe" });
      }

      const user = results[0];

      const valid = bcrypt.compareSync(password, user.password);

      if (!valid) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        { id: user.id, rol: user.rol },
        SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token, user });
    }
  );
};