
export const getVendorRiskProfiles = async () => {
  const response = await fetch("http://localhost:8080/api/vendor-risk", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load vendor risk profiles.");
  }

  return response.json();
};
