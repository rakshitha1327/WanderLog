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
        // ✅ LOGIN
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
        // ✅ REGISTER
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
  <div style={{ color: "white", padding: "40px" }}>
    <h1>{isLogin ? "Login Page" : "Signup Page"}</h1>
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
      )}
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {!isLogin && (
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      )}
      <button type="submit">
        {isLogin ? "Login" : "Register"}
      </button>
    </form>
  </div>
);
}
