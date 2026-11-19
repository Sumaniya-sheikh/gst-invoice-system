
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/gst-summary`;

export const getMonthlyGstSummary = async () => {
  const response = await fetch(`${API_URL}/monthly`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch monthly GST summary.");
  }

  return response.json();
};
