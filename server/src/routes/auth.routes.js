const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const validate = require("../middleware/validate.middleware");

const { loginSchema } = require("../validators/auth.validator");

const authenticate = require("../middleware/auth.middleware");

const loginLimiter = require("../middleware/rateLimiter");

/**
 * Login
 */
router.post(
    "/login",
    loginLimiter,
    validate(loginSchema),
    authController.login
);

/**
 * Logout
 */
router.post(
    "/logout",
    authenticate,
    authController.logout
);

/**
 * Current Logged-in User
 */
router.get(
    "/getUser",
    authenticate,
    authController.getUser
);

module.exports = router;