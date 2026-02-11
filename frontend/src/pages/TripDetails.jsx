import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import API from "../services/api";

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/trips/${tripId}`);
        setTrip(res.data);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
        setError("Trip not found");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-xl">Loading trip details...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">{error || "Trip not found"}</p>
          <button
            onClick={() => navigate("/explore")}
            className="px-6 py-2 bg-sky-600 rounded-xl text-white"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] py-10 px-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/explore")}
          className="mb-6 text-sky-400 hover:text-sky-300"
        >
          ← Back to Explore
        </button>

        {/* Cover Image */}
        {trip.coverImage && (
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full max-h-[420px] object-cover rounded-3xl mb-10"
          />
        )}

        {/* GRID LAYOUT */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT COLUMN (Details) */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{trip.title}</h1>
              <p className="text-xl text-gray-400">📍 {trip.location}</p>
            </div>

            <div className="flex gap-6">
              {trip.date && (
                <div className="text-gray-300">
                  <span className="text-gray-500">Date:</span> {trip.date}
                </div>
              )}
              {trip.totalBudget && (
                <div className="text-gray-300">
                  <span className="text-gray-500">Budget:</span> ₹{trip.totalBudget}
                </div>
              )}
            </div>

            {trip.description && (
              <p className="text-gray-300 leading-relaxed">{trip.description}</p>
            )}

            {trip.foodExperience && (
              <div>
                <h2 className="text-2xl font-bold mb-4">🍽️ Food Experience</h2>
                <p className="text-gray-300 leading-relaxed">{trip.foodExperience}</p>
              </div>
            )}

            {trip.images && trip.images.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">📸 Trip Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trip.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${trip.title} - Photo ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Map & Places) */}
          <div className="space-y-8">
            {trip.placesVisited && trip.placesVisited.length > 0 && (
              <div className="h-[400px] rounded-3xl overflow-hidden border border-sky-900 sticky top-24">
                <MapView places={trip.placesVisited} />
              </div>
            )}

            {trip.placesVisited && trip.placesVisited.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">📍 Places Visited</h2>
                <div className="flex flex-wrap gap-2">
                  {trip.placesVisited.map((place, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-sky-900 rounded-full text-sm"
                    >
                      {place.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
