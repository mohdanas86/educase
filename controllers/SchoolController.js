import School from "../models/School.js";
import {
  isValidLatitude,
  isValidLongitude,
  sortSchoolsByDistance,
} from "../utils/helpers.js";

// Controller class to handle school-related API operations
class SchoolController {
  // Method to handle POST /addSchool requests
  static async addSchool(req, res) {
    try {
      // Extract data from request body
      const { name, address, latitude, longitude } = req.body;

      // Validate that all required fields are present
      if (
        !name ||
        !address ||
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({
          message:
            "All fields are required: name, address, latitude, longitude",
        });
      }

      // Validate coordinate ranges using helper functions
      if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
        return res.status(400).json({
          message:
            "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
        });
      }

      // Convert coordinates to numbers for database storage
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      // Check if school with same name and coordinates already exists
      const isDuplicate = await School.checkDuplicate(name.trim(), lat, lon);
      if (isDuplicate) {
        return res.status(409).json({
          message: "School with this name and location already exists",
        });
      }

      // Create new school in database
      const result = await School.create({
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lon,
      });

      // Return success response with created school ID
      return res.status(201).json({
        message: "School added successfully",
        schoolId: result.schoolId,
      });
    } catch (error) {
      console.error("Error in addSchool:", error);
      return res.status(500).json({
        message: "Internal server error while adding school",
      });
    }
  }

  // Method to handle GET /listSchools requests
  static async listSchools(req, res) {
    try {
      // Extract coordinates from query parameters
      const { latitude, longitude } = req.query;

      // Validate that coordinates are provided and valid
      if (
        !latitude ||
        !longitude ||
        !isValidLatitude(latitude) ||
        !isValidLongitude(longitude)
      ) {
        return res.status(400).json({
          message: "Valid latitude and longitude query parameters are required",
        });
      }

      // Convert query parameters to numbers
      const userLat = parseFloat(latitude);
      const userLon = parseFloat(longitude);

      // Fetch all schools from database
      const schoolsResult = await School.getAll();

      // Handle case where no schools exist or database error
      if (!schoolsResult.success || schoolsResult.count === 0) {
        return res.json({
          schools: [],
          count: 0,
          message: "No schools found",
        });
      }

      // Sort schools by distance from user's location using Haversine formula
      const sortedSchools = sortSchoolsByDistance(
        schoolsResult.schools,
        userLat,
        userLon
      );

      // Return sorted schools with distance information
      return res.json({
        schools: sortedSchools,
        count: sortedSchools.length,
        userLocation: {
          latitude: userLat,
          longitude: userLon,
        },
      });
    } catch (error) {
      console.error("Error in listSchools:", error);
      return res.status(500).json({
        message: "Internal server error while fetching schools",
      });
    }
  }
}

export default SchoolController;
