// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // Auth check
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return null;
  }

  const [trips, setTrips] = useState([]);

  // Animated counters
  const [animatedTrips, setAnimatedTrips] = useState(0);
  const [animatedCountries, setAnimatedCountries] = useState(0);
  const [animatedPlaces, setAnimatedPlaces] = useState(0);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const userEmail = user?.email || user?.userEmail;
        if (!userEmail) return;

        const res = await API.get("/trips", {
          params: { userEmail },
        });
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      }
    };

    fetchTrips();
  }, [user]);

  // Stats
  const totalTrips = trips.length;
  const placesVisited = trips.length;

  const countriesVisited = new Set(
    trips
      .map((trip) => trip.location.split(",").pop()?.trim())
      .filter(Boolean)
  ).size;

  // Counter animation
  useEffect(() => {
    let t = 0,
      c = 0,
      p = 0;

    const interval = setInterval(() => {
      if (t < totalTrips) setAnimatedTrips(++t);
      if (c < countriesVisited) setAnimatedCountries(++c);
      if (p < placesVisited) setAnimatedPlaces(++p);

      if (t >= totalTrips && c >= countriesVisited && p >= placesVisited) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [totalTrips, countriesVisited, placesVisited]);

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
              <h2 className="text-3xl font-bold">{animatedTrips}</h2>
              <span className="text-4xl">🧭</span>
            </div>
          </div>

          <div
            className="stat-card delay-150"
            title="Unique countries you have visited"
          >
            <p className="text-gray-400 text-sm">Countries Visited</p>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{animatedCountries}</h2>
              <span className="text-4xl">🌍</span>
            </div>
          </div>

          <div
            className="stat-card delay-300"
            title="Total places you have traveled to"
          >
            <p className="text-gray-400 text-sm">Places Visited</p>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">{animatedPlaces}</h2>
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
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-[#020617] rounded-2xl shadow-lg overflow-hidden border border-sky-900 hover:-translate-y-1 hover:shadow-2xl transition-all"
              >
                <img
                  src={trip.images?.[0]}
                  alt={trip.title}
                  className="w-full h-52 object-contain bg-black"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{trip.title}</h3>
                  <p className="text-gray-400">📍 {trip.location}</p>
                  <p className="text-sm text-gray-500">🗓️ {trip.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
