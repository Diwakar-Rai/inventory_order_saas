const mongoose = require("mongoose");

const Organization = require("../models/Organization");
const User = require("../models/User");

const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");

const AppError = require("../utils/AppError");
const { hashPassword } = require("../utils/password");

const register = async ({ organizationName, name, email, password }) => {
  const normalizedOrganizationName = organizationName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingOrganization = await Organization.findOne({
    name: normalizedOrganizationName,
  });

  if (existingOrganization) {
    throw new AppError(
      "An organization with this name already exists",
      409,
      "ORGANIZATION_ALREADY_EXISTS",
    );
  }

  const passwordHash = await hashPassword(password);

  const session = await mongoose.startSession();

  try {
    let organization;
    let user;

    await session.withTransaction(async () => {
      organization = await Organization.create(
        [
          {
            name: normalizedOrganizationName,
          },
        ],
        { session },
      );

      user = await User.create(
        [
          {
            organization: organization[0]._id,
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: "ADMIN",
          },
        ],
        { session },
      );
    });

    return {
      organization: organization[0],
      user: user[0],
    };
  } finally {
    await session.endSession();
  }
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("User account is inactive", 403, "USER_INACTIVE");
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const token = generateToken({
    userId: user._id.toString(),
    organizationId: user.organization.toString(),
    role: user.role,
  });

  return {
    user,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 401, "USER_NOT_FOUND");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("User account is inactive", 403, "USER_INACTIVE");
  }

  return user;
};
module.exports = {
  register,
  login,
  getCurrentUser,
};
