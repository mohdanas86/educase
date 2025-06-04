import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const setupDatabase = async () => {
  let connection;

  try {
    // Connect to MySQL and create database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: 3306,
    });

    console.log("✅ Connected to MySQL server");

    // Create database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log("✅ Database created successfully");

    // Close connection and reconnect to the specific database
    await connection.end();

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
    });

    console.log("✅ Connected to database:", process.env.DB_NAME);

    // Create schools table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
        CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180)
      )
    `;

    await connection.execute(createTableSQL);
    console.log("✅ Schools table created successfully");

    // Create indexes (ignore errors if they already exist)
    try {
      await connection.execute(
        "CREATE INDEX idx_coordinates ON schools(latitude, longitude)"
      );
    } catch (error) {
      if (!error.message.includes("Duplicate key name")) {
        console.warn("Index idx_coordinates might already exist");
      }
    }

    try {
      await connection.execute("CREATE INDEX idx_name ON schools(name)");
    } catch (error) {
      if (!error.message.includes("Duplicate key name")) {
        console.warn("Index idx_name might already exist");
      }
    }
    console.log("✅ Indexes created successfully");

    // Verify table creation
    const [tables] = await connection.execute("SHOW TABLES");
    console.log("✅ Tables in database:", tables);

    const [columns] = await connection.execute("DESCRIBE schools");
    console.log("✅ Schools table structure:");
    columns.forEach((col) => {
      console.log(`   ${col.Field}: ${col.Type}`);
    });

    console.log("\n🎉 Database setup completed successfully!");
    console.log("You can now start your application with: npm start");
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

setupDatabase();
