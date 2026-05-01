import { connection } from "../db/connection.js";

// 🛒 Crear pedido
export const createOrder = (req, res) => {
  const { id_usuario, items } = req.body;

  // 🔥 1. VALIDAR STOCK ANTES DE TODO
  const checkStockPromises = items.map((item) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT cantidad_disponible FROM foods WHERE id = ?",
        [item.id_food],
        (err, results) => {
          if (err) return reject(err);

          const stock = results[0]?.cantidad_disponible;

          // 🚨 VALIDACIÓN AQUÍ
          if (item.cantidad > stock) {
            return reject(
              new Error(`Stock insuficiente para el producto ID ${item.id_food}`)
            );
          }

          resolve();
        }
      );
    });
  });

  // 🔥 2. EJECUTAR VALIDACIONES
  Promise.all(checkStockPromises)
    .then(() => {
      // ✅ SI TODO ESTÁ BIEN → CREAR PEDIDO

      const total = items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
      );

      connection.query(
        "INSERT INTO orders (id_usuario, total) VALUES (?, ?)",
        [id_usuario, total],
        (err, result) => {
          if (err) return res.status(500).json(err);

          const orderId = result.insertId;

          const values = items.map(item => [
            orderId,
            item.id_food,
            item.cantidad
          ]);

          connection.query(
            "INSERT INTO order_items (id_order, id_food, cantidad) VALUES ?",
            [values],
            (err2) => {
              if (err2) return res.status(500).json(err2);

              // 🔥 3. DESCONTAR STOCK
              items.forEach((item) => {
                connection.query(
                  "UPDATE foods SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?",
                  [item.cantidad, item.id_food]
                );
              });

              res.json({ message: "Pedido realizado ✅" });
            }
          );
        }
      );
    })
    .catch((error) => {
      // ❌ SI FALLA STOCK
      return res.status(400).json({ error: error.message });
    });
};

// 📊 DETALLE DE PEDIDOS (JOIN + AGRUPACIÓN)
export const getOrdersWithDetails = (req, res) => {
  const userId = req.user.id;
  const rol = req.user.rol;

  let query = `
    SELECT 
      o.id AS order_id,
      o.total,
      o.fecha,
      o.id_usuario,
      f.nombre,
      oi.cantidad
    FROM orders o
    JOIN order_items oi ON o.id = oi.id_order
    JOIN foods f ON oi.id_food = f.id
  `;

  // 🔥 FILTRO
  if (rol !== "admin") {
    query += " WHERE o.id_usuario = ?";
  }

  query += " ORDER BY o.fecha DESC";

  connection.query(
    query,
    rol !== "admin" ? [userId] : [],
    (err, results) => {
      if (err) return res.status(500).json(err);

      const grouped = {};

      results.forEach((row) => {
        if (!grouped[row.order_id]) {
          grouped[row.order_id] = {
            id: row.order_id,
            total: row.total,
            fecha: row.fecha,
            id_usuario: row.id_usuario,
            items: []
          };
        }

        grouped[row.order_id].items.push({
          nombre: row.nombre,
          cantidad: row.cantidad
        });
      });

      res.json(Object.values(grouped));
    }
  );
};