
import { useEffect, useState } from "react";
import RiskBadge from "./RiskBadge";
import { getInvoiceIssues } from "../services/invoiceService";

const issueExplanations = {
  GSTIN_MISSING: {
    description: "GSTIN Missing",
    why: "A required GSTIN was not provided.",
    correction: "Enter the correct GSTIN for the seller or buyer.",
  },
  GSTIN_LENGTH: {
    description: "Invalid GSTIN Length",
    why: "A GSTIN must contain exactly 15 characters.",
    correction: "Verify the GSTIN and enter all 15 characters.",
  },
  GSTIN_FORMAT: {
    description: "Invalid GSTIN Format",
    why: "The GSTIN does not follow the required character pattern.",
    correction: "Check the state code, PAN characters, entity number and check character.",
  },
  GSTIN_STATE: {
    description: "Invalid GSTIN State Code",
    why: "The GSTIN contains an unrecognized state code.",
    correction: "Verify the first two digits of the GSTIN.",
  },
  GSTIN_CHECKSUM: {
    description: "GSTIN Check Character Mismatch",
    why: "The final GSTIN character does not match the calculated check character.",
    correction: "Verify the GSTIN against the correct registration details.",
  },
  GSTIN_STATE_MISMATCH: {
    description: "GSTIN State Mismatch",
    why: "The first two GSTIN digits do not match the invoice state code.",
    correction: "Verify the GSTIN and the corresponding invoice state code.",
  },
  INVALID_TAX_TYPE: {
    description: "Incorrect Tax Type",
    why: "The tax type does not match the intra-state or inter-state transaction.",
    correction: "Verify the place of supply and apply the appropriate GST type.",
  },
  CGST_SGST_UNEQUAL: {
    description: "CGST and SGST Mismatch",
    why: "CGST and SGST amounts are not equal for an intra-state transaction.",
    correction: "Recheck the tax calculation and correct the CGST and SGST amounts.",
  },
  TOTAL_MISMATCH: {
    description: "Invoice Total Mismatch",
    why: "The invoice total differs from the calculated total.",
    correction: "Recalculate taxable value + CGST + SGST + IGST and correct the total.",
  },
  DUPLICATE_INVOICE: {
    description: "Duplicate Invoice",
    why: "An earlier invoice with the same invoice number, seller GSTIN, date and taxable value exists.",
    correction: "Verify whether this is a duplicate upload or a separate legitimate invoice.",
  },
};

function InvoiceTable({ invoices, loading, error }) {
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    getInvoiceIssues()
      .then((data) => {
        setIssues(data);
        setIssuesLoading(false);
      })
      .catch((err) => {
        setIssuesError(err.message);
        setIssuesLoading(false);
      });
  }, []);

  const getInvoiceIssuesList = (invoiceId) => {
    return issues.filter(
      (issue) => String(issue.invoiceId) === String(invoiceId)
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-[#E9DED3]">
        <table className="w-full text-left">

          <thead className="bg-[#F5F0E9] text-[#806D60] text-sm">
            <tr>
              <th className="p-4 font-semibold whitespace-nowrap">
                Invoice Number
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                Date
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                Seller GSTIN
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                Taxable Value
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                Risk Level
              </th>
              <th className="p-4 font-semibold whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="text-sm text-[#493B35]">

            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#927F71]">
                  Loading invoices...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[#927F71]">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-[#F0E8E0] last:border-b-0 hover:bg-[#FCF9F5] transition-colors"
                >
                  <td className="p-4 font-medium whitespace-nowrap">
                    {inv.invoiceNumber}
                  </td>

                  <td className="p-4 whitespace-nowrap text-[#65564D]">
                    {inv.invoiceDate}
                  </td>

                  <td className="p-4 whitespace-nowrap text-[#65564D]">
                    {inv.sellerGstin}
                  </td>

                  <td className="p-4 font-medium whitespace-nowrap">
                    ₹{Number(inv.taxableValue).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <RiskBadge riskLevel={inv.riskLevel} />
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-[#96745B] font-semibold hover:text-[#493B35] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl border border-[#E9DED3]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-[#E9DED3]">
              <div>
                <h2 className="text-xl font-bold text-[#493B35]">
                  Invoice Details
                </h2>
                <p className="text-sm text-[#927F71] mt-1">
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-[#806D60] hover:text-[#493B35] text-2xl"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#806D60]">
                  Risk Level
                </span>
                <RiskBadge riskLevel={selectedInvoice.riskLevel} />
              </div>

              {issuesLoading ? (
                <p className="text-[#927F71] text-center py-6">
                  Loading issue details...
                </p>
              ) : issuesError ? (
                <p className="text-red-600 text-sm">
                  Unable to load issue details: {issuesError}
                </p>
              ) : getInvoiceIssuesList(selectedInvoice.id).length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="font-semibold text-green-800">
                    No Issues Found
                  </h3>
                  <p className="text-sm text-green-700 mt-2">
                    All available validation checks passed for this invoice.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getInvoiceIssuesList(selectedInvoice.id).map((issue) => {
                    const explanation = issueExplanations[issue.ruleCode];

                    return (
                      <div
                        key={issue.id}
                        className="border border-[#E9DED3] rounded-xl p-5 space-y-3"
                      >
                        <div className="flex justify-between items-center gap-3">
                          <h3 className="font-semibold text-[#493B35]">
                            {explanation?.description || issue.ruleCode}
                          </h3>

                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            issue.severity === "HIGH"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {issue.severity}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[#96745B]">
                            WHAT WENT WRONG
                          </p>
                          <p className="text-sm text-[#65564D] mt-1">
                            {issue.message}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[#96745B]">
                            WHY IT WAS FLAGGED
                          </p>
                          <p className="text-sm text-[#65564D] mt-1">
                            {explanation?.why || "This invoice failed a validation rule."}
                          </p>
                        </div>

                        <div className="bg-[#F5F0E9] rounded-lg p-3">
                          <p className="text-xs font-semibold text-[#96745B]">
                            SUGGESTED CORRECTION
                          </p>
                          <p className="text-sm text-[#493B35] mt-1">
                            {explanation?.correction || "Verify the invoice details and correct the detected issue."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            <div className="p-5 border-t border-[#E9DED3] flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-[#493B35] text-white px-5 py-2 rounded-lg hover:bg-[#655247] transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default InvoiceTable;
