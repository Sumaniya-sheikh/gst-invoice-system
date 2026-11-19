
const API_URL = "http://localhost:8080/api/gst-summary";

export const getMonthlyGstSummary = async () => {
  const response = await fetch(`${API_URL}/monthly`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch monthly GST summary.");
  }

  return response.json();
};
