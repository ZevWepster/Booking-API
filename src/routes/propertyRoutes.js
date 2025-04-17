import { Router } from "express";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../services/propertyService.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// public routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// protected routes
router.post("/", authMiddleware, createProperty);
router.put("/:id", authMiddleware, updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);

export default router;
