// Import database connection pool from config
import db from "../config/database.js";

const School = {
  // Method to create a new school in the database
  async create(school) {
    try {
      // SQL query to insert new school data
      const sql = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
      const values = [
        school.name,
        school.address,
        school.latitude,
        school.longitude,
      ];

      // Execute the query using async/await with the connection pool
      const [result] = await db.execute(sql, values);
      return { schoolId: result.insertId };
    } catch (error) {
      console.error("Error creating school:", error);
      throw error;
    }
  },

  // Method to get all schools from the database
  async getAll() {
    try {
      // SQL query to fetch all schools
      const [results] = await db.execute("SELECT * FROM schools");
      return { success: true, schools: results, count: results.length };
    } catch (error) {
      console.error("Error fetching schools:", error);
      return { success: false };
    }
  },

  // Method to check if a school with same name and coordinates already exists
  async checkDuplicate(name, latitude, longitude) {
    try {
      const sql = `SELECT * FROM schools WHERE name = ? AND latitude = ? AND longitude = ?`;
      const [results] = await db.execute(sql, [name, latitude, longitude]);
      return results.length > 0;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      throw error;
    }
  },
};

export default School;
