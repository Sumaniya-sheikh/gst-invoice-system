
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const getAllAuditHistory = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/audit`,
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error("Failed to load audit history.");
  }

  return response.json();
};

export const getInvoiceAuditHistory = async (invoiceId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/audit/invoice/${invoiceId}`,
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error("Failed to load invoice audit history.");
  }

  return response.json();
};
