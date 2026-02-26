import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";

// ✅ Deployment-safe base URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://wanderlog-backend-3nod.onrender.com";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e, mode) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Login failed");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            username: data.username,
            name: data.username,
          })
        );

        navigate("/dashboard");
      } else {
        // Register mode
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Registration failed");
          return;
        }

        alert("Registration successful! Please login.");
        setIsLogin(true);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Server connection failed.");
    }
  };

  return (
    <div className="auth-bg">
      <div className={`auth-card ${!isLogin ? "register-mode" : ""}`}>

        {/* LOGIN FORM */}
        <div className="form-container login-container">
          <div className="form-content">
            <h2 className="form-title">Login</h2>
            <form onSubmit={(e) => handleSubmit(e, "login")} className="form-box">
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <button className="btn mt-4">Login</button>
            </form>
            <p className="text-gray-400 text-sm mt-8 text-center">
              Don’t have an account?
            </p>
            <button onClick={() => navigate("/signup")} className="link mx-auto block">
              Sign Up
            </button>
          </div>
        </div>

        {/* REGISTER FORM */}
        <div className="form-container register-container">
          <div className="form-content">
            <h2 className="form-title">Register</h2>
            <form onSubmit={(e) => handleSubmit(e, "register")} className="form-box">
              <input
                className="input"
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={formData.username}
                required
              />
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <input
                className="input"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
              />
              <button className="btn mt-4">Register</button>
            </form>
            <p className="text-gray-400 text-sm mt-6 text-center">
              Already have an account?
            </p>
            <button onClick={() => navigate("/login")} className="link mx-auto block">
              Sign In
            </button>
          </div>
        </div>

        {/* ANIMATED OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">JOIN <br /> US!</h1>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="title">WELCOME <br /> BACK!</h1>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}