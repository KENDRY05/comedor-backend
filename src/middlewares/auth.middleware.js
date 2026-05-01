import jwt from "jsonwebtoken";

const SECRET = "secreto123";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔴 VALIDACIÓN IMPORTANTE
  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // 🔴 VALIDAR formato "Bearer token"
  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token mal formado" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const isAdmin = (req, res, next) => {
  // 🔴 VALIDAR que exista user
  if (!req.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Solo admin" });
  }

  next();
};