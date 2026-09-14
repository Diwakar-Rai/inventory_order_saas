const authService = require("../services/auth.service");
const { getAuthCookieOptions } = require("../utils/authCookie");
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: {
        organization: result.organization,
        user: result.user,
      },
      message: "Registration successful",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.cookie("access_token", result.token, getAuthCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.auth.userId);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", getAuthCookieOptions());

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
