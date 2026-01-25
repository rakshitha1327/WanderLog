import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Discover() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    // 🔥 THIS IS THE KEY LINE
    navigate(`/reviews/${search}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617] text-white">
      <div className="container mx-auto px-6 pt-28 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-400 mb-4">
          Discover 🌍
        </h1>

        <p className="text-gray-400 mb-8">
          Search a place to explore public travel experiences
        </p>

        {/* SEARCH FORM */}
        <form
          onSubmit={handleSearch}
          className="flex justify-center gap-4"
        >
          <input
            type="text"
            placeholder="Search places (Goa, Bali, Japan...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl px-6 py-3 rounded-2xl bg-[#020617]
                       border border-sky-900 text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600
                       text-white font-semibold transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
