
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const AUTH_URL = `${API_BASE_URL}/api/auth`;
const ADMIN_URL = `${API_BASE_URL}/api/admin/users`;

export const getCsrfToken = async () => {
  const response = await fetch(`${AUTH_URL}/csrf`, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Failed to obtain security token");
  }

  return (await response.json()).token;
};

const request = async (url, method = "POST", body) => {
  const csrfToken = await getCsrfToken();

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken
    },
    ...(body === undefined ? {} : {
      body: JSON.stringify(body)
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

export const login = (username, password) =>
  request(`${AUTH_URL}/login`, "POST", { username, password });

export const getCurrentUser = async () => {
  const response = await fetch(`${AUTH_URL}/me`, {
    credentials: "include"
  });

  if (!response.ok) return null;

  return response.json();
};

export const logout = () =>
  request(`${AUTH_URL}/logout`, "POST");

export const updateEmail = (email) =>
  request(`${AUTH_URL}/email`, "PUT", { email });

export const resendVerification = () =>
  request(`${AUTH_URL}/send-verification`, "POST", {});

export const resendVerificationByEmail = (email) =>
  request(`${AUTH_URL}/resend-verification`, "POST", { email });

export const forgotPassword = (email) =>
  request(`${AUTH_URL}/forgot-password`, "POST", { email });

export const resetPassword = (token, password, confirmPassword) =>
  request(`${AUTH_URL}/reset-password`, "POST", {
    token,
    password,
    confirmPassword
  });

export const verifyEmail = async (token) => {
  const response = await fetch(
    `${AUTH_URL}/verify-email?token=${encodeURIComponent(token)}`,
    { credentials: "include" }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Email verification failed");
  }

  return data;
};

export const getAdminUsers = async () => {
  const response = await fetch(ADMIN_URL, {
    credentials: "include"
  });

  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data.error || "Could not load users");
  }

  return data;
};

export const createBusinessUser = (username, email, password) =>
  request(ADMIN_URL, "POST", { username, email, password });

export const updateBusinessUserStatus = (id, active) =>
  request(`${ADMIN_URL}/${id}/status`, "PUT", { active });

export const changePassword = (
  currentPassword,
  newPassword,
  confirmPassword
) =>
  request(`${AUTH_URL}/password`, "PUT", {
    currentPassword,
    newPassword,
    confirmPassword
  });

export const updateBusinessUser = (id, username, email) =>
  request(`${ADMIN_URL}/${id}`, "PUT", { username, email });

export const resendUserVerification = (id) =>
  request(`${ADMIN_URL}/${id}/resend-verification`, "POST", {});
