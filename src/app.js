import express from "express";
import cors from "cors";
import "./db/connection.js";

import foodsRoutes from "./routes/foods.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/orders", ordersRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req,res) => {
  res.send("API funcionando");
})

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});