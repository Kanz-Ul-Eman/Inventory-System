const prisma = require("../config/prisma");
const { verifyToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (!user.active) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated.",
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });

    }
};

module.exports = authenticate;