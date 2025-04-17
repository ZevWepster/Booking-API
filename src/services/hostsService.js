import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllHosts(req, res, next) {
  try {
    const { name } = req.query;

    const hosts = await prisma.host.findMany({
      where: {
        ...(name && { name: { contains: name, lte: "insensitive" } }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
    res.status(200).json(hosts);
  } catch (err) {
    next(err);
  }
}

export async function getHostById(req, res, next) {
  try {
    const host = await prisma.host.findUnique({ where: { id: req.params.id } });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }
    res.status(200).json(host);
  } catch (err) {
    next(err);
  }
}

export async function createHost(req, res, next) {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: username, password, or email",
        });
    }

    const host = await prisma.host.create({
      data: {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
      },
    });
    res.status(201).json(host);
  } catch (err) {
    next(err);
  }
}

export async function updateHost(req, res, next) {
  try {
    const updated = await prisma.host.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating host:", err); // Log the error
    if (err.code === "P2025") {
      res.status(404).json({ error: "Host not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" }); // Handle unexpected errors
    }
  }
}

export async function deleteHost(req, res, next) {
  try {
    await prisma.host.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Host deleted" });
  } catch (err) {
    console.error("Error deleting host:", err); // Log the error
    if (err.code === "P2025") {
      res.status(404).json({ error: "Host not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" }); // Handle unexpected errors
    }
  }
}

export default {
  getAllHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost,
};
