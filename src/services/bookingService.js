import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllBookings(req, res, next) {
  try {
    const { userId, propertyId, bookingStatus } = req.query;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(userId && { userId }),
        ...(propertyId && { propertyId }),
        ...(bookingStatus && { bookingStatus }),
      },
      select: {
        id: true,
        userId: true,
        propertyId: true,
        checkinDate: true,
        checkoutDate: true,
        numberOfGuests: true,
        totalPrice: true,
        bookingStatus: true,
      },
    });

    const sanitizedBookings = bookings.map((booking) => ({
      ...booking,
      userId: booking.userId || "Unknown", // Replace null with "Unknown"
    }));

    if (!sanitizedBookings || sanitizedBookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    next(err);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        propertyId: true,
        checkinDate: true,
        checkoutDate: true,
        numberOfGuests: true,
        totalPrice: true,
        bookingStatus: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    next(err);
  }
}

export async function createBooking(req, res, next) {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !propertyId ||
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateBooking(req, res, next) {
  try {
    const {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        checkinDate: checkinDate ? new Date(checkinDate) : undefined,
        checkoutDate: checkoutDate ? new Date(checkoutDate) : undefined,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
    });

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error("Error updating booking:", err);
    if (err.code === "P2025") {
      res.status(404).json({ error: "Booking not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export async function deleteBooking(req, res, next) {
  try {
    await prisma.booking.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Booking deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    if (err.code === "P2025") {
      res.status(404).json({ error: "Booking not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
