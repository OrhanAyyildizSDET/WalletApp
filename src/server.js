//const express = require("express");  old way still works
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ratelimiter from "./middleware/rateLimiter.js";
import router from "./routes/transactionRoutes.js";
import { initDatabase, checkDatabaseConnection } from "./services/databaseService.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();

app.use(cors()); // Enable CORS for all routes

if(process.env.NODE_ENV === "production") {    //if we are in production environment, start the cron job
    job.start();
    app.use(ratelimiter);
};
// Middleware run between request and response (authentication check etc...)
// Only enable rate limiter in production to avoid Upstash issues locally
if (process.env.NODE_ENV === "production") {
    
}
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World Change");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use("/api/transactions", router);

// Database initialization and server startup
const startServer = async () => {
    try {
        // Check database connection first
        await checkDatabaseConnection();
        
        // Initialize database tables
        await initDatabase();
        
        console.log("✅ Database initialized successfully");
        
        // Start the server
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running on port ${process.env.PORT}`);
            console.log(`📊 API available at http://localhost:${process.env.PORT}`);
        });
        
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();








