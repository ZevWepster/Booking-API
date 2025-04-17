import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// getAllProperties
export async function getAllProperties(req, res, next) {
  try {
    const { location, pricePerNight, amenities } = req.query;

    const properties = await prisma.property.findMany({
      where: {
        ...(location && {
          location: { contains: location, lte: "insensitive" },
        }),
        ...(pricePerNight && { pricePerNight: parseFloat(pricePerNight) }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        pricePerNight: true,
        bedroomCount: true,
        bathRoomCount: true,
        maxGuestCount: true,
        hostId: true,
        rating: true,
        amenities: true,
        reviews: true,
      },
    });
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
}

export async function createProperty(req, res, next) {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      host,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathRoomCount ||
      !maxGuestCount
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: title, description, location, pricePerNight, bedroomCount, bathRoomCount, or maxGuestCount",
      });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        host,
      },
    });
    res.status(201).json(property);
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// getPropertyById

export async function getPropertyById(req, res, next) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { amenities: true, reviews: true },
    });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
}

// updateProperty

export async function updateProperty(req, res, next) {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      amenities,
      host,
    } = req.body;

    // Validate amenities
    if (amenities && !Array.isArray(amenities)) {
      return res
        .status(400)
        .json({ error: "Amenities must be an array of IDs" });
    }

    const updatedProperty = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        host,
      },
      include: { amenities: true },
    });
    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error("Error updating property:", err);
    if (err.code === "P2025") {
      res.status(404).json({ error: "Property not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// deleteProperty

export async function deleteProperty(req, res, next) {
  try {
    await prisma.property.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Property deleted" });
  } catch (err) {
    console.error("Error deleting property:", err);
    if (err.code === "P2025") {
      res.status(404).json({ error: "Property not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
