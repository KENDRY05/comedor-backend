import { connection } from "../db/connection.js";

// Obtener comidas
export const getFoods = (req, res) => {
  connection.query("SELECT * FROM foods", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Crear comida (ADMIN)
export const createFood = (req, res) => {
  const { nombre, precio, cantidad_disponible } = req.body;

  const query = `
    INSERT INTO foods (nombre, precio, cantidad_disponible)
    VALUES (?, ?, ?)
  `;

  connection.query(
    query,
    [nombre, precio, cantidad_disponible],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Comida creada" });
    }
  );
};

// ✏️ EDITAR comida
export const updateFood = (req, res) => {
  const { id } = req.params;
  const { nombre, precio, cantidad_disponible } = req.body;

  const query = `
    UPDATE foods
    SET nombre = ?, precio = ?, cantidad_disponible = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [nombre, precio, cantidad_disponible, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Comida actualizada ✅" });
    }
  );
};

// ❌ ELIMINAR comida
export const deleteFood = (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM foods WHERE id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Comida eliminada 🗑️" });
    }
  );
};