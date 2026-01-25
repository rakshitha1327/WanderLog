import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function AddTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const user = JSON.parse(localStorage.getItem("user"));

  const [trip, setTrip] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
    totalBudget: "",
    placesVisited: [],
    foodExperience: "",
    coverImage: null,
    images: [],
    isPublic: true,
  });

  const [placeInput, setPlaceInput] = useState("");
  const [loading, setLoading] = useState(!!editId);

  /* ---------- Load Trip for Edit ---------- */
  useEffect(() => {
    if (!editId) return;

    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trips/${editId}`);
        setTrip({
          ...res.data,
          placesVisited: res.data.placesVisited || [],
        });
      } catch (err) {
        alert("Failed to load trip");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [editId, navigate]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[#020617] border-2 border-sky-900 text-white " +
    "placeholder-gray-400 hover:border-sky-600 focus:ring-2 focus:ring-sky-600";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrip((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  /* ---------- Images ---------- */
  const readFile = (file, cb) => {
    const reader = new FileReader();
    reader.onloadend = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) readFile(file, (img) => setTrip((p) => ({ ...p, coverImage: img })));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) =>
      readFile(file, (img) =>
        setTrip((p) => ({ ...p, images: [...p.images, img] }))
      )
    );
  };

  /* ---------- Places ---------- */
  const addPlace = () => {
    if (!placeInput.trim()) return;
    setTrip((p) => ({ ...p, placesVisited: [...p.placesVisited, placeInput.trim()] }));
    setPlaceInput("");
  };

  const removePlace = (i) =>
    setTrip((p) => ({ ...p, placesVisited: p.placesVisited.filter((_, idx) => idx !== i) }));

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = user?.email || user?.userEmail;
    if (!userEmail) return alert("Login required");

    try {
      const payload = { ...trip, userEmail };
      editId
        ? await API.put(`/trips/${editId}`, payload)
        : await API.post("/trips", payload);

      navigate("/explore");
    } catch {
      alert("Failed to save trip");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 text-white flex justify-center">
      <div className="w-full max-w-5xl p-8 border border-sky-900 rounded-3xl">
        <h1 className="text-3xl text-sky-400 mb-8">
          {editId ? "Edit Trip ✏️" : "Add New Trip ✈️"}
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="space-y-5">
            <input name="title" value={trip.title} onChange={handleChange} placeholder="Trip Title" className={inputClass} />
            <input name="location" value={trip.location} onChange={handleChange} placeholder="Location" className={inputClass} />
            <textarea name="description" value={trip.description} onChange={handleChange} rows="4" placeholder="Description" className={inputClass} />
            <input type="date" name="date" value={trip.date} onChange={handleChange} className={inputClass} />
            <input name="totalBudget" value={trip.totalBudget} onChange={handleChange} placeholder="Total Budget ₹" className={inputClass} />

            {/* Places */}
            <div>
              <label className="text-gray-400">Places Visited</label>
              <div className="flex gap-2">
                <input value={placeInput} onChange={(e) => setPlaceInput(e.target.value)} className={inputClass} />
                <button type="button" onClick={addPlace} className="px-4 bg-sky-600 rounded-xl">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {trip.placesVisited.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-sky-900 rounded-full">
                    📍 {p} <button onClick={() => removePlace(i)}>✕</button>
                  </span>
                ))}
              </div>
            </div>

            <textarea name="foodExperience" value={trip.foodExperience} onChange={handleChange} rows="3" placeholder="Food experience" className={inputClass} />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

            <button className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 py-4 rounded-xl font-bold">
              {editId ? "Update Trip" : "Save Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
