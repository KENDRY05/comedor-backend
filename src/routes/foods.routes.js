import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood
} from "../controllers/foods.controller.js";

const router = Router();

router.get("/", getFoods);
router.post("/", verifyToken, isAdmin, createFood);
router.put("/:id", verifyToken, isAdmin, updateFood);
router.delete("/:id", verifyToken, isAdmin, deleteFood);

export default router;