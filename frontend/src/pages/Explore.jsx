import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import API from "../services/api";
import { getUserEmail } from "../utils/auth";
import { geocodeLocation } from "../utils/geocode";

export default function Explore() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [destinationMarkers, setDestinationMarkers] = useState([]);

  const userEmail = getUserEmail(user);

  useEffect(() => {
    if (!userEmail) return;

    // Fetch all user trips for the list and map
    API.get("/trips", { params: { userEmail } })
      .then((res) => {
        const allTrips = res.data;
        setTrips(allTrips);

        // Geocode destinations for map (ALL trips)
        const geocodePromises = allTrips.map(async (trip) => {
          if (!trip.location) return null;
          const coords = await geocodeLocation(trip.location);
          if (coords) {
            return {
              name: trip.location,
              coordinates: coords,
              tripId: trip.id || trip._id,
              tripTitle: trip.title,
            };
          }
          return null;
        });

        Promise.all(geocodePromises).then((markers) => {
          setDestinationMarkers(markers.filter((m) => m !== null));
        });
      })
      .catch(console.error);
  }, [user, userEmail]);

  const handleMarkerClick = (tripId) => {
    setSelectedTripId(tripId);
    document.getElementById(`trip-${tripId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] px-6 pt-28 text-white">
      <h1 className="text-4xl text-sky-400 font-bold text-center mb-8">
        My Travel Memory Wall 🌍
      </h1>

      {/* MAP - Only public trips with destinations */}
      <div className="h-[420px] mb-12 rounded-3xl overflow-hidden border border-sky-900">
        <MapView places={destinationMarkers} onMarkerClick={handleMarkerClick} />
      </div>

      {/* TRIPS - All user trips */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => {
          const cover = trip.coverImage || trip.images?.[0];
          const tripId = trip.id || trip._id;

          return (
            <div
              key={tripId}
              id={`trip-${tripId}`}
              onClick={() => navigate(`/trip/${tripId}`)}
              className={`cursor-pointer rounded-2xl overflow-hidden transition
                ${selectedTripId === tripId
                  ? "border-2 border-sky-400 scale-[1.03]"
                  : "border border-sky-900 hover:scale-[1.02]"
                }`}
            >
              {cover ? (
                <img src={cover} className="h-48 w-full object-cover" alt={trip.title} />
              ) : (
                <div className="h-48 bg-black/40 flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="text-xl font-bold">{trip.title}</h3>
                <p className="text-gray-400">📍 {trip.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {trip.isPublic ? "🌐 Public" : "🔒 Private"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
