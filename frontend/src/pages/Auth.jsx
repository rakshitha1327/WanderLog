import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  // Update state when route changes
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
        // Login - call backend API
        const response = await fetch("http://localhost:8080/api/auth/login", {
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

        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          email: data.email,
          username: data.username,
        }));

        navigate("/dashboard");
      } else {
        // Signup - call backend API
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const response = await fetch("http://localhost:8080/api/auth/register", {
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

        // After registration, auto-login
        const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify({
            email: loginData.email,
            username: loginData.username,
          }));
          navigate("/dashboard");
        } else {
          alert("Registration successful! Please login.");
          setIsLogin(true);
          navigate("/login", { replace: true });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  /* --- FUTURISTIC STYLES --- */
  const glassCardClass =
    "w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex relative"; // Base card

  const neonGlow = "shadow-[0_0_30px_rgba(6,182,212,0.3)]"; // Cyan glow

  const inputClass =
    "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 backdrop-blur-sm";

  const btnClass =
    "w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-4xl h-[600px] perspective-1000">
        {/* Flip Container */}
        <div
          className={`relative w-full h-full transform-style-3d transition-transform duration-700 ease-in-out ${isLogin ? "" : "rotate-y-180"
            }`}
        >
          {/* ================= LOGIN SIDE ================= */}
          <div className="absolute inset-0 backface-hidden">
            <div className={`${glassCardClass} ${neonGlow}`}>

              {/* Left: Form */}
              <div className="w-1/2 p-12 flex flex-col justify-center relative z-10">
                <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 mb-10 text-sm">Enter your credentials to access your travels.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs text-gray-400 ml-1 mb-1 block">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      className={inputClass}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 ml-1 mb-1 block">Password</label>
                    <input
                      name="password"
                      type="password"
                      className={inputClass}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className={btnClass}>
                    LOGIN
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <span className="text-gray-400 text-sm">New to WanderLog? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      navigate("/signup", { replace: true });
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors cursor-pointer ml-1"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="w-1/2 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 flex flex-col items-center justify-center p-10 relative overflow-hidden border-l border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] opacity-40 bg-cover bg-center mix-blend-overlay" />
                <div className="relative z-10 text-center">
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    WanderLog
                  </h1>
                  <p className="text-cyan-100/80 mt-4 text-lg font-light tracking-wide">
                    Your futuristic travel companion.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================= SIGNUP SIDE ================= */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className={`${glassCardClass} shadow-[0_0_30px_rgba(147,51,234,0.3)]`}> {/* Purple glow for signup */}

              {/* Left: Visual */}
              <div className="w-1/2 bg-gradient-to-bl from-purple-900/40 to-pink-900/40 flex flex-col items-center justify-center p-10 relative overflow-hidden border-r border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] opacity-40 bg-cover bg-center mix-blend-overlay" />
                <div className="relative z-10 text-center">
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    Explore
                  </h1>
                  <p className="text-purple-100/80 mt-4 text-lg font-light tracking-wide">
                    Begin your journey today.
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="w-1/2 p-12 flex flex-col justify-center relative z-10">
                <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400 mb-8 text-sm">Join our community of travelers.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      name="username"
                      className={inputClass}
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      name="email"
                      type="email"
                      className={inputClass}
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      name="password"
                      type="password"
                      className={inputClass}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      name="confirmPassword"
                      type="password"
                      className={inputClass}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-300 mt-2">
                    REGISTER
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-gray-400 text-sm">Already a member? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      navigate("/login", { replace: true });
                    }}
                    className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors cursor-pointer ml-1"
                  >
                    Sign In
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
