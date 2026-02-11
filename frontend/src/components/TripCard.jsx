import { useNavigate } from "react-router-dom";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}`)}
      className="cursor-pointer bg-[#020617] border border-sky-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition"
    >
      {/* COVER IMAGE */}
      <img
        src={trip.coverImage}
        alt={trip.title}
        className="h-48 w-full object-cover"
      />

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h2 className="text-xl text-white font-semibold">
          {trip.title}
        </h2>

        <p className="text-sky-400 text-sm">
          📍 {trip.location}
        </p>

        <p className="text-gray-400 text-sm line-clamp-2">
          {trip.description}
        </p>

        {/* IMAGE COUNT */}
        {trip.images?.length > 0 && (
          <p className="text-xs text-gray-500">
            🖼️ {trip.images.length} photos
          </p>
        )}
      </div>
    </div>
  );
}
