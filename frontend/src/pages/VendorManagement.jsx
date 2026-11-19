
import { useEffect, useState } from "react";
import {
  getVendors,
  addVendor,
  updateVendor,
  deactivateVendor,
  getVendorInvoices,
} from "../services/vendorService";

const emptyForm = {
  vendorName: "",
  gstin: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  stateCode: "",
};

function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await getVendors();
      setVendors(data);
      setError("");
    } catch (err) {
      setError(err.response?.data || err.message || "Unable to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: name === "gstin" ? value.toUpperCase() : value,
    }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const openEditForm = (vendor) => {
    setForm({
      vendorName: vendor.vendorName || "",
      gstin: vendor.gstin || "",
      contactPerson: vendor.contactPerson || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      stateCode: vendor.stateCode || "",
    });
    setEditingId(vendor.id);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(form.gstin.trim())) {
      setError("Please enter a valid 15-character GSTIN format.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateVendor(editingId, form);
        setMessage("Vendor updated successfully.");
      } else {
        await addVendor(form);
        setMessage("Vendor added successfully.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadVendors();
    } catch (err) {
      setError(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || err.message || "Unable to save vendor."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (vendor) => {
    if (!window.confirm(`Deactivate ${vendor.vendorName}?`)) return;

    try {
      await deactivateVendor(vendor.id);
      setMessage("Vendor deactivated successfully.");
      setError("");
      await loadVendors();
    } catch (err) {
      setError(err.response?.data || err.message || "Unable to deactivate vendor.");
    }
  };

  const handleInvoiceHistory = async (vendor) => {
    try {
      setSelectedVendor(vendor);
      setInvoices(await getVendorInvoices(vendor.id));
      setError("");
    } catch (err) {
      setSelectedVendor(null);
      setError(err.response?.data || err.message || "Unable to load invoice history.");
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    `${vendor.vendorName} ${vendor.gstin} ${vendor.contactPerson || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-w-0 flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#493B35]">
              Vendor Management
            </h2>
            <p className="mt-2 text-[#806D60]">
              Manage vendor details and view their invoice history.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-xl bg-[#96745B] px-5 py-3 font-semibold text-white transition hover:bg-[#806149]"
          >
            + Add Vendor
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {typeof error === "string" ? error : "Something went wrong."}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-[#E5D9CE] bg-white p-6 shadow-sm"
          >
            <h3 className="mb-5 text-xl font-bold text-[#493B35]">
              {editingId ? "Edit Vendor" : "Add New Vendor"}
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                ["vendorName", "Vendor Name", true],
                ["gstin", "GSTIN", true],
                ["contactPerson", "Contact Person"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["stateCode", "State Code"],
              ].map(([name, label, required]) => (
                <label key={name} className="text-sm font-medium text-[#493B35]">
                  {label}
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={Boolean(required)}
                    maxLength={name === "gstin" ? 15 : undefined}
                    className="mt-2 w-full rounded-lg border border-[#D9C9BC] p-3 outline-none focus:border-[#96745B]"
                  />
                </label>
              ))}
            </div>

            <label className="mt-4 block text-sm font-medium text-[#493B35]">
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="mt-2 w-full rounded-lg border border-[#D9C9BC] p-3 outline-none focus:border-[#96745B]"
              />
            </label>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#493B35] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Vendor" : "Save Vendor"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[#D9C9BC] px-5 py-2.5 text-[#493B35]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mb-5 rounded-2xl border border-[#E5D9CE] bg-white p-5 shadow-sm">
          <input
            type="text"
            placeholder="Search by vendor name, GSTIN or contact person..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-[#D9C9BC] p-3 outline-none focus:border-[#96745B]"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E5D9CE] bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-[#806D60]">Loading vendors...</p>
          ) : filteredVendors.length === 0 ? (
            <p className="p-8 text-center text-[#806D60]">
              No vendors found. Add your first vendor to get started.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F3EBE3] text-[#493B35]">
                <tr>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">GSTIN</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-[#EEE5DD]">
                    <td className="p-4 font-semibold text-[#493B35]">
                      {vendor.vendorName}
                    </td>
                    <td className="p-4">{vendor.gstin}</td>
                    <td className="p-4">
                      <div>{vendor.contactPerson || "—"}</div>
                      <div className="text-xs text-[#806D60]">
                        {vendor.email || vendor.phone || ""}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        vendor.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {vendor.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleInvoiceHistory(vendor)}
                          className="text-[#806149] hover:underline"
                        >
                          History
                        </button>
                        <button
                          onClick={() => openEditForm(vendor)}
                          className="text-blue-700 hover:underline"
                        >
                          Edit
                        </button>
                        {vendor.active && (
                          <button
                            onClick={() => handleDeactivate(vendor)}
                            className="text-red-700 hover:underline"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedVendor && (
          <div className="mt-8 rounded-2xl border border-[#E5D9CE] bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[#493B35]">
                  Invoice History
                </h3>
                <p className="text-sm text-[#806D60]">
                  {selectedVendor.vendorName} · {selectedVendor.gstin}
                </p>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="rounded-lg border border-[#D9C9BC] px-4 py-2 text-[#493B35]"
              >
                Close
              </button>
            </div>

            {invoices.length === 0 ? (
              <p className="text-[#806D60]">No invoices found for this vendor.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F3EBE3] text-[#493B35]">
                    <tr>
                      <th className="p-3">Invoice Number</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Taxable Value</th>
                      <th className="p-3">Total Value</th>
                      <th className="p-3">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-t border-[#EEE5DD]">
                        <td className="p-3">{invoice.invoiceNumber}</td>
                        <td className="p-3">{invoice.invoiceDate}</td>
                        <td className="p-3">₹{invoice.taxableValue}</td>
                        <td className="p-3">₹{invoice.totalInvoiceValue}</td>
                        <td className="p-3">{invoice.riskLevel || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default VendorManagement;
