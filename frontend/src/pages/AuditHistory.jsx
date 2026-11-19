
import { useEffect, useMemo, useState } from "react";
import { Search, History, FileText } from "lucide-react";
import { getInvoices } from "../services/invoiceService";
import { getAllAuditHistory } from "../services/auditService";

function AuditHistory() {
  const [invoices, setInvoices] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAuditData = async () => {
      try {
        setLoading(true);
        setError("");

        const [auditData, invoiceData] = await Promise.all([
          getAllAuditHistory(),
          getInvoices(),
        ]);

        setHistory(
          [...auditData].sort(
            (a, b) =>
              new Date(b.correctedAt || 0) -
              new Date(a.correctedAt || 0)
          )
        );

        setInvoices(invoiceData);
      } catch (err) {
        setError(err.message || "Unable to load audit history.");
      } finally {
        setLoading(false);
      }
    };

    loadAuditData();
  }, []);

  const invoiceMap = useMemo(() => {
    return new Map(
      invoices.map((invoice) => [
        String(invoice.id),
        invoice,
      ])
    );
  }, [invoices]);

  const users = useMemo(() => {
    return [
      ...new Set(
        history
          .map((entry) => entry.correctedBy)
          .filter(Boolean)
      ),
    ].sort();
  }, [history]);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return history.filter((entry) => {
      const invoice = invoiceMap.get(String(entry.invoiceId));
      const invoiceNumber = invoice?.invoiceNumber || "";

      const matchesSearch =
        !query ||
        invoiceNumber.toLowerCase().includes(query) ||
        String(entry.invoiceId).includes(query) ||
        (entry.correctedBy || "").toLowerCase().includes(query) ||
        (entry.reason || "").toLowerCase().includes(query) ||
        (entry.beforeValues || "").toLowerCase().includes(query) ||
        (entry.afterValues || "").toLowerCase().includes(query);

      const matchesUser =
        userFilter === "ALL" ||
        entry.correctedBy === userFilter;

      return matchesSearch && matchesUser;
    });
  }, [history, invoiceMap, search, userFilter]);

  // Initially show five records.
  // Search/filter shows every matching record.
  const displayedHistory = useMemo(() => {
    if (search.trim() || userFilter !== "ALL") {
      return filteredHistory;
    }

    return filteredHistory.slice(0, 5);
  }, [filteredHistory, search, userFilter]);

  const parseValues = (value) => {
    try {
      return JSON.stringify(
        JSON.parse(value || "{}"),
        null,
        2
      );
    } catch {
      return value || "No data available";
    }
  };

  return (
    <main className="min-w-0 flex-1 p-6">
      <h1 className="mb-2 text-2xl font-bold text-[#493B35]">
        Audit History
      </h1>

      <p className="mb-6 text-sm text-[#806F64]">
        Review recent invoice corrections and their complete before-and-after details.
      </p>

      <div className="mb-4 flex max-w-xl flex-wrap gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[#D9C9BC] bg-white px-3">
          <Search size={18} className="text-[#806F64]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice, user, reason..."
            className="w-full bg-transparent py-3 text-sm text-[#493B35] outline-none"
          />
        </div>

        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="rounded-lg border border-[#D9C9BC] bg-white px-3 py-3 text-sm text-[#493B35]"
        >
          <option value="ALL">All users</option>

          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#806F64]">
        <History size={16} />

        {search.trim() || userFilter !== "ALL"
          ? `${filteredHistory.length} matching correction records`
          : `Showing ${displayedHistory.length} most recent correction records`}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-[#806F64]">
          Loading audit history...
        </p>
      )}

      {!loading && !error && history.length === 0 && (
        <p className="rounded-lg bg-white p-5 text-[#806F64]">
          No invoice corrections have been recorded yet.
        </p>
      )}

      {!loading &&
        !error &&
        history.length > 0 &&
        displayedHistory.length === 0 && (
          <p className="rounded-lg bg-white p-5 text-[#806F64]">
            No matching correction records found.
          </p>
        )}

      <div className="space-y-4">
        {displayedHistory.map((entry) => {
          const invoice = invoiceMap.get(String(entry.invoiceId));

          return (
            <article
              key={entry.id}
              className="rounded-xl border border-[#E5D9CE] bg-white p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-semibold text-[#493B35]">
                  <FileText size={18} />

                  {invoice?.invoiceNumber ||
                    `Invoice ID: ${entry.invoiceId}`}
                </h2>

                <span className="text-xs text-[#806F64]">
                  {entry.correctedAt
                    ? new Date(entry.correctedAt).toLocaleString("en-IN")
                    : "Date not recorded"}
                </span>
              </div>

              <div className="mb-4 grid gap-2 text-sm text-[#604D43] sm:grid-cols-2">
                <p>
                  <strong>Corrected by:</strong>{" "}
                  {entry.correctedBy || "Not recorded"}
                </p>

                <p>
                  <strong>Invoice date:</strong>{" "}
                  {invoice?.invoiceDate || "Not available"}
                </p>

                <p className="sm:col-span-2">
                  <strong>Reason:</strong>{" "}
                  {entry.reason || "Not provided"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#493B35]">
                    Before correction
                  </h3>

                  <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#F5F0E9] p-3 text-xs text-[#493B35]">
                    {parseValues(entry.beforeValues)}
                  </pre>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[#493B35]">
                    After correction
                  </h3>

                  <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-[#F5F0E9] p-3 text-xs text-[#493B35]">
                    {parseValues(entry.afterValues)}
                  </pre>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default AuditHistory;
