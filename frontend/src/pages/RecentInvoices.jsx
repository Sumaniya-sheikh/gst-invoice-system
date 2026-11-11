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
    <main className="flex-1 min-w-0 bg-[#F5F0E9] p-8 text-[#493B35]">
      <section className="bg-white border border-[#E9DED3] rounded-2xl shadow-sm p-6">

        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#493B35]">
            All Uploaded Invoices
            </h2>

            <p className="text-sm text-[#927F71] mt-1">
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
              className="flex items-center gap-2 bg-[#96745B] hover:bg-[#806047] disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Upload size={17} />
              {uploading ? "Uploading..." : "Upload CSV"}
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 border border-[#D8C7B7] bg-[#FAF7F3] hover:bg-[#F0E7DD] text-[#493B35] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Download size={17} />
              Export
            </button>
          </div>
        </div>

        {uploadMessage && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
            {uploadMessage}
          </p>
        )}

        {exportMessage && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
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