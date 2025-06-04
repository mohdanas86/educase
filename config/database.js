import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a connection pool for better performance and connection management
// A pool maintains multiple database connections that can be reused
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Database server address
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  port: 3306, // MySQL default port
  ssl: { rejectUnauthorized: false }, // SSL configuration for security
  waitForConnections: true, // Wait for available connection
  connectionLimit: 5, // Maximum number of connections in pool
  queueLimit: 0, // No limit on queued connection requests
});

// Function to test database connectivity
export const testConnection = async () => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    console.log("✅ Database connection successful");

    // Test the connection with a simple query
    await connection.execute("SELECT 1");

    // Release the connection back to the pool
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Please check your .env file configuration:");
    console.error("- DB_HOST:", process.env.DB_HOST);
    console.error("- DB_USER:", process.env.DB_USER);
    console.error("- DB_NAME:", process.env.DB_NAME);
    console.error(
      "- DB_PASSWORD:",
      process.env.DB_PASSWORD ? "***SET***" : "NOT SET"
    );
    return false;
  }
};

// Export the connection pool as default export
export default pool;
