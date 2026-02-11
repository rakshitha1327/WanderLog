import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const data = await registerUser(username, email, password);
      
      console.log("Signup response:", data);
      
      // ✅ SAVE USER DATA
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      alert("Registration successful 🎉");

      // ✅ REDIRECT TO DASHBOARD
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Registration failed");
    }
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[#6c63ff]/40 shadow-[0_0_40px_rgba(108,99,255,0.35)] flex">

      {/* TEXT */}
      <div className="w-[55%] bg-[var(--primary)] flex items-center justify-center">
        <h1 className="title">
          JOIN <br /> US!
        </h1>
      </div>

      {/* FORM */}
      <div className="w-[45%] bg-black p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-white mb-10">Register</h2>

        <div className="space-y-5">
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="btn" onClick={handleSignup}>
            Register
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?
        </p>

        <button onClick={() => navigate("/login")} className="link">
          Sign In
        </button>
      </div>
    </div>
  );
}
