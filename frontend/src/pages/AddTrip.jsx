import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { getUserEmail, isAuthenticated } from "../utils/auth";

export default function AddTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  const [trip, setTrip] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
    totalBudget: "",
    placesVisited: [],
    foodExperience: "",
    coverImage: "",
    images: [],
    isPublic: false,
  });

  const [placeInput, setPlaceInput] = useState("");

  /* ---------- LOAD TRIP FOR EDIT ---------- */
  useEffect(() => {
    if (!editId) return;

    setLoading(true);
    API.get(`/trips/${editId}`)
      .then((res) => setTrip(res.data))
      .catch(() => alert("Failed to load trip"))
      .finally(() => setLoading(false));
  }, [editId]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[#020617] border border-sky-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-600";

  /* ---------- IMAGE UPLOAD ---------- */
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setTrip((p) => ({ ...p, coverImage: url }));
    } catch (error) {
      console.error("Cover image upload failed:", error);
      alert("Failed to upload cover image");
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    const newImages = [];

    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        newImages.push(url);
      }

      setTrip((p) => ({ ...p, images: [...p.images, ...newImages] }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setTrip((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== index),
    }));
  };

  /* ---------- PLACE → GEO ---------- */
  const addPlace = async () => {
    if (!placeInput.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          placeInput
        )}&format=json&limit=1`
      );

      const data = await res.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      const coordinates = [
        parseFloat(data[0].lat),
        parseFloat(data[0].lon),
      ];

      setTrip((p) => ({
        ...p,
        placesVisited: [
          ...p.placesVisited,
          { name: placeInput, coordinates },
        ],
      }));

      setPlaceInput("");
    } catch (error) {
      console.error("Failed to fetch location:", error);
      alert("Failed to fetch location");
    }
  };

  const removePlace = (index) => {
    setTrip((p) => ({
      ...p,
      placesVisited: p.placesVisited.filter((_, i) => i !== index),
    }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = getUserEmail(user);
    console.log("User email:", userEmail);
    console.log("User object:", user);
    console.log("Trip data:", trip);

    if (!userEmail) {
      alert("Please login again to continue");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...trip, userEmail };
      console.log("Sending payload:", payload);

      if (editId) {
        await API.put(`/trips/${editId}`, payload);
        alert("Trip updated successfully!");
      } else {
        await API.post("/trips", payload);
        alert("Trip created successfully!");
      }

      navigate("/explore");
    } catch (err) {
      console.error("Trip save error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save trip";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-xl">Loading trip details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] py-10 text-white flex justify-center">
      <div className="w-full max-w-5xl border border-sky-900 rounded-3xl p-8">
        <h1 className="text-3xl text-sky-400 mb-8">
          {editId ? "Edit Trip ✏️" : "Add New Trip ✈️"}
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="space-y-4">
            <input
              className={inputClass}
              placeholder="Trip Title"
              value={trip.title}
              onChange={(e) => setTrip({ ...trip, title: e.target.value })}
            />

            <input
              className={inputClass}
              placeholder="Main Location"
              value={trip.location}
              onChange={(e) => setTrip({ ...trip, location: e.target.value })}
            />

            <textarea
              rows="3"
              className={inputClass}
              placeholder="Trip Description"
              value={trip.description}
              onChange={(e) => setTrip({ ...trip, description: e.target.value })}
            />

            <input
              type="date"
              className={inputClass}
              value={trip.date}
              onChange={(e) => setTrip({ ...trip, date: e.target.value })}
            />

            <input
              className={inputClass}
              placeholder="Total Budget ₹"
              value={trip.totalBudget}
              onChange={(e) =>
                setTrip({ ...trip, totalBudget: e.target.value })
              }
            />

            {/* PLACES */}
            <div>
              <label className="text-gray-400">Places Visited</label>
              <div className="flex gap-2 mt-2">
                <input
                  className={inputClass}
                  value={placeInput}
                  onChange={(e) => setPlaceInput(e.target.value)}
                  placeholder="Enter place name"
                />
                <button
                  type="button"
                  onClick={addPlace}
                  className="px-5 bg-sky-600 rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {trip.placesVisited.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-sky-900 rounded-full text-sm"
                  >
                    📍 {p.name}
                    <button
                      type="button"
                      onClick={() => removePlace(i)}
                      className="ml-2 text-red-300"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* COVER IMAGE */}
            <div>
              <label className="text-gray-400 block mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-sky-800 rounded-xl p-4 flex flex-col items-center justify-center bg-[#020617]/50 hover:bg-[#020617] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700"
                />
              </div>
              {trip.coverImage && (
                <img
                  src={trip.coverImage}
                  className="mt-3 h-40 w-full object-cover rounded-xl border border-sky-900"
                />
              )}
            </div>

            {/* TRIP IMAGES */}
            <div>
              <label className="text-gray-400 block mb-2">Trip Photos</label>
              <div className="border-2 border-dashed border-sky-800 rounded-xl p-4 flex flex-col items-center justify-center bg-[#020617]/50 hover:bg-[#020617] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                {trip.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="h-28 w-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/70 px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <textarea
              rows="4"
              className={inputClass}
              placeholder="Food experience"
              value={trip.foodExperience}
              onChange={(e) =>
                setTrip({ ...trip, foodExperience: e.target.value })
              }
            />

            {/* VISIBILITY TOGGLE */}
            <div className="flex items-center gap-4 p-4 bg-[#020617] border border-sky-900 rounded-xl">
              <label className="text-gray-400 cursor-pointer flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={trip.isPublic}
                  onChange={(e) =>
                    setTrip({ ...trip, isPublic: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-sky-600 cursor-pointer"
                />
                <span className="text-white">
                  {trip.isPublic ? "🌐 Public" : "🔒 Private"}
                </span>
              </label>
              <p className="text-xs text-gray-500">
                {trip.isPublic
                  ? "Visible in Discover and Explore"
                  : "Only visible to you"}
              </p>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 py-4 rounded-xl font-bold disabled:opacity-50"
            >
              {loading ? "Saving..." : editId ? "Update Trip" : "Save Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
