// Helper function to validate latitude values
// Latitude must be between -90 and 90 degrees
export const isValidLatitude = (lat) => {
  const value = parseFloat(lat);
  return !isNaN(value) && value >= -90 && value <= 90;
};

// Helper function to validate longitude values
// Longitude must be between -180 and 180 degrees
export const isValidLongitude = (lon) => {
  const value = parseFloat(lon);
  return !isNaN(value) && value >= -180 && value <= 180;
};

// Function to sort schools by distance using Haversine formula
// This calculates the shortest distance between two points on Earth's surface
export const sortSchoolsByDistance = (schools, userLat, userLon) => {
  // Helper function to convert degrees to radians
  const toRad = (value) => (value * Math.PI) / 180;

  // Map through each school and calculate distance
  return (
    schools
      .map((school) => {
        // User's coordinates
        const lat1 = userLat;
        const lon1 = userLon;

        // School's coordinates
        const lat2 = school.latitude;
        const lon2 = school.longitude;

        // Haversine formula implementation
        // R is Earth's radius in kilometers
        const R = 6371;

        // Calculate differences in coordinates (in radians)
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        // Haversine formula calculation
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        // Complete the calculation
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Final distance in kilometers
        const distance = R * c;

        // Return school object with calculated distance
        return { ...school, distance: parseFloat(distance.toFixed(2)) };
      })
      // Sort schools by distance (closest first)
      .sort((a, b) => a.distance - b.distance)
  );
};
