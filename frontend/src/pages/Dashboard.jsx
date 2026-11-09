import { useRef, useState } from "react";
import { getInvoices, uploadCsv } from "../services/invoiceService";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Download,
} from "lucide-react";

import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import InvoiceTable from "../components/InvoiceTable";

function Dashboard({
  invoices,
  loading,
  error,
  searchTerm,
  setSearchTerm,
onInvoicesUpdated,
})
 {
    const fileInputRef = useRef(null);
const [uploading, setUploading] = useState(false);
const [uploadMessage, setUploadMessage] = useState("");

const handleCsvUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setUploading(true);
  setUploadMessage("");

  try {
    await uploadCsv(file);

   const updatedInvoices = await getInvoices();
    onInvoicesUpdated(updatedInvoices);
    setUploadMessage("CSV uploaded successfully!");
  } catch (error) {
    setUploadMessage(error.message);
  } finally {
    setUploading(false);
    event.target.value = "";
  }
};

  return (
    <main className="flex-1 p-8">
      <Header />

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={FileText}
          title="Total Invoices"
          value={invoices.length}
          color="text-blue-600"
        />

        <StatCard
          icon={ShieldCheck}
          title="Low Risk"
          value={invoices.filter((inv) => inv.riskLevel === "LOW").length}
          color="text-green-600"
        />

        <StatCard
          icon={AlertTriangle}
          title="Medium Risk"
          value={invoices.filter((inv) => inv.riskLevel === "MEDIUM").length}
          color="text-yellow-500"
        />

        <StatCard
          icon={AlertTriangle}
          title="High Risk"
          value={invoices.filter((inv) => inv.riskLevel === "HIGH").length}
          color="text-red-600"
        />
      </section>

      {/* Invoice Section */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Recent Invoices
            </h3>
            <p className="text-sm text-slate-500">
              Invoice records and risk status
            </p>
          </div>

          <div className="flex gap-3">
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCsvUpload}
                className="hidden"
                />
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={17} />
              Upload CSV
            </button>

            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg">
              <Download size={17} />
              Export
            </button>
          </div>
        </div>
        {uploadMessage && (
            <p className="text-sm text-green-600 mb-4">
                {uploadMessage}
            </p>
            )}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <InvoiceTable
          invoices={invoices.filter(
            (inv) =>
              inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              inv.sellerGstin?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          loading={loading}
          error={error}
        />
      </section>
    </main>
  );
}

export default Dashboard;