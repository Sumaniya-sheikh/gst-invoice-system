
const API_URL = "http://localhost:8080/api/registers";

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
