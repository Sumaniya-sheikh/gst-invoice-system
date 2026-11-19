import { useEffect, useState } from "react";
import { getInvoiceCorrectionHistory, updateInvoiceCorrection } from "../services/invoiceService";

const fields = [
  ["invoiceNumber", "Invoice Number", "text"],
  ["invoiceDate", "Invoice Date", "date"],
  ["sellerGstin", "Seller GSTIN", "text"],
  ["buyerGstin", "Buyer GSTIN", "text"],
  ["sellerStateCode", "Seller State Code", "text"],
  ["buyerStateCode", "Buyer State Code", "text"],
  ["taxableValue", "Taxable Value", "number"],
  ["cgstAmount", "CGST Amount", "number"],
  ["sgstAmount", "SGST Amount", "number"],
  ["igstAmount", "IGST Amount", "number"],
  ["totalInvoiceValue", "Total Invoice Value", "number"],
];

export default function InvoiceCorrectionEditor({ invoice, onClose, onSaved }) {
  const [values, setValues] = useState(() => Object.fromEntries(
    fields.map(([key]) => [key, invoice[key] == null ? "" : String(invoice[key])])
  ));
  const [reason, setReason] = useState("");
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getInvoiceCorrectionHistory(invoice.id).then(setHistory).catch(() => {});
  }, [invoice.id]);

  const change = (key, value) => setValues(old => ({ ...old, [key]: value }));

  const save = async () => {
    setBusy(true); setError(""); setMessage("");
    try {
      const payload = {
        ...values,
        taxableValue: values.taxableValue === "" ? null : Number(values.taxableValue),
        cgstAmount: values.cgstAmount === "" ? null : Number(values.cgstAmount),
        sgstAmount: values.sgstAmount === "" ? null : Number(values.sgstAmount),
        igstAmount: values.igstAmount === "" ? null : Number(values.igstAmount),
        totalInvoiceValue: values.totalInvoiceValue === "" ? null : Number(values.totalInvoiceValue),
        reason,
      };
      await updateInvoiceCorrection(invoice.id, payload);
      setMessage("Correction saved. Invoice has been revalidated.");
      await onSaved?.();
      onClose();
    } catch (e) {
      setError(e.message || "Could not save correction.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
    <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="mb-5 flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-[#493B35]">Correct Invoice</h2><p className="text-sm text-[#927F71]">Review every change before saving. Original values are retained in correction history.</p></div>
        <button onClick={onClose} className="text-2xl text-[#806D60]" aria-label="Close">×</button>
      </div>
      {!preview ? <>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([key, label, type]) => <label key={key} className="block text-sm font-medium text-[#493B35]">{label}
            <input type={type} step={type === "number" ? "0.01" : undefined} value={values[key]} onChange={e => change(key, e.target.value)} className="mt-1 w-full rounded-lg border border-[#D8C9BA] px-3 py-2"/>
          </label>)}
        </div>
        <label className="mt-4 block text-sm font-medium text-[#493B35]">Correction reason
          <textarea required value={reason} onChange={e => setReason(e.target.value)} maxLength={1000} rows={2} placeholder="Explain why these invoice values are being corrected" className="mt-1 w-full rounded-lg border border-[#D8C9BA] px-3 py-2"/>
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2">Cancel</button>
          <button onClick={() => setPreview(true)} className="rounded-lg bg-[#96745B] px-5 py-2 font-semibold text-white">Preview Changes</button>
        </div>
      </> : <>
        <p className="mb-3 text-sm text-[#927F71]">Confirm the proposed values. Saving will replace the invoice values and run the GST validation rules again.</p>
        <div className="overflow-x-auto rounded-xl border border-[#E9DED3]"><table className="w-full text-sm"><thead className="bg-[#F5F0E9]"><tr><th className="p-3 text-left">Field</th><th className="p-3 text-left">Original</th><th className="p-3 text-left">Proposed</th></tr></thead><tbody>
          {fields.map(([key, label]) => <tr key={key} className="border-t"><td className="p-3 font-medium">{label}</td><td className="p-3">{invoice[key] ?? "—"}</td><td className="p-3">{values[key] || "—"}</td></tr>)}
        </tbody></table></div>
        {history.length > 0 && <p className="mt-3 text-xs text-[#927F71]">Previous corrections recorded: {history.length}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setPreview(false)} className="rounded-lg border px-4 py-2">Back to Edit</button>
          <button disabled={busy} onClick={save} className="rounded-lg bg-[#493B35] px-5 py-2 font-semibold text-white disabled:opacity-60">{busy ? "Saving..." : "Approve & Save Correction"}</button>
        </div>
      </>}
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-7 border-t border-[#E9DED3] pt-5">
        <h3 className="mb-3 font-semibold text-[#493B35]">Correction History</h3>
        {history.length === 0 ? <p className="text-sm text-[#927F71]">No corrections have been recorded for this invoice.</p> : <div className="space-y-3">
          {history.map(item => {
            let before = {}; let after = {};
            try { before = JSON.parse(item.beforeValues || "{}"); after = JSON.parse(item.afterValues || "{}"); } catch {}
            return <details key={item.id} className="rounded-lg border border-[#E9DED3] p-3">
              <summary className="cursor-pointer text-sm font-semibold">{new Date(item.correctedAt).toLocaleString()} · {item.correctedBy}</summary>
              {item.reason && <p className="mt-2 text-sm text-[#927F71]">Reason: {item.reason}</p>}
              <div className="mt-2 overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-left text-[#96745B]"><th className="p-2">Field</th><th className="p-2">Before</th><th className="p-2">After</th></tr></thead><tbody>
                {fields.filter(([key]) => String(before[key] ?? "") !== String(after[key] ?? "")).map(([key, label]) => <tr key={key} className="border-t"><td className="p-2 font-medium">{label}</td><td className="p-2">{before[key] ?? "—"}</td><td className="p-2">{after[key] ?? "—"}</td></tr>)}
              </tbody></table></div>
            </details>;
          })}
        </div>}
      </div>
    </section>
  </div>;
}
