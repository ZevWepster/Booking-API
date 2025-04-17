import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// public routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// protected routes
router.post("/", authMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
