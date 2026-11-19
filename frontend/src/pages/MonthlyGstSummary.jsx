
import { useEffect, useState } from "react";
import { getMonthlyGstSummary } from "../services/gstSummaryService";
import {
  CalendarDays,
  FileText,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

function MonthlyGstSummary() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMonthlyGstSummary();
      setSummaries(data);
    } catch (err) {
      setError(err.message || "Failed to load monthly GST summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const totalInvoices = summaries.reduce(
    (sum, item) => sum + item.invoiceCount, 0
  );

  const totalTaxable = summaries.reduce(
    (sum, item) => sum + Number(item.taxableValue || 0), 0
  );

  const totalCgst = summaries.reduce(
    (sum, item) => sum + Number(item.cgstAmount || 0), 0
  );

  const totalSgst = summaries.reduce(
    (sum, item) => sum + Number(item.sgstAmount || 0), 0
  );

  const totalIgst = summaries.reduce(
    (sum, item) => sum + Number(item.igstAmount || 0), 0
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const summaryCards = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      icon: FileText,
    },
    {
      title: "Taxable Value",
      value: formatCurrency(totalTaxable),
      icon: IndianRupee,
    },
    {
      title: "Total CGST",
      value: formatCurrency(totalCgst),
      icon: IndianRupee,
    },
    {
      title: "Total SGST",
      value: formatCurrency(totalSgst),
      icon: IndianRupee,
    },
    {
      title: "Total IGST",
      value: formatCurrency(totalIgst),
      icon: IndianRupee,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E9] p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#493B35]">
            Monthly GST Summary
          </h1>
          <p className="mt-1 text-sm text-[#806F64]">
            Review your monthly invoice and GST breakdown.
          </p>
        </div>

        <button
          onClick={fetchSummary}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#493B35] px-4 py-2 text-sm text-white hover:bg-[#604D43] disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-[#806F64]">
          Loading monthly GST summary...
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-xl border border-[#E5D9CE] bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-[#806F64]">
                      {card.title}
                    </p>
                    <Icon size={20} className="text-[#96745B]" />
                  </div>

                  <h2 className="text-xl font-bold text-[#493B35]">
                    {card.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5D9CE] bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#E5D9CE] p-5">
              <CalendarDays size={20} className="text-[#96745B]" />
              <h2 className="font-semibold text-[#493B35]">
                Monthly Breakdown
              </h2>
            </div>

            {summaries.length === 0 ? (
              <p className="p-8 text-center text-[#806F64]">
                No monthly invoice data available.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F5F0E9] text-[#604D43]">
                    <tr>
                      <th className="p-4">Month</th>
                      <th className="p-4">Invoices</th>
                      <th className="p-4">Taxable Value</th>
                      <th className="p-4">CGST</th>
                      <th className="p-4">SGST</th>
                      <th className="p-4">IGST</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summaries.map((item) => (
                      <tr
                        key={item.month}
                        className="border-t border-[#E5D9CE] text-[#493B35]"
                      >
                        <td className="p-4 font-medium">
                          {item.month}
                        </td>
                        <td className="p-4">{item.invoiceCount}</td>
                        <td className="p-4">
                          {formatCurrency(item.taxableValue)}
                        </td>
                        <td className="p-4">
                          {formatCurrency(item.cgstAmount)}
                        </td>
                        <td className="p-4">
                          {formatCurrency(item.sgstAmount)}
                        </td>
                        <td className="p-4">
                          {formatCurrency(item.igstAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MonthlyGstSummary;
