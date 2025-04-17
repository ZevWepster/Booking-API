import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllAmenities(req, res, next) {
  try {
    const amenities = await prisma.amenity.findMany();
    res.json(amenities);
  } catch (error) {
    next(error);
  }
}

export async function getAmenityById(req, res, next) {
  try {
    const { id } = req.params;
    const amenity = await prisma.amenity.findUnique({
      where: { id },
    });

    if (!amenity) {
      return res.status(404).json({ error: `Amenity with ID ${id} not found` });
    }

    res.json(amenity);
  } catch (error) {
    next(error);
  }
}

export async function createAmenity(req, res, next) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newAmenity = await prisma.amenity.create({
      data: { name },
    });

    res.status(201).json(newAmenity);
  } catch (error) {
    next(error);
  }
}

export async function updateAmenity(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedAmenity = await prisma.amenity.update({
      where: { id },
      data: { name },
    });

    res.json(updatedAmenity);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: `Amenity not found` });
    }
    next(error);
  }
}

export async function deleteAmenity(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.amenity.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: `Amenity not found` });
    }
    next(error);
  }
}
