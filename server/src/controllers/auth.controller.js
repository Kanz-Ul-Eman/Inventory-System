const authService = require("../services/auth.service");
const cookieOptions = require("../config/cookie");
const ApiResponse = require("../utils/ApiResponse");
const STATUS = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.login(email, password);

    res.cookie("token", token, cookieOptions);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.LOGIN_SUCCESS, {
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    return ApiResponse.success(res, STATUS.OK, MESSAGES.LOGOUT_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/getUser
 */
const getUser = async (req, res, next) => {
  try {
    const user = await authService.getUser(req.user.id);

    return ApiResponse.success(res, STATUS.OK, MESSAGES.USER_FETCHED, {
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getUser,
};
