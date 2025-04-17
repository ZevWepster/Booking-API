import { Router } from "express";
import {
  getAllHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost,
} from "../services/hostsService.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// public routes
router.get("/", getAllHosts);
router.get("/:id", getHostById);

// protected routes
router.post("/", authMiddleware, createHost);
router.put("/:id", authMiddleware, updateHost);
router.delete("/:id", authMiddleware, deleteHost);

export default router;
