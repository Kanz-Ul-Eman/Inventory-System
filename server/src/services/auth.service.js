const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { generateToken } = require("../utils/jwt");

/**
 * Login User
 */
const login = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // User not found
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  // Inactive account
  if (!user.active) {
    throw new AppError("Your account has been deactivated.", 403);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  // Update last login
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  // Generate JWT
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  // Never return password hash
  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Current Logged-in User
 */
const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

module.exports = {
  login,
  getUser,
};
