export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
};

export const isValidLatitude = (lat) => {
  const latitude = parseFloat(lat);
  return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
};

export const isValidLongitude = (lon) => {
  const longitude = parseFloat(lon);
  return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
};

export const sortSchoolsByDistance = (schools, userLat, userLon) => {
  return schools
    .map((school) => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};
