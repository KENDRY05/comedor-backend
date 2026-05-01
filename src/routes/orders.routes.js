import { Router } from "express";
import { createOrder, getOrdersWithDetails } from "../controllers/orders.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrdersWithDetails);
router.get("/details", verifyToken, getOrdersWithDetails);

export default router;