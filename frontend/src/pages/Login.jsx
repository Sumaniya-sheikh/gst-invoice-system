import { useState } from "react";
import { login } from "../services/authService";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F0E9] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#493B35]">
            GST Invoice System
          </h1>

          <p className="mt-2 text-sm text-[#96745B]">
            Compliance & Anomaly Detection
          </p>
        </div>

        <h2 className="mb-6 text-xl font-semibold text-[#493B35]">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-[#493B35]">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3 outline-none focus:border-[#96745B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#493B35]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3 outline-none focus:border-[#96745B]"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#493B35] py-3 font-semibold text-white transition hover:bg-[#665044] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="mt-6 text-center text-xs text-[#96745B]">
          Secure GST Invoice Compliance System
        </p>

      </div>
    </div>
  );
}

export default Login;