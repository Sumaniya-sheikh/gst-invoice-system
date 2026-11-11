import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import StatCard from "../components/StatCard";
import { getInvoiceIssues } from "../services/invoiceService";

function InvoiceIssues() {
  const [invoiceIssues, setInvoiceIssues] = useState([]);
  const [issueSearchTerm, setIssueSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  useEffect(() => {
    getInvoiceIssues()
      .then((data) => setInvoiceIssues(data))
      .catch((error) => console.error(error));
  }, []);

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
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Invoice Issues
      </h2>

      <p className="text-slate-500 mb-6">
        GST validation errors and detected anomalies
      </p>

      {/* Issue Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={AlertTriangle}
          title="Total Issues"
          value={invoiceIssues.length}
          color="text-blue-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="High Severity"
          value={invoiceIssues.filter((i) => i.severity === "HIGH").length}
          color="text-red-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Medium Severity"
          value={invoiceIssues.filter((i) => i.severity === "MEDIUM").length}
          color="text-yellow-500"
        />

        <StatCard
          icon={AlertTriangle}
          title="Low Severity"
          value={invoiceIssues.filter((i) => i.severity === "LOW").length}
          color="text-green-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Errors"
          value={invoiceIssues.filter((i) => i.severity === "ERROR").length}
          color="text-orange-600"
        />
      </section>

      {/* Search and Filter */}
      <section className="bg-white rounded-xl shadow-sm p-6">
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

        {/* Issues Table */}
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
                            : issue.severity === "LOW"
                            ? "bg-green-100 text-green-700"
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
    </main>
  );
}

export default InvoiceIssues;