
const API_URL = "http://localhost:8080/api/vendors";
const AUTH_URL = "http://localhost:8080/api/auth";

// Obtain CSRF token.
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

// Handle API responses and errors.
const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json();
};

// Get all vendors.
export const getVendors = async () => {
  const response = await fetch(API_URL, {
    credentials: "include",
  });
  return handleResponse(response);
};

// Get active vendors.
export const getActiveVendors = async () => {
  const response = await fetch(`${API_URL}/active`, {
    credentials: "include",
  });
  return handleResponse(response);
};

// Get vendor by ID.
export const getVendorById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    credentials: "include",
  });
  return handleResponse(response);
};

// Add vendor.
export const addVendor = async (vendor) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify(vendor),
  });

  return handleResponse(response);
};

// Update vendor.
export const updateVendor = async (id, vendor) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify(vendor),
  });

  return handleResponse(response);
};

// Deactivate vendor.
export const deactivateVendor = async (id) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/${id}/deactivate`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify({}),
  });

  return handleResponse(response);
};

// Get vendor invoice history.
export const getVendorInvoices = async (id) => {
  const response = await fetch(`${API_URL}/${id}/invoices`, {
    credentials: "include",
  });

  return handleResponse(response);
};

// Search vendors.
export const searchVendors = async (name) => {
  const response = await fetch(
    `${API_URL}/search?name=${encodeURIComponent(name)}`,
    {
      credentials: "include",
    }
  );

  return handleResponse(response);
};
