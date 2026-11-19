
import { useEffect, useState } from "react";
import { getVendorRiskProfiles } from "../services/vendorRiskService";

function VendorRisk() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getVendorRiskProfiles()
      .then(setProfiles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const riskColor = (level) => {
    if (level === "HIGH") return "bg-red-100 text-red-700";
    if (level === "MEDIUM") return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <main className="min-w-0 flex-1 overflow-x-auto p-6">
      <h1 className="mb-2 text-2xl font-bold text-[#493B35]">
        Vendor Risk Profile
      </h1>
      <p className="mb-6 text-sm text-[#806F64]">
        Vendor risk is estimated from invoice risk levels and recorded anomalies.
      </p>

      {loading && <p>Loading vendor risk profiles...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-[#E5D9CE] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#493B35] text-white">
              <tr>
                <th className="p-3">Vendor</th>
                <th className="p-3">GSTIN</th>
                <th className="p-3">Invoices</th>
                <th className="p-3">High Risk</th>
                <th className="p-3">Medium Risk</th>
                <th className="p-3">Issues</th>
                <th className="p-3">Duplicates</th>
                <th className="p-3">Score</th>
                <th className="p-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((item) => (
                <tr key={item.vendorId} className="border-t border-[#E5D9CE] text-[#493B35]">
                  <td className="p-3 font-medium">{item.vendorName}</td>
                  <td className="p-3">{item.gstin}</td>
                  <td className="p-3">{item.totalInvoices}</td>
                  <td className="p-3">{item.highRiskInvoices}</td>
                  <td className="p-3">{item.mediumRiskInvoices}</td>
                  <td className="p-3">{item.totalIssues}</td>
                  <td className="p-3">{item.duplicateIssues}</td>
                  <td className="p-3 font-semibold">{item.riskScore}/100</td>
                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskColor(item.riskLevel)}`}>
                      {item.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-[#806F64]">
                    No vendor records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {profiles.map((item) => (
        <p key={`${item.vendorId}-explanation`} className="mt-3 text-xs text-[#806F64]">
          **{item.vendorName}:** {item.explanation}
        </p>
      ))}
    </main>
  );
}

export default VendorRisk;
