import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        property: true,
      },
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function getReviewById(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Review ID is required" });
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({ error: `Review with ID ${id} not found` });
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { userId, propertyId, rating, comment } = req.body;

    if (!userId || !propertyId || !rating) {
      return res
        .status(400)
        .json({ error: "userId, propertyId, and rating are required" });
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        propertyId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        property: true,
      },
    });

    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { rating, comment },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        property: true,
      },
    });

    res.json(updatedReview);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: `Review not found` });
    }
    next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.review.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: `Review not found` });
    }
    next(error);
  }
}
