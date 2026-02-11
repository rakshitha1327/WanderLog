import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

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
        // LOGIN
        const response = await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            username: data.username,
          })
        );

        navigate("/dashboard");

      } else {
        // SIGNUP
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        await api.post("/api/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        const loginResponse = await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const loginData = loginResponse.data;

        localStorage.setItem("token", loginData.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: loginData.email,
            username: loginData.username,
          })
        );

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const glassCardClass =
    "w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex relative";

  const neonGlow = "shadow-[0_0_30px_rgba(6,182,212,0.3)]";

  const inputClass =
    "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 backdrop-blur-sm";

  const btnClass =
    "w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-4xl h-[600px]">
        <div className={`${glassCardClass} ${neonGlow}`}>
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  name="username"
                  className={inputClass}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              )}

              <input
                name="email"
                type="email"
                className={inputClass}
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                name="password"
                type="password"
                className={inputClass}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {!isLogin && (
                <input
                  name="confirmPassword"
                  type="password"
                  className={inputClass}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              )}

              <button type="submit" className={btnClass}>
                {isLogin ? "LOGIN" : "REGISTER"}
              </button>
            </form>

            <div className="mt-6 text-center">
              {isLogin ? (
                <>
                  <span className="text-gray-400 text-sm">
                    New to WanderLog?
                  </span>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      navigate("/signup");
                    }}
                    className="text-cyan-400 ml-2"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-400 text-sm">
                    Already a member?
                  </span>
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      navigate("/login");
                    }}
                    className="text-purple-400 ml-2"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="w-1/2 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 flex items-center justify-center text-white text-4xl font-black">
            WanderLog
          </div>
        </div>
      </div>
    </div>
  );
}
