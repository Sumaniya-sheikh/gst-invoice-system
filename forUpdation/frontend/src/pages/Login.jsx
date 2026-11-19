
import { useState } from "react";
import {
  login,
  forgotPassword,
  resendVerificationByEmail
} from "../services/authService";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const changeMode = (newMode) => {
    setMode(newMode);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        const result = await forgotPassword(email);
        setMessage(result.message);
      } else if (mode === "verify") {
        const result = await resendVerificationByEmail(email);
        setMessage(result.message);
      } else {
        const user = await login(username, password);
        onLogin(user);
      }
    } catch (err) {
      setError(err.message || "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const heading =
    mode === "forgot"
      ? "Forgot Password"
      : mode === "verify"
      ? "Verify Your Email"
      : "Welcome Back";

  const submitLabel =
    mode === "forgot"
      ? "Send Reset Link"
      : mode === "verify"
      ? "Resend Verification Email"
      : "Sign In";

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
          {heading}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {mode === "login" ? (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#493B35]">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
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
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3 outline-none focus:border-[#96745B]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => changeMode("forgot")}
                  className="text-left text-sm font-medium text-[#96745B] hover:underline"
                >
                  Forgot password?
                </button>

                <button
                  type="button"
                  onClick={() => changeMode("verify")}
                  className="text-left text-sm font-medium text-[#96745B] hover:underline"
                >
                  Resend verification email
                </button>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#493B35]">
                Registered email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3 outline-none focus:border-[#96745B]"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#493B35] py-3 font-semibold text-white transition hover:bg-[#665044] disabled:opacity-60"
          >
            {loading ? "Please wait..." : submitLabel}
          </button>

          {mode !== "login" && (
            <button
              type="button"
              onClick={() => changeMode("login")}
              className="w-full text-sm text-[#96745B] hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-[#96745B]">
          Secure GST Invoice Compliance System
        </p>
      </div>
    </div>
  );
}

export default Login;
