
const API_URL = "http://localhost:8080/api/invoices";
const AUTH_URL = "http://localhost:8080/api/auth";

// Get CSRF token for POST requests.
const getCsrfToken = async () => {
  const response = await fetch(`${AUTH_URL}/csrf`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to obtain security token");
  }

  const data = await response.json();
  return data.token;
};

// Fetch all invoices.
export const getInvoices = async () => {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }

  return response.json();
};

// Upload CSV.
export const uploadCsv = async (file) => {
  const csrfToken = await getCsrfToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": csrfToken,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "CSV upload failed");
  }

  return response.json();
};

// Export invoices as CSV.
export const exportInvoicesCsv = async () => {
  const response = await fetch(`${API_URL}/export`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to export invoices");
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "invoices.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(downloadUrl);
};

// Fetch invoice issues.
export const getInvoiceIssues = async () => {
  const response = await fetch(`${API_URL}/issues`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invoice issues");
  }

  return response.json();
};
