import { Router } from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../services/bookingService.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// public routes
router.get("/", getAllBookings);
router.get("/:id", getBookingById);

// protected routes
router.post("/", authMiddleware, createBooking);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);

export default router;
