import { useState } from "react";
import { loginUser } from "../services/authService";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);

      // ✅ SAVE JWT
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      alert("Login successful ✅");

      // 👉 later we will redirect to dashboard
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-[#6c63ff]/40 shadow-[0_0_40px_rgba(108,99,255,0.35)] flex">

      {/* FORM */}
      <div className="w-[45%] bg-black p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-white mb-10">Login</h2>

        <div className="space-y-6">
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

          <button className="btn" onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-8 text-center">
          Don’t have an account?
        </p>

        <button onClick={switchToSignup} className="link">
          Sign Up
        </button>
      </div>

      {/* TEXT */}
      <div className="w-[55%] bg-[var(--primary)] flex items-center justify-center">
        <h1 className="title">
          WELCOME <br /> BACK!
        </h1>
      </div>
    </div>
  );
}
