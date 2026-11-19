import { useEffect, useState } from "react";
import { verifyEmail, resetPassword } from "../services/authService";

export default function AuthAction({ type }) {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(type === "verify");

  useEffect(() => {
    if (type !== "verify") return;
    verifyEmail(token).then(r => setMessage(r.message)).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [type, token]);

  const submit = async (e) => {
    e.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try {
      const result = await resetPassword(token, password, confirmPassword);
      setMessage(result.message);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return <div className="flex min-h-screen items-center justify-center bg-[#F5F0E9] px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-3 text-2xl font-bold text-[#493B35]">{type === "verify" ? "Email Verification" : "Reset Password"}</h1>
      {type === "reset" && <form onSubmit={submit} className="space-y-4">
        <input type="password" minLength="8" maxLength="12" required value={password} onChange={e => setPassword(e.target.value)}
          placeholder="New password" className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3" />
        <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password" className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3" />
        <p className="text-xs text-[#96745B]">Use 8–12 characters with uppercase, lowercase, number and special character.</p>
        <button disabled={loading} className="w-full rounded-lg bg-[#493B35] py-3 font-semibold text-white">{loading ? "Please wait..." : "Reset Password"}</button>
      </form>}
      {loading && <p className="text-[#96745B]">Processing...</p>}
      {message && <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <a href="/" className="mt-6 inline-block text-sm font-medium text-[#96745B] hover:underline">Return to Sign In</a>
    </div>
  </div>;
}
