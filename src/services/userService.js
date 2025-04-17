import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAllUsers(req, res, next) {
  try {
    const { username, email } = req.query;

    const users = await prisma.user.findMany({
      where: {
        ...(username && { username }),
        ...(email && { email }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    // const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        profilePicture: true,
        username: true,
        name: true,
        phoneNumber: true,
        email: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { username, email, password, name, phoneNumber, profilePicture } =
      req.body;

    // Validate required fields
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        error: "Missing required fields: username, email, password, or name",
      });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        name,
        phoneNumber,
        profilePicture,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { username, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    res.status(200).json(user);
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "User not found" });
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "User not found" });
    next(err);
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
