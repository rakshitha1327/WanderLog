import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { getUserEmail } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [trips, setTrips] = useState([]);

  const userEmail = getUserEmail(user);

  useEffect(() => {
    if (!userEmail) return;

    API.get("/trips", { params: { userEmail } })
      .then((res) => setTrips(res.data))
      .catch((err) => console.error("Failed to load dashboard", err));
  }, [user]);

  /* ---------- ANALYTICS ---------- */
  const totalTrips = trips.length;

  // Calculate unique countries and total places visited
  const uniqueCountries = new Set();
  let totalPlacesVisited = 0;

  trips.forEach((trip) => {
    if (trip.location) {
      // Assuming location format "City, Country" or just "Country"
      // We'll take the last part after a comma as the country
      const parts = trip.location.split(",");
      const country = parts[parts.length - 1].trim();
      if (country) uniqueCountries.add(country);
    }

    if (trip.placesVisited) {
      totalPlacesVisited += trip.placesVisited.length;
    }
  });

  const totalCountries = uniqueCountries.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white animate-fadeIn">
      <div className="container mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-700 shadow-xl">
          <h1 className="text-4xl font-bold">
            Welcome back, {user.name || "Traveler"} 🌍
          </h1>
          <p className="text-lg mt-2 text-sky-100">
            Your travel dashboard at a glance ✨
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="stat-card" title="Total number of trips you have added">
            <p className="text-gray-400 text-sm">Total Trips</p>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{totalTrips}</h2>
              <span className="text-4xl">🧭</span>
            </div>
          </div>

          <div
            className="stat-card delay-150"
            title="Unique countries you have visited"
          >
            <p className="text-gray-400 text-sm">Countries Visited</p>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{totalCountries}</h2>
              <span className="text-4xl">🌍</span>
            </div>
          </div>

          <div
            className="stat-card delay-300"
            title="Total places you have traveled to"
          >
            <p className="text-gray-400 text-sm">Places Visited</p>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{totalPlacesVisited}</h2>
              <span className="text-4xl">🗺️</span>
            </div>
          </div>
        </div>

        {/* Add Trip */}
        <button
          onClick={() => navigate("/add-trip")}
          className="mb-12 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          ➕ Add New Trip
        </button>

        {/* Trips */}
        <h2 className="text-3xl font-bold mb-6">Your Trips</h2>

        {trips.length === 0 ? (
          <p className="text-gray-400">No trips yet. Start exploring ✈️</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => {
              const cover = trip.coverImage || trip.images?.[0];
              const tripId = trip.id || trip._id;

              return (
                <div
                  key={tripId}
                  onClick={() => navigate(`/trip/${tripId}`)}
                  className="cursor-pointer bg-[#020617] rounded-2xl shadow-lg overflow-hidden border border-sky-900 hover:-translate-y-1 hover:shadow-2xl transition-all"
                >
                  {cover ? (
                    <img
                      src={cover}
                      className="w-full h-52 object-contain bg-black"
                      alt={trip.title}
                    />
                  ) : (
                    <div className="w-full h-52 bg-black flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-bold">{trip.title}</h3>
                    <p className="text-gray-400">📍 {trip.location}</p>
                    <p className="text-sm text-gray-500">🗓️ {trip.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
