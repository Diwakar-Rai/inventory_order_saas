const AppError = require("../utils/AppError");
const User = require("../models/User");
const { verifyToken } = require("../utils/token");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      throw new AppError(
        "Authentication required",
        401,
        "AUTHENTICATION_REQUIRED",
      );
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("User account not found", 401, "USER_NOT_FOUND");
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("User account is inactive", 403, "USER_INACTIVE");
    }

    req.user = user;

    req.auth = {
      userId: user._id.toString(),
      organizationId: user.organization.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(
        new AppError("Invalid authentication token", 401, "INVALID_TOKEN"),
      );
    }

    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Authentication token expired", 401, "TOKEN_EXPIRED"),
      );
    }

    next(error);
  }
};

module.exports = authenticate;
