/**
 * Geocode a location string to coordinates using OpenStreetMap Nominatim
 * @param {string} location - Location string to geocode
 * @returns {Promise<[number, number]|null>} - [lat, lng] or null if not found
 */
export const geocodeLocation = async (location) => {
  if (!location || !location.trim()) return null;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location
      )}&format=json&limit=1`
    );

    const data = await res.json();

    if (!data.length) {
      return null;
    }

    return [
      parseFloat(data[0].lat),
      parseFloat(data[0].lon),
    ];
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
};
