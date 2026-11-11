import { useEffect, useRef, useState } from "react";

import {
  getInvoices,
  uploadCsv,
  exportInvoicesCsv,
  getInvoiceIssues,
} from "../services/invoiceService";

import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Download,
} from "lucide-react";

import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import InvoiceTable from "../components/InvoiceTable";

function Dashboard({
  invoices,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  onInvoicesUpdated,
}) {
  const [activeTab, setActiveTab] = useState("invoices");
  const [invoiceIssues, setInvoiceIssues] = useState([]);
  const [issueSearchTerm, setIssueSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  // Fetch invoice issues when dashboard loads
  useEffect(() => {
    getInvoiceIssues()
      .then((data) => setInvoiceIssues(data))
      .catch((error) => console.error(error));
  }, []);

  // Export invoices
  const handleExport = () => {
    exportInvoicesCsv();
    setExportMessage(
      "CSV download started! Check your Downloads folder."
    );
  };

  // Upload CSV
  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    try {
      await uploadCsv(file);

      const updatedInvoices = await getInvoices();
      onInvoicesUpdated(updatedInvoices);

      const updatedIssues = await getInvoiceIssues();
      setInvoiceIssues(updatedIssues);

      setUploadMessage("CSV uploaded successfully!");
    } catch (error) {
      setUploadMessage(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
    const filteredIssues = invoiceIssues.filter((issue) => {
    const matchesSearch =
      issue.message?.toLowerCase().includes(issueSearchTerm.toLowerCase()) ||
      issue.ruleCode?.toLowerCase().includes(issueSearchTerm.toLowerCase()) ||
      String(issue.invoiceId).includes(issueSearchTerm);

    const matchesSeverity =
      severityFilter === "ALL" || issue.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });
  return (
        
    <main className="flex-1 p-8">
      <Header />

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={FileText}
          title="Total Invoices"
          value={invoices.length}
          color="text-blue-600"
        />

        <StatCard
          icon={ShieldCheck}
          title="Low Risk"
          value={invoices.filter((inv) => inv.riskLevel === "LOW").length}
          color="text-green-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Medium Risk"
          value={invoices.filter((inv) => inv.riskLevel === "MEDIUM").length}
          color="text-yellow-500"
        />

        <StatCard
          icon={AlertTriangle}
          title="High Risk"
          value={invoices.filter((inv) => inv.riskLevel === "HIGH").length}
          color="text-red-600"
        />
      </section>

      {/* Dashboard Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 font-semibold ${
            activeTab === "invoices"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-500"
          }`}
        >
          Recent Invoices
        </button>

        <button
          onClick={() => setActiveTab("issues")}
          className={`pb-3 font-semibold ${
            activeTab === "issues"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-slate-500"
          }`}
        >
          Invoice Issues
          {invoiceIssues.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
              {invoiceIssues.length}
            </span>
          )}
        </button>
      </div>

      {/* Recent Invoices Tab */}
      {activeTab === "invoices" && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Recent Invoices
              </h3>

              <p className="text-sm text-slate-500">
                Invoice records and risk status
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCsvUpload}
                className="hidden"
              />

              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={17} />
                {uploading ? "Uploading..." : "Upload CSV"}
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 border px-4 py-2 rounded-lg"
              >
                <Download size={17} />
                Export
              </button>
            </div>
          </div>

          {exportMessage && (
            <p className="text-sm text-green-600 mb-4">
              {exportMessage}
            </p>
          )}

          {uploadMessage && (
            <p className="text-sm text-green-600 mb-4">
              {uploadMessage}
            </p>
          )}

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <InvoiceTable
            invoices={invoices.filter(
              (inv) =>
                inv.invoiceNumber
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                inv.sellerGstin
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )}
            loading={loading}
            error={error}
          />
        </section>
      )}

      {/* Invoice Issues Tab */}
      {activeTab === "issues" && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          {/* Issue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

        <StatCard
          icon={AlertTriangle}
          title="Total Issues"
          value={invoiceIssues.length}
          color="text-blue-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="High Severity"
          value={invoiceIssues.filter((issue) => issue.severity === "HIGH").length}
          color="text-red-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Medium Severity"
          value={invoiceIssues.filter((issue) => issue.severity === "MEDIUM").length}
          color="text-yellow-500"
        />

        <StatCard
          icon={AlertTriangle}
          title="Low Severity"
          value={invoiceIssues.filter((issue) => issue.severity === "LOW").length}
          color="text-green-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Errors"
          value={invoiceIssues.filter((issue) => issue.severity === "ERROR").length}
          color="text-orange-600"
        />

      </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Invoice Issues
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            GST validation errors and detected anomalies
          </p>
          {/* Search and Severity Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            <input
              type="text"
              placeholder="Search by invoice ID, rule or description..."
              value={issueSearchTerm}
              onChange={(e) => setIssueSearchTerm(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="ERROR">Error</option>
            </select>

          </div>

              {filteredIssues.length === 0 ? (
                <p className="text-slate-500 py-4">
                  {invoiceIssues.length === 0
                    ? "No invoice issues found."
                    : "No matching issues found."}
                </p>
              ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-500 text-sm">
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Rule</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Severity</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="border-b">
                      <td className="p-3">{issue.invoiceId}</td>

                      <td className="p-3">{issue.ruleCode}</td>

                      <td className="p-3">{issue.message}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            issue.severity === "HIGH"
                              ? "bg-red-100 text-red-700"
                              : issue.severity === "ERROR"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Dashboard;
