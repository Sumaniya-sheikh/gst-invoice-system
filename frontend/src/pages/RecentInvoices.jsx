import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

import SearchBar from "../components/SearchBar";
import InvoiceTable from "../components/InvoiceTable";

import {
  uploadCsv,
  exportInvoicesCsv,
  getInvoices,
} from "../services/invoiceService";

function RecentInvoices({
  invoices,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  onInvoicesUpdated,
}) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const handleExport = () => {
    exportInvoicesCsv();
    setExportMessage(
      "CSV download started! Check your Downloads folder."
    );
  };

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

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inv.sellerGstin
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 p-8">
      <section className="bg-white rounded-xl shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Invoices
            </h2>

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
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Upload size={17} />
              {uploading ? "Uploading..." : "Upload CSV"}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg"
            >
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

        {exportMessage && (
          <p className="text-sm text-green-600 mb-4">
            {exportMessage}
          </p>
        )}

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <InvoiceTable
          invoices={filteredInvoices}
          loading={loading}
          error={error}
        />

      </section>
    </main>
  );
}

export default RecentInvoices;