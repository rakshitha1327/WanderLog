import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import API from "../services/api";

export default function Explore() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/trips", {
          params: { userEmail: user?.email },
        });
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrips();
  }, []);

  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    await API.delete(`/trips/${id}`);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] px-6 pt-28 text-white">
      <h1 className="text-4xl text-sky-400 font-bold text-center mb-6">
        My Travel Memory Wall 🌍
      </h1>

      {trips.length > 0 && (
        <div className="h-[420px] mb-10 rounded-3xl overflow-hidden border border-sky-900">
          <MapView trips={trips} />
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div key={trip.id} className="border border-sky-900 rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => navigate(`/trip/${trip.id}`)}>
            {trip.coverImage && <img src={trip.coverImage} className="h-48 w-full object-cover" />}
            <div className="p-4">
              <h3 className="text-xl font-bold">{trip.title}</h3>
              <p>📍 {trip.location}</p>
              <div className="flex justify-between mt-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => navigate(`/add-trip?edit=${trip.id}`)}>✏️ Edit</button>
                <button onClick={() => deleteTrip(trip.id)} className="text-red-400">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
