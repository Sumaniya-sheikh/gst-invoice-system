import { useEffect, useState } from "react";

import {
  getInvoiceIssues,
} from "../services/invoiceService";

import {
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import Header from "../components/Header";
import StatCard from "../components/StatCard";
import InvoiceTable from "../components/InvoiceTable";

function Dashboard({ invoices, loading, error }) {
  const [activeTab, setActiveTab] = useState("invoices");
  const [invoiceIssues, setInvoiceIssues] = useState([]);
  const [issueSearchTerm, setIssueSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  useEffect(() => {
    getInvoiceIssues()
      .then((data) => setInvoiceIssues(data))
      .catch((error) => console.error(error));
  }, []);

  // Show the 5 latest uploaded invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

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
    <main className="flex-1 min-h-screen bg-[#F5F0E9] p-6 md:p-8 text-[#493B35]">

      <Header />

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <StatCard
          icon={FileText}
          title="Total Invoices"
          value={invoices.length}
          color="text-[#96745B]"
        />

        <StatCard
          icon={ShieldCheck}
          title="No Issues"
          value={invoices.filter((inv) => inv.riskLevel === "LOW").length}
          color="text-green-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Medium Risk"
          value={invoices.filter((inv) => inv.riskLevel === "MEDIUM").length}
          color="text-yellow-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="High Risk"
          value={invoices.filter((inv) => inv.riskLevel === "HIGH").length}
          color="text-red-600"
        />

      </section>

      {/* Dashboard Tabs */}
      <div className="flex gap-6 border-b border-[#E3D6C9] mb-6">

        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "invoices"
              ? "text-[#805D48] border-b-2 border-[#96745B]"
              : "text-[#927F71] hover:text-[#493B35]"
          }`}
        >
          Recent Invoices
        </button>

        <button
          onClick={() => setActiveTab("issues")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "issues"
              ? "text-[#805D48] border-b-2 border-[#96745B]"
              : "text-[#927F71] hover:text-[#493B35]"
          }`}
        >
          Invoice Issues

          {invoiceIssues.length > 0 && (
            <span className="ml-2 bg-[#F0DFD2] text-[#805D48] px-2 py-1 rounded-full text-xs">
              {invoiceIssues.length}
            </span>
          )}
        </button>

      </div>

      {/* Recent Invoices Tab */}
      {activeTab === "invoices" && (
        <section className="bg-white border border-[#E9DED3] rounded-2xl shadow-sm p-6">

          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#493B35]">
              Recent Invoices
            </h3>

            <p className="text-sm text-[#927F71] mt-1">
              Your 5 latest uploaded invoice records
            </p>
          </div>

          <InvoiceTable
            invoices={recentInvoices}
            loading={loading}
            error={error}
          />

        </section>
      )}

      {/* Invoice Issues Tab */}
      {activeTab === "issues" && (
        <section className="bg-white border border-[#E9DED3] rounded-2xl shadow-sm p-6">

          {/* Issue Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

            <StatCard
              icon={AlertTriangle}
              title="Total Issues"
              value={invoiceIssues.length}
              color="text-[#96745B]"
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
              color="text-yellow-600"
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

          <h3 className="text-xl font-bold text-[#493B35] mb-2">
            Invoice Issues
          </h3>

          <p className="text-sm text-[#927F71] mb-6">
            GST validation errors and detected anomalies
          </p>

          {/* Search and Severity Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            <input
              type="text"
              placeholder="Search by invoice ID, rule or description..."
              value={issueSearchTerm}
              onChange={(e) => setIssueSearchTerm(e.target.value)}
              className="flex-1 border border-[#E3D6C9] rounded-lg px-4 py-2 text-[#493B35] placeholder-[#A89586] outline-none focus:ring-2 focus:ring-[#C9A987] focus:border-[#96745B]"
            />

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border border-[#E3D6C9] rounded-lg px-4 py-2 text-[#493B35] bg-white outline-none focus:ring-2 focus:ring-[#C9A987]"
            >
              <option value="ALL">All Severities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="ERROR">Error</option>
            </select>

          </div>

          {filteredIssues.length === 0 ? (
            <p className="text-[#927F71] py-4">
              {invoiceIssues.length === 0
                ? "No invoice issues found."
                : "No matching issues found."}
            </p>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-[#E9DED3] text-[#806D60] text-sm bg-[#FAF7F3]">
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Rule</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Severity</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-[#F0E8E0] hover:bg-[#FCF9F5] transition-colors"
                    >
                      <td className="p-3 text-[#493B35]">
                        {issue.invoiceId}
                      </td>

                      <td className="p-3 text-[#805D48] font-medium">
                        {issue.ruleCode}
                      </td>

                      <td className="p-3 text-[#65564D]">
                        {issue.message}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            issue.severity === "HIGH"
                              ? "bg-red-100 text-red-700"
                              : issue.severity === "ERROR"
                              ? "bg-orange-100 text-orange-700"
                              : issue.severity === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
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