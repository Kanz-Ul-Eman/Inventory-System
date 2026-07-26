const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const app = express();

/* -------------------------
   Global Middleware
------------------------- */

// Parse JSON body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// CORS
app.use(
    cors({
        origin: "http://localhost:5173", // React frontend
        credentials: true,
    })
);

/* -------------------------
   Routes
------------------------- */

app.use("/api/auth", authRoutes);

/* -------------------------
   Health Check
------------------------- */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Inventory Management API is running...",
    });
});

/* -------------------------
   404 Handler
------------------------- */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

/* -------------------------
   Global Error Handler
------------------------- */
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error.",
    });
});

module.exports = app;