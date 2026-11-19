
import { useEffect, useState } from "react";
import {
  getSalesRegister,
  getPurchaseRegister,
} from "../services/registerService";

function Registers() {
  const [type, setType] = useState("sales");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = type === "sales"
          ? await getSalesRegister()
          : await getPurchaseRegister();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type]);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  return (
    <main className="min-w-0 flex-1 overflow-x-auto p-6">
      <h1 className="mb-2 text-2xl font-bold text-[#493B35]">
        Purchase & Sales Registers
      </h1>
      <p className="mb-6 text-sm text-[#806F64]">
        Invoices classified using the configured demo business GSTIN.
      </p>

      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setType("sales")}
          className={`rounded-lg px-5 py-2 ${type === "sales" ? "bg-[#493B35] text-white" : "bg-white text-[#493B35]"}`}
        >
          Sales Register
        </button>
        <button
          onClick={() => setType("purchases")}
          className={`rounded-lg px-5 py-2 ${type === "purchases" ? "bg-[#493B35] text-white" : "bg-white text-[#493B35]"}`}
        >
          Purchase Register
        </button>
      </div>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {loading ? (
        <p className="text-[#806F64]">Loading invoices...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5D9CE] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#493B35] text-white">
              <tr>
                <th className="p-3">Invoice No.</th>
                <th className="p-3">Date</th>
                <th className="p-3">Seller GSTIN</th>
                <th className="p-3">Buyer GSTIN</th>
                <th className="p-3">Taxable Value</th>
                <th className="p-3">Total</th>
                <th className="p-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-[#E5D9CE] text-[#493B35]">
                  <td className="p-3">{invoice.invoiceNumber}</td>
                  <td className="p-3">{invoice.invoiceDate}</td>
                  <td className="p-3">{invoice.sellerGstin}</td>
                  <td className="p-3">{invoice.buyerGstin}</td>
                  <td className="p-3">{money(invoice.taxableValue)}</td>
                  <td className="p-3">{money(invoice.totalInvoiceValue)}</td>
                  <td className="p-3">{invoice.riskLevel}</td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#806F64]">
                    No invoices found in this register for the configured demo GSTIN.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Registers;
