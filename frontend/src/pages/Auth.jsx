import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";

const BASE_URL = "https://wanderlog-backend-3nod.onrender.com";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
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
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
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
      <div className="auth-card">

        <div className={`form-wrapper ${isLogin ? "show-login" : "show-register"}`}>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="form login-form">
            <h2 className="form-title">Welcome Back</h2>

            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button className="auth-btn">Login</button>

            <p className="switch-text">
              Don’t have an account?
              <span onClick={() => navigate("/signup")}> Register</span>
            </p>
          </form>

          {/* REGISTER FORM */}
          <form onSubmit={handleSubmit} className="form register-form">
            <h2 className="form-title">Create Account</h2>

            <input
              className="auth-input"
              type="text"
              name="username"
              placeholder="Name"
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <input
              className="auth-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />

            <button className="auth-btn">Register</button>

            <p className="switch-text">
              Already have an account?
              <span onClick={() => navigate("/login")}> Login</span>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}