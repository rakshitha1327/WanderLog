import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    
    if (isLogin) {
      // Login logic
      const fakeUser = { email: formData.email || formData.username || "guest@example.com" };
      localStorage.setItem("token", "dev-token");
      localStorage.setItem("user", JSON.stringify(fakeUser));
      navigate("/dashboard");
    } else {
      // Signup logic
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const fakeUser = { 
        email: formData.email || "guest@example.com",
        name: formData.username || "User"
      };
      localStorage.setItem("token", "dev-token");
      localStorage.setItem("user", JSON.stringify(fakeUser));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[550px] perspective-1000">
        {/* Flip Container */}
        <div
          className={`relative w-full h-full transform-style-3d ${
            isLogin ? "" : "rotate-y-180"
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isLogin ? "rotateY(0deg)" : "rotateY(180deg)",
            transition: "transform 0.7s ease-in-out",
          }}
        >
          {/* LOGIN SIDE */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden border border-[#6c63ff]/40 shadow-[0_0_40px_rgba(108,99,255,0.35)] flex">
              {/* FORM */}
              <div className="w-[45%] bg-black p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-10">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button type="submit" className="btn">
                    Login
                  </button>
                </form>

                <p className="text-gray-400 text-sm mt-8 text-center">
                  Don't have an account?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    navigate("/signup", { replace: true });
                  }}
                  className="link cursor-pointer"
                >
                  Sign Up
                </button>
              </div>

              {/* TEXT */}
              <div className="w-[55%] bg-[var(--primary)] flex items-center justify-center">
                <h1 className="title">WELCOME <br /> BACK!</h1>
              </div>
            </div>
          </div>

          {/* SIGNUP SIDE */}
          <div
            className="absolute inset-0 backface-hidden rotate-y-180"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden border border-[#6c63ff]/40 shadow-[0_0_40px_rgba(108,99,255,0.35)] flex">
              {/* TEXT */}
              <div className="w-[55%] bg-[var(--primary)] flex items-center justify-center">
                <h1 className="title">JOIN <br /> US!</h1>
              </div>

              {/* FORM */}
              <div className="w-[45%] bg-black p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-10">Register</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    name="username"
                    className="input"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    className="input"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button type="submit" className="btn">
                    Register
                  </button>
                </form>

                <p className="text-gray-400 text-sm mt-6 text-center">
                  Already have an account?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    navigate("/login", { replace: true });
                  }}
                  className="link cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
