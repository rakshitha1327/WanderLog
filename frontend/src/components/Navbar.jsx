import { useNavigate, useLocation } from "react-router-dom";

const navItemBase =
  "relative px-2 py-1 transition-colors duration-300 " +
  "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-sky-400 after:transition-all after:duration-300";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null; // hide navbar if not logged in

  const navItem = (path) =>
    `${navItemBase} ${
      location.pathname === path
        ? "text-sky-400 after:w-full"
        : "text-gray-300 hover:text-sky-400 after:w-0 hover:after:w-full"
    }`;

  return (
    <nav className="bg-[#020617]/90 backdrop-blur shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-extrabold text-sky-400 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          WanderLog ✈️
        </h1>

        {/* Nav Items */}
        <div className="flex items-center space-x-6 font-medium">
          <button className={navItem("/dashboard")} onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button className={navItem("/explore")} onClick={() => navigate("/explore")}>
            Explore
          </button>

          <button className={navItem("/discover")} onClick={() => navigate("/discover")}>
            Discover
          </button>

          <button className={navItem("/add-trip")} onClick={() => navigate("/add-trip")}>
            Add Trip
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
