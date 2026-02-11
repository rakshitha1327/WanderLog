import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Discover() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------- FETCH PUBLIC TRIPS WITH SEARCH ---------- */
  useEffect(() => {
    const fetchPublicTrips = async () => {
      try {
        const params = searchQuery.trim() 
          ? { location: searchQuery.trim() } 
          : {};
        const res = await API.get("/trips/public", { params });
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to load public trips", err);
        setTrips([]);
      }
    };

    fetchPublicTrips();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] px-6 pt-28 text-white">
      <h1 className="text-4xl text-emerald-400 font-bold text-center mb-8">
        Discover Trips 🌍
      </h1>

      {/* SEARCH BAR */}
      <div className="max-w-2xl mx-auto mb-12">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by destination (e.g., Paris, Tokyo, New York)..."
          className="w-full px-6 py-4 rounded-2xl bg-[#020617] border border-emerald-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
        />
      </div>

      {/* TRIP CARDS WITH IMAGE GRID */}
      {trips.length === 0 ? (
        <p className="text-center text-gray-400 py-10">
          {searchQuery.trim() 
            ? `No public trips found for "${searchQuery}" 🚀` 
            : "No public trips available yet 🚀"}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => {
            const tripId = trip.id || trip._id;
            const cover = trip.coverImage;
            const images = trip.images || [];

            return (
              <div
                key={tripId}
                onClick={() => navigate(`/trip/${tripId}`)}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all border border-emerald-900 hover:scale-[1.02] hover:border-emerald-400"
              >
                {/* IMAGE GRID */}
                {cover || images.length > 0 ? (
                  <div className="h-64 w-full relative">
                    {cover ? (
                      <img
                        src={cover}
                        alt={trip.title}
                        className="h-full w-full object-cover"
                      />
                    ) : images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1 h-full">
                        {images.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${trip.title} - ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="h-64 bg-black/40 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
                  <p className="text-gray-300 mb-2">📍 {trip.location}</p>
                  {trip.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {trip.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Shared by {trip.userEmail?.split("@")[0] || "User"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
