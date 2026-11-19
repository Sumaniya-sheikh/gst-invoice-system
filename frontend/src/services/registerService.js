const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/registers`;

export const getSalesRegister = async () => {
  const response = await fetch(`${API_URL}/sales`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load sales register.");
  return response.json();
};

export const getPurchaseRegister = async () => {
  const response = await fetch(`${API_URL}/purchases`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load purchase register.");
  return response.json();
};