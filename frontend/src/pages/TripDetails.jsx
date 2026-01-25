import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import API from "../services/api";

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    API.get(`/trips/${tripId}`)
      .then((res) => setTrip(res.data))
      .catch(() => setTrip(null));
  }, [tripId]);

  if (!trip) {
    return <p className="text-center mt-40 text-gray-400">Trip not found ❌</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] px-6 pt-28 text-white">
      <button onClick={() => navigate(-1)} className="text-sky-400 mb-6">← Back</button>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl text-sky-400 font-bold">{trip.title}</h1>
          <p className="text-gray-400 mb-6">📍 {trip.location} • 🗓️ {trip.date}</p>

          <p className="mb-6">{trip.description}</p>

          <p className="mb-4">💰 ₹ {trip.totalBudget}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {trip.placesVisited.map((p, i) => (
              <span key={i} className="px-3 py-1 bg-sky-900/40 rounded-full">📍 {p}</span>
            ))}
          </div>

          <p className="mb-6">🍽️ {trip.foodExperience}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trip.images.map((img, i) => (
              <img key={i} src={img} className="h-40 rounded-xl object-cover" />
            ))}
          </div>
        </div>

        <div className="h-[600px] rounded-3xl overflow-hidden border border-sky-900">
          <MapView place={trip.location} places={trip.placesVisited} />
        </div>
      </div>
    </div>
  );
}
