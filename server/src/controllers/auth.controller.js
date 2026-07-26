const authService = require("../services/auth.service");
const cookieOptions = require("../config/cookie");

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { token, user } = await authService.login(email, password);

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
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

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });

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

        return res.status(200).json({
            success: true,
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