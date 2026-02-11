import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import API from "../services/api";

export default function Reviews() {
  const { place } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(place || "");
  const [reviews, setReviews] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);

  useEffect(() => {
    const fetchPublicTrips = async () => {
      try {
        const res = await API.get("/trips/public", {
          params: search ? { location: search } : {},
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch public trips", err);
        setReviews([]);
      }
    };

    fetchPublicTrips();
  }, [search]);

  // 🔥 Marker → Card highlight + scroll
  const handleMarkerClick = (tripId) => {
    setSelectedTripId(tripId);
    document.getElementById(`trip-${tripId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white">
      <div className="container mx-auto px-6 pt-28 pb-10">
        <h1 className="text-4xl font-extrabold text-sky-400 text-center mb-6">
          Reviews for {search || "Places"} 🌍
        </h1>

        <div className="flex justify-center mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search another place..."
            className="w-full max-w-xl px-6 py-3 rounded-2xl bg-[#020617]
                       border border-sky-900 text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT – CARDS */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-400">No public trips found.</p>
            ) : (
              reviews.map((trip) => (
                <div
                  id={`trip-${trip._id}`}
                  key={trip._id}
                  className={`cursor-pointer border rounded-2xl overflow-hidden transition-all flex
                    ${
                      selectedTripId === trip._id
                        ? "border-sky-400 shadow-2xl scale-[1.03]"
                        : "border-sky-900 hover:shadow-xl"
                    }`}
                  onClick={() => {
                    // 🔥 Card → Map zoom
                    setSelectedTripId(trip._id);
                    navigate(`/trip/${trip._id}`);
                  }}
                >
                  <div className="flex-1 p-5">
                    <h3 className="text-xl font-bold">{trip.title}</h3>
                    <p className="text-gray-400">📍 {trip.location}</p>
                    <p className="text-gray-300 text-sm mt-3 line-clamp-3">
                      {trip.description}
                    </p>
                  </div>

                  <div className="w-40 bg-black">
                    {trip.images?.[0] ? (
                      <img
                        src={trip.images[0]}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT – MAP */}
          <div className="h-[500px] rounded-2xl overflow-hidden border border-sky-900">
            <MapView
              trips={reviews}
              selectedTripId={selectedTripId}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
