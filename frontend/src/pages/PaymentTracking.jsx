
import { useEffect, useState } from "react";
import { getInvoices } from "../services/invoiceService";
import {
  addPayment,
  getInvoicePayments,
  getTotalPaid,
  getOutstandingBalance,
} from "../services/paymentService";

function PaymentTracking() {
  const [invoices, setInvoices] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "UPI",
    referenceNumber: "",
    notes: "",
  });

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvoices();
      setInvoices(data);

      const results = await Promise.all(
        data.map(async (invoice) => {
          const [paid, balance] = await Promise.all([
            getTotalPaid(invoice.id),
            getOutstandingBalance(invoice.id),
          ]);

          return {
            [invoice.id]: {
              paid: Number(paid || 0),
              balance: Number(balance || 0),
            },
          };
        })
      );

      setPaymentData(Object.assign({}, ...results));
    } catch (err) {
      setError(err.message || "Failed to load payment information.");
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentHistory = async (invoiceId) => {
    try {
      const data = await getInvoicePayments(invoiceId);
      setPayments(data);
    } catch (err) {
      setError(err.message || "Failed to load payment history.");
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleSelectInvoice = async (invoice) => {
    setSelectedInvoice(invoice);
    setSuccess("");
    setError("");
    setForm({
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "UPI",
      referenceNumber: "",
      notes: "",
    });

    await loadPaymentHistory(invoice.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInvoice) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await addPayment(selectedInvoice.id, {
        amount: Number(form.amount),
        paymentDate: form.paymentDate,
        paymentMethod: form.paymentMethod,
        referenceNumber: form.referenceNumber,
        notes: form.notes,
      });

      setSuccess("Payment recorded successfully.");

      await loadInvoices();
      await loadPaymentHistory(selectedInvoice.id);

      setForm({
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "UPI",
        referenceNumber: "",
        notes: "",
      });
    } catch (err) {
      setError(err.message || "Failed to record payment.");
    } finally {
      setSaving(false);
    }
  };

  const getStatus = (invoice) => {
    const data = paymentData[invoice.id];

    if (!data || data.paid === 0) return "Unpaid";
    if (data.balance <= 0) return "Paid";
    return "Partially Paid";
  };

  const statusStyle = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Partially Paid") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return <div className="p-6 text-[#493B35]">Loading payment information...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#493B35]">
          Payment Tracking
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track invoice payments and outstanding balances.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#E8DED3] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F5F0E9] text-[#493B35]">
            <tr>
              <th className="p-4">Invoice Number</th>
              <th className="p-4">Invoice Date</th>
              <th className="p-4">Invoice Total</th>
              <th className="p-4">Amount Paid</th>
              <th className="p-4">Outstanding</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => {
              const data = paymentData[invoice.id] || {
                paid: 0,
                balance: Number(invoice.totalInvoiceValue || 0),
              };

              const status = getStatus(invoice);

              return (
                <tr key={invoice.id} className="border-t border-[#E8DED3]">
                  <td className="p-4 font-medium">
                    {invoice.invoiceNumber || "N/A"}
                  </td>
                  <td className="p-4">{invoice.invoiceDate || "N/A"}</td>
                  <td className="p-4">
                    {formatAmount(invoice.totalInvoiceValue)}
                  </td>
                  <td className="p-4">{formatAmount(data.paid)}</td>
                  <td className="p-4">{formatAmount(data.balance)}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleSelectInvoice(invoice)}
                      className="font-medium text-[#96745B] hover:underline"
                    >
                      View / Pay
                    </button>
                  </td>
                </tr>
              );
            })}

            {invoices.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No invoices available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    
{selectedInvoice && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setSelectedInvoice(null)}
  >
    <div
      className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#F5F0E9] p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {(() => {
        const data = paymentData[selectedInvoice.id] || {
          paid: 0,
          balance: Number(selectedInvoice.totalInvoiceValue || 0),
        };

        const total = Number(selectedInvoice.totalInvoiceValue || 0);
        const percentage =
          total > 0 ? Math.min(100, (data.paid / total) * 100) : 0;
        const status = getStatus(selectedInvoice);

        return (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#493B35]">
                  Invoice Payment Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Invoice: {selectedInvoice.invoiceNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-white"
              >
                ×
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Invoice Total", total],
                ["Amount Paid", data.paid],
                ["Outstanding", data.balance],
              ].map(([label, amount]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#E8DED3] bg-white p-4"
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-2 text-xl font-bold text-[#493B35]">
                    {formatAmount(amount)}
                  </p>
                </div>
              ))}

              <div className="rounded-xl border border-[#E8DED3] bg-white p-4">
                <p className="text-sm text-gray-500">Payment Status</p>
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(status)}`}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-[#E8DED3] bg-white p-5">
              <div className="mb-3 flex justify-between">
                <h3 className="font-semibold text-[#493B35]">
                  Payment Progress
                </h3>
                <span className="text-sm font-semibold text-[#96745B]">
                  {percentage.toFixed(1)}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-[#E8DED3]">
                <div
                  className="h-full rounded-full bg-[#96745B]"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {formatAmount(data.paid)} paid out of{" "}
                {formatAmount(total)}
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-[#E8DED3] bg-white p-5">
              <h3 className="mb-4 font-semibold text-[#493B35]">
                Invoice Information
              </h3>

              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-gray-500">Invoice Number:</span>
                  <br />
                  <strong>{selectedInvoice.invoiceNumber || "N/A"}</strong>
                </p>

                <p>
                  <span className="text-gray-500">Invoice Date:</span>
                  <br />
                  <strong>{selectedInvoice.invoiceDate || "N/A"}</strong>
                </p>

                <p>
                  <span className="text-gray-500">Seller GSTIN:</span>
                  <br />
                  <strong>{selectedInvoice.sellerGstin || "N/A"}</strong>
                </p>

                <p>
                  <span className="text-gray-500">Buyer GSTIN:</span>
                  <br />
                  <strong>{selectedInvoice.buyerGstin || "N/A"}</strong>
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-[#E8DED3] bg-white p-5">
                <h3 className="mb-4 font-semibold text-[#493B35]">
                  Payment History
                </h3>

                {payments.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No payments recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="rounded-lg border border-[#E8DED3] p-3"
                      >
                        <div className="flex justify-between gap-3">
                          <strong className="text-[#493B35]">
                            {formatAmount(payment.amount)}
                          </strong>
                          <span className="text-sm text-gray-500">
                            {payment.paymentDate}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                          Method: {payment.paymentMethod || "Not specified"}
                        </p>

                        {payment.referenceNumber && (
                          <p className="text-sm text-gray-600">
                            Reference: {payment.referenceNumber}
                          </p>
                        )}

                        {payment.notes && (
                          <p className="mt-1 text-sm text-gray-500">
                            {payment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#E8DED3] bg-white p-5">
                <h3 className="mb-4 font-semibold text-[#493B35]">
                  Record Payment
                </h3>

                <p className="mb-4 text-sm text-gray-500">
                  Remaining balance: {formatAmount(data.balance)}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={data.balance}
                    required
                    disabled={data.balance <= 0}
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    placeholder="Payment amount"
                    className="w-full rounded-lg border border-[#E8DED3] p-3"
                  />

                  <input
                    type="date"
                    required
                    disabled={data.balance <= 0}
                    value={form.paymentDate}
                    onChange={(e) =>
                      setForm({ ...form, paymentDate: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#E8DED3] p-3"
                  />

                  <select
                    value={form.paymentMethod}
                    disabled={data.balance <= 0}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#E8DED3] p-3"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    type="text"
                    disabled={data.balance <= 0}
                    value={form.referenceNumber}
                    onChange={(e) =>
                      setForm({ ...form, referenceNumber: e.target.value })
                    }
                    placeholder="Reference number"
                    className="w-full rounded-lg border border-[#E8DED3] p-3"
                  />

                  <textarea
                    disabled={data.balance <= 0}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    placeholder="Payment notes (optional)"
                    rows="2"
                    className="w-full rounded-lg border border-[#E8DED3] p-3"
                  />

                  <button
                    type="submit"
                    disabled={saving || data.balance <= 0}
                    className="w-full rounded-lg bg-[#96745B] p-3 font-semibold text-white hover:bg-[#806149] disabled:opacity-50"
                  >
                    {data.balance <= 0
                      ? "Invoice Fully Paid"
                      : saving
                        ? "Saving..."
                        : "Record Payment"}
                  </button>
                </form>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  </div>
)}

    </div>
  );
}

export default PaymentTracking;
