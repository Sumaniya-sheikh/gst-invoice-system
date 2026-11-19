import { useEffect, useState } from "react";
import { createBusinessUser, getAdminUsers, resendUserVerification, updateBusinessUser, updateBusinessUserStatus } from "../services/authService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => setUsers(await getAdminUsers());
  useEffect(() => { load().catch(e => setError(e.message)); }, []);

  const create = async (e) => {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const result = await createBusinessUser(username, email, password);
      setMessage(result.message); setUsername(""); setEmail(""); setPassword(""); await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const startEdit = (user) => {
    setEditing(user.id); setEditUsername(user.username); setEditEmail(user.email || ""); setMessage(""); setError("");
  };

  const saveEdit = async (e) => {
    e.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const result = await updateBusinessUser(editing, editUsername, editEmail);
      setMessage(result.message); setEditing(null); await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const toggle = async (user) => {
    setError(""); setMessage("");
    try { await updateBusinessUserStatus(user.id, !user.active); await load(); }
    catch (e) { setError(e.message); }
  };

  const resend = async (user) => {
    setError(""); setMessage("");
    try { const result = await resendUserVerification(user.id); setMessage(result.message); }
    catch (e) { setError(e.message); }
  };

  return <main className="min-w-0 flex-1 bg-[#F5F0E9] p-8 text-[#493B35]">
    <h1 className="mb-2 text-3xl font-bold">User Management</h1>
    <p className="mb-8 text-[#96745B]">Create, edit and manage Business User accounts.</p>
    <form onSubmit={create} className="mb-8 grid max-w-3xl gap-3 rounded-2xl border border-[#E9DED3] bg-white p-6 shadow-sm md:grid-cols-2">
      <h2 className="font-bold md:col-span-2">Create Business User</h2>
      <input required value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
      <input required type="password" minLength="8" maxLength="12" value={password} onChange={e => setPassword(e.target.value)} placeholder="Temporary password" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
      <button disabled={busy} className="rounded-lg bg-[#493B35] px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? "Please wait..." : "Create Business User"}</button>
      <p className="text-xs text-[#96745B] md:col-span-2">Password: 8–12 characters with uppercase, lowercase, number and special character. A verification email is sent after creation.</p>
    </form>

    {editing && <form onSubmit={saveEdit} className="mb-6 grid max-w-3xl gap-3 rounded-2xl border border-[#D8C9BA] bg-white p-6 shadow-sm md:grid-cols-2">
      <h2 className="font-bold md:col-span-2">Edit Business User</h2>
      <input required value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder="Username" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
      <input required type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" className="rounded-lg border border-[#D8C9BA] px-4 py-3"/>
      <div className="flex gap-2 md:col-span-2"><button disabled={busy} className="rounded-lg bg-[#96745B] px-4 py-2 font-semibold text-white">Save Changes</button><button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button></div>
      <p className="text-xs text-[#927F71] md:col-span-2">Changing the email address resets its verification status and sends a new verification email.</p>
    </form>}

    {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <section className="overflow-x-auto rounded-2xl border border-[#E9DED3] bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold">Registered Users</h2>
      <table className="w-full text-left text-sm">
        <thead className="border-b text-[#96745B]"><tr><th className="p-3">Username</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Email Status</th><th className="p-3">Account</th><th className="p-3">Actions</th></tr></thead>
        <tbody>{users.map(user => <tr key={user.id} className="border-b border-[#EEE5DE]">
          <td className="p-3">{user.username}</td><td className="p-3">{user.email || "Not added"}</td><td className="p-3">{user.role}</td>
          <td className="p-3">{user.emailVerified ? "Verified" : "Pending"}</td><td className="p-3">{user.active ? "Active" : "Inactive"}</td>
          <td className="p-3"><div className="flex flex-wrap gap-3">{user.role === "BUSINESS_USER" && <><button onClick={() => startEdit(user)} className="font-semibold text-[#96745B]">Edit</button>{!user.emailVerified && <button onClick={() => resend(user)} className="font-semibold text-[#96745B]">Resend verification</button>}<button onClick={() => toggle(user)} className="font-semibold text-[#96745B]">{user.active ? "Deactivate" : "Activate"}</button></>}</div></td>
        </tr>)}</tbody>
      </table>
    </section>
  </main>;
}
