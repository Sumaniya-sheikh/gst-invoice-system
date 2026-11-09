const API_URL = "http://localhost:8080/api/invoices";

export const getInvoices = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }

  return response.json();
};
export const uploadCsv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "CSV upload failed");
  }

  return response.json();
};