
export const getAllAuditHistory = async () => {
  const response = await fetch(
    "http://localhost:8080/api/audit",
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error("Failed to load audit history.");
  }

  return response.json();
};

export const getInvoiceAuditHistory = async (invoiceId) => {
  const response = await fetch(
    `http://localhost:8080/api/audit/invoice/${invoiceId}`,
    { credentials: "include" }
  );

  if (!response.ok) {
    throw new Error("Failed to load invoice audit history.");
  }

  return response.json();
};
