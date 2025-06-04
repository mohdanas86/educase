import pool from "../config/database.js";

class School {
  static async create(schoolData) {
    try {
      const { name, address, latitude, longitude } = schoolData;

      const query = `
        INSERT INTO schools (name, address, latitude, longitude) 
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [
        name,
        address,
        latitude,
        longitude,
      ]);

      return {
        success: true,
        schoolId: result.insertId,
        message: "School created successfully",
      };
    } catch (error) {
      console.error("Error creating school:", error);
      throw new Error("Failed to create school");
    }
  }

  static async getAll() {
    try {
      const query = `
        SELECT id, name, address, latitude, longitude, created_at 
        FROM schools 
        ORDER BY created_at DESC
      `;

      const [schools] = await pool.execute(query);

      return {
        success: true,
        schools: schools,
        count: schools.length,
      };
    } catch (error) {
      console.error("Error fetching schools:", error);
      throw new Error("Failed to fetch schools");
    }
  }

  static async checkDuplicate(name, latitude, longitude) {
    try {
      const query = `
        SELECT id FROM schools 
        WHERE name = ? AND latitude = ? AND longitude = ?
      `;

      const [schools] = await pool.execute(query, [name, latitude, longitude]);

      return schools.length > 0;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  }
}

export default School;
