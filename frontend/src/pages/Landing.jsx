import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/login"); // always take users to login from landing
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-2xl px-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-4">
          WanderLog
        </h1>

        <p className="text-xl md:text-2xl font-light mb-8">
          Capture your journeys. Share your stories. Relive your memories.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleExploreClick}
            className="px-8 py-6 text-lg rounded-2xl text-white border border-white bg-transparent hover:bg-white/20"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
