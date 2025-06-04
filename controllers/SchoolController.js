import School from "../models/School.js";
import {
  isValidLatitude,
  isValidLongitude,
  sortSchoolsByDistance,
} from "../utils/helpers.js";

class SchoolController {
  static async addSchool(req, res) {
    try {
      const { name, address, latitude, longitude } = req.body;

      if (
        !name ||
        !address ||
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({ message: "All fields required" });
      }

      if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      const isDuplicate = await School.checkDuplicate(name.trim(), lat, lon);
      if (isDuplicate) {
        return res.status(409).json({ message: "School already exists" });
      }

      const result = await School.create({
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lon,
      });

      return res.status(201).json({
        message: "School added successfully",
        schoolId: result.schoolId,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async listSchools(req, res) {
    try {
      const { latitude, longitude } = req.query;

      if (
        !latitude ||
        !longitude ||
        !isValidLatitude(latitude) ||
        !isValidLongitude(longitude)
      ) {
        return res
          .status(400)
          .json({ message: "Valid latitude and longitude required" });
      }

      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);
      const schoolsResult = await School.getAll();

      if (!schoolsResult.success || schoolsResult.count === 0) {
        return res.json({ schools: [], count: 0 });
      }

      const sortedSchools = sortSchoolsByDistance(
        schoolsResult.schools,
        userLat,
        userLon
      );

      return res.json({
        schools: sortedSchools,
        count: sortedSchools.length,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}

export default SchoolController;
