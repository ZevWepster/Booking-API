import { Router } from "express";
import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../services/amenityService.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// public routes
router.get("/", getAllAmenities);
router.get("/:id", getAmenityById);

// protected routes
router.post("/", authMiddleware, createAmenity);
router.put("/:id", authMiddleware, updateAmenity);
router.delete("/:id", authMiddleware, deleteAmenity);

export default router;
