import RiskBadge from "./RiskBadge";

function InvoiceTable({ invoices, loading, error }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm">
          <tr>
            <th className="p-4">Invoice Number</th>
            <th className="p-4">Date</th>
            <th className="p-4">Seller GSTIN</th>
            <th className="p-4">Taxable Value</th>
            <th className="p-4">Risk Level</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="p-8 text-center">
                Loading invoices...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5" className="p-8 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-8 text-center">
                No invoices found.
              </td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-slate-50">
                <td className="p-4">{inv.invoiceNumber}</td>
                <td className="p-4">{inv.invoiceDate}</td>
                <td className="p-4">{inv.sellerGstin}</td>
                <td className="p-4">
                  ₹{Number(inv.taxableValue).toLocaleString("en-IN")}
                </td>
                <td className="p-4">
                  <RiskBadge riskLevel={inv.riskLevel} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;