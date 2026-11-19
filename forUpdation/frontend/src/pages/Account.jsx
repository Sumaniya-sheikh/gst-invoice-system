import { useState } from "react";
import { changePassword, resendVerification, updateEmail } from "../services/authService";

export default function Account({ currentUser, onUserUpdated }) {
  const [email, setEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (action) => {
    setMessage(""); setError(""); setLoading(true);
    try { const result = await action(); setMessage(result.message); return result; }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const saveEmail = async (e) => {
    e.preventDefault();
    const result = await run(() => updateEmail(email));
    if (result) onUserUpdated?.({ ...currentUser, email: email.trim().toLowerCase(), emailVerified: false });
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const result = await run(() => changePassword(currentPassword, newPassword, confirmPassword));
    if (result) { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
  };

  return <main className="min-w-0 flex-1 bg-[#F5F0E9] p-8 text-[#493B35]">
    <h1 className="mb-2 text-3xl font-bold">Account Settings</h1>
    <p className="mb-8 text-[#96745B]">Manage your profile, email verification and password security in one place.</p>

    <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-[#E9DED3] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold">My Profile</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-3"><span className="text-[#927F71]">Username</span><strong>{currentUser?.username}</strong></div>
          <div className="flex justify-between border-b pb-3"><span className="text-[#927F71]">Role</span><strong>{currentUser?.role === "ADMIN" ? "Administrator" : "Business User"}</strong></div>
          <div className="flex justify-between"><span className="text-[#927F71]">Account status</span><strong className="text-green-700">Active</strong></div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E9DED3] bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold">Email & Verification</h2>
        <p className="mb-4 text-sm text-[#927F71]">Changing your email address requires verification again.</p>
        <form onSubmit={saveEmail} className="space-y-3">
          <label className="block text-sm font-medium">Email address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-[#D8C9BA] px-4 py-3"/>
          <button disabled={loading} className="rounded-lg bg-[#493B35] px-4 py-2.5 font-semibold text-white disabled:opacity-60">Save Email & Send Verification</button>
        </form>
        <p className="mt-4 text-sm">Status: <strong>{currentUser?.emailVerified ? "Verified" : "Not verified"}</strong></p>
        {!currentUser?.emailVerified && currentUser?.email && <button onClick={() => run(resendVerification)} disabled={loading} className="mt-2 text-sm font-semibold text-[#96745B] hover:underline">Resend verification email</button>}
      </section>

      <section className="rounded-2xl border border-[#E9DED3] bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="mb-2 text-lg font-bold">Change Password</h2>
        <p className="mb-4 text-sm text-[#927F71]">Use your current password to set a new one. Password must be 8–12 characters and include uppercase, lowercase, number and special character.</p>
        <form onSubmit={savePassword} className="grid gap-3 md:grid-cols-3">
          <input required type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
          <input required type="password" minLength="8" maxLength="12" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
          <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
          <button disabled={loading} className="rounded-lg bg-[#96745B] px-4 py-3 font-semibold text-white disabled:opacity-60 md:col-span-3">Update Password</button>
        </form>
      </section>
    </div>
    {message && <p className="mt-5 max-w-5xl rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</p>}
    {error && <p className="mt-5 max-w-5xl rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  </main>;
}
