import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import RecentInvoices from "./pages/RecentInvoices";
import InvoiceIssues from "./pages/InvoiceIssues";

import { getInvoices } from "./services/invoiceService";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getInvoices()
      .then((data) => {
        setInvoices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleInvoicesUpdated = (updatedInvoices) => {
    setInvoices(updatedInvoices);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {activePage === "dashboard" && (
        <Dashboard
          invoices={invoices}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onInvoicesUpdated={handleInvoicesUpdated}
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

      {activePage === "issues" && (
        <InvoiceIssues />
      )}
    </div>
  );
}

export default App;