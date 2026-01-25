import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import Discover from "./pages/Discover";
import AddTrip from "./pages/AddTrip";
import Reviews from "./pages/Reviews.jsx";
import TripDetails from "./pages/TripDetails";
import "./styles/theme.css";
import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* 🔥 shared navbar */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Protected pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/add-trip" element={<AddTrip />} />
        <Route path="/reviews/:place" element={<Reviews />} /> 
        <Route path="/trip/:tripId" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
