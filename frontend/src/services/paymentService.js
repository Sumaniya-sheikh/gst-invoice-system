
const API_URL = "http://localhost:8080/api/payments";
const AUTH_URL = "http://localhost:8080/api/auth";

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

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
};

// Get all payments.
export const getAllPayments = async () => {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  return handleResponse(response);
};

// Get payments for an invoice.
export const getInvoicePayments = async (invoiceId) => {
  const response = await fetch(
    `${API_URL}/invoice/${invoiceId}`,
    { credentials: "include" }
  );

  return handleResponse(response);
};

// Get total amount paid.
export const getTotalPaid = async (invoiceId) => {
  const response = await fetch(
    `${API_URL}/invoice/${invoiceId}/paid`,
    { credentials: "include" }
  );

  return handleResponse(response);
};

// Get outstanding balance.
export const getOutstandingBalance = async (invoiceId) => {
  const response = await fetch(
    `${API_URL}/invoice/${invoiceId}/balance`,
    { credentials: "include" }
  );

  return handleResponse(response);
};

// Record a payment.
export const addPayment = async (invoiceId, payment) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(
    `${API_URL}/invoice/${invoiceId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify(payment),
    }
  );

  return handleResponse(response);
};
