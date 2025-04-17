import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// public routes
router.get("/", getAllReviews);
router.get("/:id", getReviewById);

// protected routes
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
