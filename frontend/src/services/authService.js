const AUTH_URL = "http://localhost:8080/api/auth";

// Get CSRF token
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

// Admin / Business User login
export const login = async (username, password) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};

// Check current session
export const getCurrentUser = async () => {
  const response = await fetch(`${AUTH_URL}/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

// Logout
export const logout = async () => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
};