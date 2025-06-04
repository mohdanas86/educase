import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import schoolRoutes from "./routes/schoolRoutes.js";
import { testConnection } from "./config/database.js";

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Add basic error handling middleware for JSON parsing
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next();
});

// Mount school routes at root path
app.use("/", schoolRoutes);

// Default route for API information
app.get("/", (req, res) => {
  res.json({
    message: "School Management API",
    endpoints: {
      "POST /addSchool": "Add a new school",
      "GET /listSchools":
        "List schools by proximity (requires latitude & longitude query params)",
    },
  });
});

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start server and test database connection
const startServer = async () => {
  try {
    // Test database connection before starting server
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error(
        "❌ Failed to connect to database. Please check your .env configuration."
      );
      process.exit(1);
    }

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`✅ Database connected successfully`);
      console.log(`📝 API Endpoints:`);
      console.log(`   POST http://localhost:${PORT}/addSchool`);
      console.log(
        `   GET  http://localhost:${PORT}/listSchools?latitude=28.6139&longitude=77.2090`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
