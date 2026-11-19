const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const getVendorRiskProfiles = async () => {
  const response = await fetch(`${API_BASE_URL}/api/vendor-risk`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load vendor risk profiles.");
  }

  return response.json();
};