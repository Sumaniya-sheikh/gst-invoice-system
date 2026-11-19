
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import RecentInvoices from "./pages/RecentInvoices";
import InvoiceIssues from "./pages/InvoiceIssues";
import Login from "./pages/Login";
import Account from "./pages/Account";
import AdminUsers from "./pages/AdminUsers";
import AuthAction from "./pages/AuthAction";
import VendorManagement from "./pages/VendorManagement";
import PaymentTracking from "./pages/PaymentTracking";
import MonthlyGstSummary from "./pages/MonthlyGstSummary";
import Registers from "./pages/Registers";
import AuditHistory from "./pages/AuditHistory";
import VendorRisk from "./pages/VendorRisk";

import { getInvoices } from "./services/invoiceService";
import {
  getCurrentUser,
  logout as logoutUser,
} from "./services/authService";

function App() {
  const actionPath = window.location.pathname;
  const [activePage, setActivePage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        if (user) setCurrentUser(user);
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    setError("");

    getInvoices()
      .then(setInvoices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleLogin = (user) => setCurrentUser(user);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setInvoices([]);
      setActivePage("dashboard");
      setSearchTerm("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInvoicesUpdated = (updatedInvoices) => {
    setInvoices(updatedInvoices);
  };

  if (actionPath === "/verify-email") return <AuthAction type="verify" />;
  if (actionPath === "/reset-password") return <AuthAction type="reset" />;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F0E9]">
        <p className="text-[#493B35]">Checking session...</p>
      </div>
    );
  }

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-[#F5F0E9]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {activePage === "dashboard" && (
        <Dashboard
          invoices={invoices}
          loading={loading}
          error={error}
          onInvoicesUpdated={handleInvoicesUpdated}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {activePage === "invoices" && (
        <RecentInvoices
          invoices={invoices}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onInvoicesUpdated={handleInvoicesUpdated}
        />
      )}

      {activePage === "issues" && <InvoiceIssues />}
      {activePage === "vendors" && <VendorManagement />}
      {activePage === "payments" && <PaymentTracking />}
      {activePage === "gst-summary" && <MonthlyGstSummary />}
      {activePage === "registers" && <Registers />}
      {activePage === "audit" && <AuditHistory />}
      {activePage === "vendor-risk" && <VendorRisk />}

      {activePage === "account" && (
        <Account
          currentUser={currentUser}
          onUserUpdated={setCurrentUser}
        />
      )}

      {activePage === "users" && currentUser.role === "ADMIN" && (
        <AdminUsers />
      )}
    </div>
  );
}

export default App;
